import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Desplazamiento suave, salvo que el visitante haya pedido reducir las animaciones.
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// Espera, como mucho `maxMs`, a que carguen las imágenes que hay por encima del
// destino: mientras no cargan no ocupan su alto, y el destino se movería hacia abajo
// justo después de llegar.
function waitForImagesAbove(target: Element, maxMs: number): Promise<void> {
  const pending = Array.from(document.images).filter(
    (image) =>
      !image.complete &&
      // El destino va después de la imagen en la página.
      Boolean(image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
  if (pending.length === 0) return Promise.resolve();

  const allLoaded = Promise.all(
    pending.map(
      (image) =>
        new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        }),
    ),
  );
  const timeout = new Promise((resolve) => setTimeout(resolve, maxMs));
  return Promise.race([allLoaded, timeout]).then(() => undefined);
}

// Lleva hasta el elemento del ancla de la dirección (p. ej. /#chi-sono) cuando el
// contenido de la página ya está dibujado (`ready`). Se repite en cada navegación,
// también al volver a pulsar el mismo enlace. La subida al principio de la página
// en los cambios de ruta sin ancla la hace PublicLayout.
export function useScrollToHash(ready: boolean) {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!ready || !hash) return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    // Ancla que no existe en esta página: se queda arriba, como cualquier página.
    if (!target) {
      window.scrollTo(0, 0);
      return;
    }

    let cancelled = false;
    void waitForImagesAbove(target, 1000).then(() => {
      // El siguiente frame asegura que el menú móvil ya se ha cerrado y no cuenta en el alto.
      requestAnimationFrame(() => {
        if (cancelled) return;
        // La cabecera es fija (sticky) y taparía el principio de la sección.
        const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: scrollBehavior() });
        // Para lectores de pantalla y teclado: la lectura sigue desde la sección.
        target.focus({ preventScroll: true });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [ready, hash, key]);
}
