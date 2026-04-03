// src/Components/Lexical/Editor.tsx
import { useMemo, useState, useRef, type JSX } from 'react';
import { motion } from 'framer-motion';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';

import ImagePlugin, { ImageNode, useImageUpload } from './plugins/ImagePlugin';
import { DividerNode } from './plugins/DividerNode';

import { useTheme } from '../../context/ThemeContext';
import { useTabs } from '../../hooks/useTabs';
import TableOfContents from './TableOfContents';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import { DebugPanel } from '../DebugPanel';

import theme from './theme';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

/* ---------- Config ---------- */
const LOCAL_STORAGE_KEY = 'lexical-editor-content';

/* ---------- Error Handler ---------- */
function onError(error: Error): void {
  console.error(error);
}

/* ---------- Plugin: Load desde localStorage ---------- */
function LoadFromLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return;

      const parsedJSON = JSON.parse(saved);

      if (!parsedJSON.root) {
        console.warn('Estado inválido en localStorage');
        return;
      }

      const editorState = editor.parseEditorState(saved);
      editor.setEditorState(editorState);
    } catch (error) {
      console.error('Error cargando editor:', error);
    }
  }, [editor]);

  return null;
}

/* ---------- Contenido interno ---------- */
function EditorContent({
  activeTab,
  appTheme,
  borderClass,
  bgClass,
  onChange,
  editorJSON,
}: any) {
  const { handleImageUpload } = useImageUpload();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {activeTab === 'editor' && (
        <div className={`sticky top-0 z-10 border-b ${borderClass} ${bgClass}`}>
          <ToolbarPlugin onUploadImages={handleImageUpload} />
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'editor' ? (
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`min-h-[200px] w-full outline-none text-sm leading-relaxed ${
                  appTheme === 'dark'
                    ? 'text-gray-100'
                    : 'text-gray-800'
                }`}
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
          <div className="h-full">
            <DebugPanel data={editorJSON} />
          </div>
        )}

        <HistoryPlugin />
        <ListPlugin />
        <ImagePlugin />
        <LoadFromLocalStoragePlugin /> {/* ✅ carga correcta */}
        <MyOnChangePlugin onChange={onChange} />
      </div>
    </div>
  );
}

/* ---------- Editor principal ---------- */
export default function Editor(): JSX.Element {
  const { theme: appTheme } = useTheme();

  const [editorJSON, setEditorJSON] = useState<string>('');
  const lastValue = useRef<string>('');

  const [headings, setHeadings] = useState<
    { text: string; level: number; id: string }[]
  >([]);

  const { activeTab, selectTab, getTabTextClass } = useTabs({
    initialTab: 'editor',
    tabs: ['editor', 'debug'],
  });

  const initialConfig = useMemo(
    () => ({
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
    }),
    []
  );

  const onChange = (
    editorState: import('lexical').EditorState,
    editor: import('lexical').LexicalEditor
  ) => {
    const serializedObj = editorState.toJSON();
    const serialized = JSON.stringify(serializedObj);

    if (serialized === lastValue.current) return;
    lastValue.current = serialized;

    setEditorJSON(serialized);

    /* ---------- Guardar en localStorage ---------- */
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }

    editor.update(() => {
      const root = $getRoot();
      const newHeadings: { text: string; level: number; id: string }[] = [];

      root.getChildren().forEach((node) => {
        if (node instanceof HeadingNode) {
          const text = node.getTextContent();
          const level = parseInt(node.getTag().replace('h', ''), 10);

          newHeadings.push({
            text,
            level,
            id: text.toLowerCase().replace(/\s+/g, '-'),
          });
        }
      });

      setHeadings(newHeadings);
    });
  };

  const bgClass =
    appTheme === 'dark'
      ? 'bg-gray-900 text-gray-100'
      : 'bg-white text-gray-800';

  const borderClass =
    appTheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const renderTabs = () => (
    <div
      className={`flex border-b ${borderClass} relative ${
        appTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}
    >
      {['editor', 'debug'].map((t) => {
        const isActive = activeTab === t;

        return (
          <button
            key={t}
            onClick={() => selectTab(t as 'editor' | 'debug')}
            className="relative px-4 py-2 text-sm font-medium"
          >
            <span
              className={`relative z-10 ${getTabTextClass(
                t as 'editor' | 'debug',
                appTheme
              )}`}
            >
              {t === 'editor' ? 'Editor' : 'Debug'}
            </span>

            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className={`absolute inset-0 rounded-t-lg ${
                  appTheme === 'dark'
                    ? 'bg-gray-700 border-x border-t border-gray-600'
                    : 'bg-white border-x border-t border-gray-200'
                }`}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className={`flex rounded-xl shadow-sm border ${borderClass} overflow-hidden ${bgClass} flex-1`}
      >
        <div className="flex flex-1 relative overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderTabs()}

            <LexicalComposer initialConfig={initialConfig}>
              <EditorContent
                activeTab={activeTab}
                appTheme={appTheme}
                borderClass={borderClass}
                bgClass={bgClass}
                onChange={onChange}
                editorJSON={editorJSON}
              />
            </LexicalComposer>
          </div>

          {activeTab === 'editor' && (
            <TableOfContents headings={headings} theme={appTheme} />
          )}
        </div>
      </div>
    </div>
  );
}