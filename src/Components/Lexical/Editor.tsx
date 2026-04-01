// src/Components/Lexical/Editor.tsx
import { useMemo, useState, type JSX } from 'react';
import { motion } from 'framer-motion';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { DividerNode } from './plugins/DividerNode';
import { mediaFileReader } from '@lexical/utils';
import { useTheme } from '../../context/ThemeContext';

import ImagePlugin, { ImageNode, INSERT_IMAGE_COMMAND } from './plugins/ImagePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import { DebugPanel } from '../DebugPanel';
import theme from './theme';

function onError(error: Error): void {
  console.error(error);
}

// Hook para manejar estado y lógica del editor
function useEditorState() {
  const [editorJSON, setEditorJSON] = useState<string>('');
  const [tab, setTab] = useState<'editor' | 'debug'>('editor');

  const initialConfig = useMemo(() => ({
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ImageNode,
      AutoLinkNode,
      DividerNode,
    ],
  }), []);

  const onChange = (state: import('lexical').EditorState) => {
    const json = state.toJSON();
    setEditorJSON(JSON.stringify(json));
  };

  const handleImageUpload = async (files: File[], editor: import('lexical').LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach(file => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  return { editorJSON, tab, setTab, initialConfig, onChange, handleImageUpload };
}

export default function Editor(): JSX.Element {
  const { editorJSON, tab, setTab, initialConfig, onChange, handleImageUpload } = useEditorState();
  const { theme: appTheme } = useTheme(); // Dark / Light mode

  const bgClass = appTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  const borderClass = appTheme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const tabText = (isActive: boolean) =>
    isActive ? (appTheme === 'dark' ? 'text-white' : 'text-gray-900') : (appTheme === 'dark' ? 'text-gray-300' : 'text-gray-500');

  return (
    <div className={`h-full flex flex-col p-4 ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className={`max-w-3xl w-full mx-auto rounded-xl shadow-sm border ${borderClass} overflow-hidden ${bgClass}`}>

        {/* Tabs */}
        <div className={`flex border-b ${borderClass} relative ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {['editor', 'debug'].map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t as 'editor' | 'debug')}
                className="relative px-4 py-2 text-sm font-medium"
              >
                <span className={`relative z-10 ${tabText(isActive)}`}>
                  {t === 'editor' ? 'Editor' : 'Debug'}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={`absolute inset-0 rounded-t-lg ${appTheme === 'dark' ? 'bg-gray-700 border-x border-t border-gray-600' : 'bg-white border-x border-t border-gray-200'}`}
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
            <div className={`sticky top-0 z-10 border-b ${borderClass} ${bgClass}`}>
              <ToolbarPlugin onUploadImages={handleImageUpload} />
            </div>
          )}

          {/* Content */}
          <div className="p-4 min-h-[250px]">
            {tab === 'editor' ? (
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={`min-h-[200px] outline-none text-sm leading-relaxed ${appTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    aria-placeholder="Ingrese algún texto..."
                    placeholder={
                      <div className={`${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'} pointer-events-none`}>
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
          <ImagePlugin />
          <MyOnChangePlugin onChange={onChange} />
        </LexicalComposer>
      </div>
    </div>
  );
}