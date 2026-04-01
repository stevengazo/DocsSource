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
import { mediaFileReader } from '@lexical/utils';
import { DividerNode } from './plugins/DividerNode';
import { useTheme } from '../../context/ThemeContext';
import { useTabs } from '../../hooks/useTabs';
import TableOfContents from './TableOfContents';

import ImagePlugin, { ImageNode, INSERT_IMAGE_COMMAND } from './plugins/ImagePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import InitContentPlugin from './plugins/InitContentPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import { DebugPanel } from '../DebugPanel';
import theme from './theme';
import { $getRoot } from 'lexical';
import type { RootNode } from '../../types/DocumentNodes';

interface EditorProps {
  content: any;
  updateDocument: (doc: any) => void;
}

function onError(error: Error): void {
  // console.error(error);
}

export default function Editor({ content, updateDocument }: EditorProps): JSX.Element {
  const { theme: appTheme } = useTheme();
  const [editorJSON, setEditorJSON] = useState<string>(JSON.stringify(content || {}));
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);

  // Hook de tabs
  const { activeTab, selectTab, getTabTextClass } = useTabs({
    initialTab: 'editor',
    tabs: ['editor', 'debug'],
  });

  // Configuración inicial del editor
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
      AutoLinkNode,
      DividerNode,
      ImageNode,
    ],
  }), []);

  // Manejo de cambios en el editor
  const onChange = (editorState: import('lexical').EditorState, editor: import('lexical').LexicalEditor) => {
    const serialized = editorState.toJSON();
    setEditorJSON(JSON.stringify(serialized));

    // Reconstruir headings
    editor.update(() => {
      const root = $getRoot();
      const newHeadings: { text: string; level: number; id: string }[] = [];

      root.getChildren().forEach(node => {
        if (node instanceof HeadingNode) {
          const text = node.getTextContent();
          const level = parseInt(node.getTag().replace('h', ''), 10);
          newHeadings.push({ text, level, id: text.toLowerCase().replace(/\s+/g, '-') });
        }
      });

      setHeadings(newHeadings);
    });

    // Reconstruir RootNode compatible con tu tipo Document
    const newRootNode: RootNode = {
      type: 'root',
      version: 1,
      children: serialized.root?.children || [],
      format: '',
      indent: 0,
      direction: null,
    };

    updateDocument(newRootNode);
  };

  // Manejo de subida de imágenes
  const handleImageUpload = async (files: File[], editor: import('lexical').LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach(file => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  // Clases de estilos según tema
  const bgClass = appTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  const borderClass = appTheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Render de tabs
  const renderTabs = () => (
    <div className={`flex border-b ${borderClass} relative ${appTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {['editor', 'debug'].map(t => {
        const isActive = activeTab === t;
        return (
          <button
            key={t}
            onClick={() => selectTab(t as 'editor' | 'debug')}
            className="relative px-4 py-2 text-sm font-medium"
          >
            <span className={`relative z-10 ${getTabTextClass(t, appTheme)}`}>
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
  );

 

  return (
    <div className="h-full flex flex-col">
      <div className={`flex rounded-xl shadow-sm border ${borderClass} overflow-hidden ${bgClass} flex-1`}>
        <div className="flex-1 flex relative">
          <div className="flex-1 flex flex-col">
            {renderTabs()}

            <LexicalComposer initialConfig={initialConfig}>
              <InitContentPlugin initialContent={content} />

              {activeTab === 'editor' && (
                <div className={`sticky top-0 z-10 border-b ${borderClass} ${bgClass}`}>
                  <ToolbarPlugin onUploadImages={handleImageUpload} />
                </div>
              )}

              <div className="p-4 min-h-[250px] flex-1 overflow-y-auto">
                {activeTab === 'editor' ? (
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className={`min-h-[200px] outline-none text-sm leading-relaxed ${appTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                        aria-placeholder="Ingrese algún texto..."
                        placeholder={<div className={`${appTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'} pointer-events-none`}>Empieza a escribir algo...</div>}
                      />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                ) : (
                  <DebugPanel data={editorJSON} />
                )}

                <HistoryPlugin />
                <ListPlugin />
                <ImagePlugin />
                <MyOnChangePlugin onChange={onChange} />
              </div>
            </LexicalComposer>
          </div>

          {activeTab === 'editor' && <TableOfContents headings={headings} theme={appTheme} />}
        </div>
      </div>
    </div>
  );
}