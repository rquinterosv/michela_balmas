import { IconItemsEditor } from "../../admin/IconItemsEditor";
import type { BlockEditorProps } from "../editorTypes";

export default function TimelineEditor(props: BlockEditorProps<"timeline">) {
  return <IconItemsEditor {...props} variant="step" defaultIcon="flag" />;
}
