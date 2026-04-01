import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface InitContentPluginProps {
  initialContent: any;
}

export default function InitContentPlugin({ initialContent }: InitContentPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialContent) {
      console.warn('InitContentPlugin: initialContent is undefined or null');
      return;
    }

    if (!initialContent.children) {
      console.warn('InitContentPlugin: initialContent has no children', initialContent);
    }

    try {
      editor.update(() => {
        console.log('InitContentPlugin: loading initial content', initialContent);
        editor.setEditorState(editor.parseEditorState(JSON.stringify(initialContent)));
      });
    } catch (err) {
      console.error('InitContentPlugin: failed to set editor state', err, initialContent);
    }
  }, [editor, initialContent]);

  return null;
}