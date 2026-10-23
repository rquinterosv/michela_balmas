import { env } from "../env";

// El sitio público es una copia del contenido hecha en el build del frontend
// (client/siteContentPlugin.ts). Tras un cambio en el panel hay que repetir el
// build: se llama al "Deploy Hook" de Vercel (DEPLOY_HOOK_URL). Sin la variable
// (desarrollo, tests) no hace nada.

// Se espera un poco por si llegan más cambios seguidos (guardar varias veces,
// reordenar), para lanzar un solo build y no uno por cada clic.
const REBUILD_DELAY_MS = 15_000;

let pendingRebuild: ReturnType<typeof setTimeout> | undefined;

export function scheduleSiteRebuild(): void {
  const hookUrl = env.DEPLOY_HOOK_URL;
  if (!hookUrl) return;

  clearTimeout(pendingRebuild);
  pendingRebuild = setTimeout(() => {
    fetch(hookUrl, { method: "POST" })
      .then((response) => {
        if (!response.ok) console.error(`Deploy Hook: respuesta ${response.status}`);
      })
      .catch((error: unknown) => {
        console.error("Deploy Hook: no se pudo llamar", error);
      });
  }, REBUILD_DELAY_MS);
}
