import { useEffect, useMemo, useState, type JSX } from 'react';
import { motion } from 'framer-motion';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { mediaFileReader } from '@lexical/utils';

import ImagePlugin, { ImageNode, INSERT_IMAGE_COMMAND,  } from './plugins/ImagePlugin';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import { DebugPanel } from '../DebugPanel';
import theme from './theme';

function onError(error: Error): void {
  console.error(error);
}

export default function Editor(): JSX.Element {
  const [editorJSON, setEditorJSON] = useState<string>('');
  const [tab, setTab] = useState<'editor' | 'debug'>('editor');

  const initialConfig: InitialConfigType = useMemo(() => ({
    namespace: 'MyEditor',
    theme: theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ImageNode,
      AutoLinkNode,
    ],
  }), []);


  const onChange = (state: import('lexical').EditorState): void => {
    const json = state.toJSON();
    setEditorJSON(JSON.stringify(json));
  };

  const handleImageUpload = async (files: File[], editor: import('lexical').LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach(file => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 p-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 relative">
          {['editor', 'debug'].map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t as 'editor' | 'debug')}
                className="relative px-4 py-2 text-sm font-medium"
              >
                <span className={`relative z-10 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {t === 'editor' ? 'Editor' : 'Debug'}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-white border-x border-t border-gray-200 rounded-t-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <LexicalComposer initialConfig={initialConfig}>

          {/* Toolbar */}
          {tab === 'editor' && (
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <ToolbarPlugin onUploadImages={handleImageUpload} />
            </div>
          )}

          {/* Content */}
          <div className="p-4 min-h-[250px]">
            {tab === 'editor' ? (
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
            ) : (
              <DebugPanel data={editorJSON} />
            )}
          </div>

          {/* Plugins */}
          <HistoryPlugin />
          <ListPlugin />
          <ImagePlugin/>
          <AutoFocusPlugin />
          <MyOnChangePlugin onChange={onChange} />

        </LexicalComposer>
      </div>
    </div>
  );
}