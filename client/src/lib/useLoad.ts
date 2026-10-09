import { useEffect, useState } from "react";
import { it } from "../i18n/it";
import { ApiRequestError } from "./api";

export type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiRequestError }
  | { status: "ready"; data: T };

// Carga datos al montar el componente y cada vez que cambia algo de `deps`.
// Devuelve el estado (cargando / error / listo) y `reload` para reintentar.
//
//   const { state, reload } = useLoad(() => api.getPage(slug), [slug]);
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Si el componente se desmonta o cambian las deps antes de que llegue la
    // respuesta, se ignora: evita mostrar datos de una petición vieja.
    let cancelled = false;
    setState({ status: "loading" });

    load()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const apiError =
          error instanceof ApiRequestError ? error : new ApiRequestError(0, it.common.error);
        setState({ status: "error", error: apiError });
      });

    return () => {
      cancelled = true;
    };
    // `load` se crea en cada render; lo que decide cuándo recargar son las deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { state, reload: () => setAttempt((n) => n + 1) };
}
