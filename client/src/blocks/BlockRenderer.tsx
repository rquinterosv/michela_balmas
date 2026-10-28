import type { Block, BlockType } from "@studio/shared";
import type { ComponentType } from "react";
import { useRevealOnScroll } from "../lib/useRevealOnScroll";
import styles from "./BlockRenderer.module.css";
import { blockRegistry } from "./registry";

// Dibuja un bloque con el componente que le corresponde según su tipo.
export function BlockRenderer({ block }: { block: Block }) {
  // El registro garantiza que cada tipo tiene el componente para sus propios datos,
  // pero TypeScript no puede seguir esa relación a través de `block.type`: de ahí el `as`.
  const Render = blockRegistry[block.type].RenderComponent as ComponentType<{
    data: Block["data"];
  }>;

  return <Render data={block.data} />;
}

// La cabecera ("hero") tiene su propia entrada al cargar la página. El formulario de
// contacto se queda como está, sin animación.
const NOT_REVEALED: BlockType[] = ["hero", "contactForm"];

// Los bloques de una página, uno debajo de otro. Cada uno aparece con un fundido
// suave al llegar a él (salvo con prefers-reduced-motion, ver el CSS).
export function BlockList({ blocks }: { blocks: Block[] }) {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>(blocks.length);

  return (
    <div ref={ref}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          data-index={index}
          className={
            NOT_REVEALED.includes(block.type) || isRevealed(index)
              ? `${styles.block} ${styles.revealed}`
              : styles.block
          }
        >
          <BlockRenderer block={block} />
        </div>
      ))}
    </div>
  );
}
