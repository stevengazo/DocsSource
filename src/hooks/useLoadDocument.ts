import { useEffect } from 'react';

export function useLoadDocument(editor: any, content: any) {
    useEffect(() => {
        if (!content) return;

        editor.update(() => {
            const state = editor.parseEditorState(content);
            editor.setEditorState(state);
        });
    }, [content, editor]);
}