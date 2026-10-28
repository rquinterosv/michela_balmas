import { useEffect, useRef, useState } from "react";

// Avisa de qué hijos de una lista han entrado ya en pantalla, para mostrarlos con
// una aparición suave. Cada hijo lleva `data-index`. Una vez visible, se queda así.
// El efecto en sí (y su desactivación con prefers-reduced-motion) va en el CSS.
//
//   const { ref, isRevealed } = useRevealOnScroll<HTMLOListElement>(items.length);
export function useRevealOnScroll<T extends HTMLElement>(count: number) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(new Set());

  useEffect(() => {
    const children = ref.current ? Array.from(ref.current.children) : [];

    // Navegador sin IntersectionObserver: se muestra todo.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(new Set(children.map((_, index) => index)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => {
            observer.unobserve(entry.target);
            return Number((entry.target as HTMLElement).dataset.index);
          });
        if (shown.length > 0) setRevealed((current) => new Set([...current, ...shown]));
      },
      // Aparece en cuanto entra un poco en pantalla (el margen de abajo deja un
      // 12 % de aire). Sin umbral de área: una sección más alta que la pantalla
      // nunca llegaría a mostrar un porcentaje fijo de sí misma.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [count]);

  return { ref, isRevealed: (index: number) => revealed.has(index) };
}
