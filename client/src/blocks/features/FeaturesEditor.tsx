import { IconItemsEditor } from "../../admin/IconItemsEditor";
import type { BlockEditorProps } from "../editorTypes";

export default function FeaturesEditor(props: BlockEditorProps<"features">) {
  return <IconItemsEditor {...props} variant="card" defaultIcon="heart" />;
}
