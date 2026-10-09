import type { Block } from "@studio/shared";
import type { ComponentType } from "react";
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

// Los bloques de una página, uno debajo de otro.
export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
