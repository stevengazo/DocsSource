import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export default function AutoSavePlugin({ onSave }: any) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const json = editorState.toJSON();
                onSave(json);
            });
        });
    }, [editor, onSave]);

    return null;
}