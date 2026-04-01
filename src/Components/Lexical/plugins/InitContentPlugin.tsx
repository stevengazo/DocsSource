import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface InitContentPluginProps {
  initialContent: any;
}

export default function InitContentPlugin({ initialContent }: InitContentPluginProps) {
  const [editor] = useLexicalComposerContext();

    useEffect(() => {
    if (!initialContent) return;

    try {
      const editorState = editor.parseEditorState(initialContent);
      editor.setEditorState(editorState);
    } catch (e) {
      console.error('Error parsing editor state', e);
    }
  }, []);

  return null;
}