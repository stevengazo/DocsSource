import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import type { EditorState, LexicalEditor } from "lexical";
import { $getRoot } from "lexical";

type OnChangePluginProps = {
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
};

export default function MyOnChangePlugin({
  onChange,
}: OnChangePluginProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Leer el estado de forma segura
      editorState.read(() => {
        const root = $getRoot();

        // Texto plano
        const text = root.getTextContent();

        // JSON estructurado (para guardar en DB)
        const json = editorState.toJSON();

        console.log("📝 Texto:", text);
        console.log("📦 JSON:", json);
      });

      // Callback opcional hacia el padre
      if (onChange) {
        onChange(editorState, editor);
      }
    });
  }, [editor, onChange]);

  return null;
}