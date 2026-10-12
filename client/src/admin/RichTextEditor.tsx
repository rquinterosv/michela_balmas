import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { it } from "../i18n/it";
import styles from "./RichTextEditor.module.css";

interface RichTextEditorProps {
  id: string;
  label: string;
  // HTML inicial. El editor es quien manda después: avisa de cada cambio con onChange.
  value: string;
  onChange: (html: string) => void;
  error?: string;
}

// Editor de texto sencillo (TipTap): negrita, cursiva, listas y enlaces.
// La psicóloga nunca ve HTML ni Markdown. Las etiquetas que produce son las
// mismas que deja pasar el backend (server/src/services/sanitizeHtml.ts):
// si se activa un formato nuevo aquí, hay que permitirlo también allí.
export function RichTextEditor({ id, label, value, onChange, error }: RichTextEditorProps) {
  const labelId = `${id}-label`;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Solo lo que el panel ofrece; el resto se desactiva.
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          // Los enlaces se abren en la misma pestaña (sin target ni rel añadidos).
          HTMLAttributes: { target: null, rel: null },
        },
      }),
    ],
    content: value,
    // Redibuja en cada cambio para que los botones reflejen el formato del cursor.
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        class: styles.content ?? "",
      },
    },
  });

  return (
    <div className={styles.field}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={`${styles.editor} ${error ? styles.editorInvalid : ""}`}>
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const labels = it.admin.richTextEditor;

  function editLink() {
    const current = (editor.getAttributes("link").href as string | undefined) ?? "";
    const input = window.prompt(labels.linkPrompt, current);
    if (input === null) return; // canceló

    const url = input.trim();
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    // "www.esempio.it" -> "https://www.esempio.it". Las rutas del sitio ("/contatti")
    // y los mailto:/tel: se dejan como están.
    const hasScheme = /^(https?:|mailto:|tel:|\/)/i.test(url);
    editor
      .chain()
      .focus()
      .setLink({ href: hasScheme ? url : `https://${url}` })
      .run();
  }

  return (
    <div className={styles.toolbar} role="toolbar" aria-label={labels.toolbar}>
      <ToolbarButton
        label={labels.bold}
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>G</strong>
      </ToolbarButton>
      <ToolbarButton
        label={labels.italic}
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>C</em>
      </ToolbarButton>
      <ToolbarButton
        label={labels.bulletList}
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • {labels.bulletListShort}
      </ToolbarButton>
      <ToolbarButton
        label={labels.orderedList}
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. {labels.orderedListShort}
      </ToolbarButton>
      <ToolbarButton label={labels.link} active={editor.isActive("link")} onClick={editLink}>
        {labels.linkShort}
      </ToolbarButton>
    </div>
  );
}

interface ToolbarButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, active, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={styles.toolbarButton}
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
