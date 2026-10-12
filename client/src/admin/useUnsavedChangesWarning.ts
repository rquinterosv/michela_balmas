import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { it } from "../i18n/it";

// Avisa antes de perder cambios sin guardar, tanto al navegar dentro del panel
// como al cerrar o recargar la pestaña.
//
//   const { allowNextNavigation } = useUnsavedChangesWarning(dirty);
//
// allowNextNavigation() se llama justo antes de un navigate() que no debe
// preguntar (p. ej. después de guardar una página nueva).
export function useUnsavedChangesWarning(dirty: boolean) {
  // En un ref para que el bloqueo lea siempre el valor más reciente.
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  // Navegación dentro de la aplicación.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirtyRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm(it.admin.common.unsavedChanges)) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  // Cerrar o recargar la pestaña: el navegador muestra su propio aviso.
  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  return {
    allowNextNavigation: () => {
      dirtyRef.current = false;
    },
  };
}
