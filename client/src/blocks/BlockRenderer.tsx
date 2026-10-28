import type { Block, BlockType } from "@studio/shared";
import type { ComponentType } from "react";
import { HOME_SECTION_ANCHORS } from "../lib/paths";
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

const anchors: Partial<Record<BlockType, string>> = HOME_SECTION_ANCHORS;

// Los bloques de una página, uno debajo de otro. Cada uno aparece con un fundido
// suave al llegar a él (salvo con prefers-reduced-motion, ver el CSS).
// `withAnchors` (solo la Home): la primera sección de cada tipo de
// HOME_SECTION_ANCHORS lleva su ancla, a la que baja el menú (/#tariffe…).
export function BlockList({
  blocks,
  withAnchors = false,
}: {
  blocks: Block[];
  withAnchors?: boolean;
}) {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>(blocks.length);

  return (
    <div ref={ref}>
      {blocks.map((block, index) => {
        const anchor = anchors[block.type];
        const isFirstOfType = blocks.findIndex((other) => other.type === block.type) === index;
        const id = withAnchors && anchor && isFirstOfType ? anchor : undefined;
        return (
          <div
            key={block.id}
            data-index={index}
            // tabIndex: recibe el foco al llegar por el ancla (ver useScrollToHash).
            id={id}
            tabIndex={id ? -1 : undefined}
            className={
              NOT_REVEALED.includes(block.type) || isRevealed(index)
                ? `${styles.block} ${styles.revealed}`
                : styles.block
            }
          >
            <BlockRenderer block={block} />
          </div>
        );
      })}
    </div>
  );
}
