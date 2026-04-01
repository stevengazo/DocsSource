import { useEffect, useState, type JSX } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
    LexicalComposer,
    type InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import { DebugPanel } from '../DebugPanel';

function onError(error: Error): void {
    console.error(error);
}

export default function Editor(): JSX.Element {
    // ✅ ahora guardamos el JSON serializado correctamente
    const [editorJSON, setEditorJSON] = useState<string>('');

    const initialConfig: InitialConfigType = {
        namespace: 'MyEditor',
        theme: {},
        onError,
    };


    useEffect( ()=>{
        console.log("Editor JSON actualizado:", editorJSON);
    } ,[editorJSON])


    const onChange = (state: import('lexical').EditorState): void => {
        const json = state.toJSON();
        const serialized = JSON.stringify(json);
        console.log(serialized)
        // guardar
        setEditorJSON(serialized);


    };

    return (
  <div className="h-full flex flex-col bg-gray-50 p-4">
    <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
      
      <LexicalComposer initialConfig={initialConfig}>
        
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl">
          <ToolbarPlugin />
        </div>

        {/* Editor */}
        <div className="px-4 py-3">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[200px] outline-none text-sm leading-relaxed text-gray-800"
                aria-placeholder="Ingrese algún texto..."
                placeholder={
                  <div className="text-gray-400 pointer-events-none">
                    Empieza a escribir algo...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* Plugins invisibles */}
        <HistoryPlugin />
        <AutoFocusPlugin />
        <MyOnChangePlugin onChange={onChange} />
        
      </LexicalComposer>
    </div>

    {/* Debug Panel */}
    <div className="max-w-3xl w-full mx-auto mt-4">
      <DebugPanel data={editorJSON} />
    </div>
  </div>
);
    
}