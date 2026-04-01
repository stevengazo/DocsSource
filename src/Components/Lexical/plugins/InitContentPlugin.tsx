import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface InitContentPluginProps {
  initialContent: any;
}

export default function InitContentPlugin({ initialContent }: InitContentPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialContent) return;

    editor.update(() => {
      editor.setEditorState(editor.parseEditorState(JSON.stringify(initialContent)));
    });
  }, [editor, initialContent]);

  return null;
}