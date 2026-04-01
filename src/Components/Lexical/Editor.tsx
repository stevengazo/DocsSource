
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';

function onError(error: Error) {
    console.error(error);
}


function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme: {},
        onError,
    };

    return (
        <div className='border rounded shadow-sm p-2 m-4 border-red-400'>
            <LexicalComposer initialConfig={initialConfig}>
                <div className='border rounded border-blue-300'>
                    <ToolbarPlugin />

                </div>

                <div className='border rounded shadow-sm m-1 border-red-400'>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                aria-placeholder={'Ingrese algun texto...'}
                                placeholder={<div>Ingrese algun texto...</div>}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                </div>
                <div className='border rounded border-amber-300'>
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                </div>

            </LexicalComposer>
        </div>

    );
}

export default Editor;