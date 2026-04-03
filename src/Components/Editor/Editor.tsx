// src/Components/Lexical/Editor.tsx

/**
 * Editor enriquecido basado en Lexical.
 * 
 * Features principales:
 * - Edición de texto enriquecido (headings, listas, links, imágenes, divider)
 * - Persistencia automática en localStorage
 * - Tabla de contenidos dinámica (basada en headings)
 * - Panel de debug con JSON del editor
 * - Soporte de temas (dark/light)
 * - Tabs (Editor / Debug)
 */

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

import ImagePlugin, { ImageNode, useImageUpload } from './../../plugins/ImagePlugin';
import { DividerNode } from './../../plugins/DividerNode';

import { useTheme } from '../../context/ThemeContext';
import { useTabs } from '../../hooks/useTabs';
import TableOfContents from './TableOfContents';

import ToolbarPlugin from './../../plugins/ToolbarPlugin';
import MyOnChangePlugin from './../../plugins/MyOnChangePlugin';
import { DebugPanel } from './DebugPanel';

import theme from '../../utils/theme';
import { $getRoot } from 'lexical';
import { useEffect } from 'react';

/* ---------- Configuración ---------- */

/**
 * Clave utilizada para persistir el estado del editor en localStorage
 */
const LOCAL_STORAGE_KEY = 'lexical-editor-content';

/* ---------- Error Handler ---------- */

/**
 * Manejo global de errores del editor
 */
function onError(error: Error): void {
  console.error(error);
}

/* ---------- Plugin: Cargar desde localStorage ---------- */

/**
 * Plugin encargado de hidratar el editor desde localStorage al montar.
 * 
 * Flujo:
 * 1. Obtiene JSON guardado
 * 2. Valida estructura básica
 * 3. Reconstruye EditorState
 * 4. Lo inyecta en el editor
 */
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

/* ---------- Contenido interno del editor ---------- */

/**
 * Renderiza el contenido principal del editor dependiendo del tab activo.
 * 
 * Responsabilidades:
 * - Toolbar (solo en tab editor)
 * - Área editable
 * - Plugins de Lexical
 * - Panel debug
 */
function EditorContent({
  activeTab,
  appTheme,
  borderClass,
  bgClass,
  onChange,
  editorJSON,
}: any) {
  /**
   * Hook custom para manejo de subida de imágenes
   */
  const { handleImageUpload } = useImageUpload();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      {activeTab === 'editor' && (
        <div className={`sticky top-0 z-10 border-b ${borderClass} ${bgClass}`}>
          <ToolbarPlugin onUploadImages={handleImageUpload} />
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {/* Editor vs Debug */}
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

        {/* Plugins */}
        <HistoryPlugin />
        <ListPlugin />
        <ImagePlugin />
        <LoadFromLocalStoragePlugin />
        <MyOnChangePlugin onChange={onChange} />
      </div>
    </div>
  );
}

/* ---------- Componente principal ---------- */

export default function Editor(): JSX.Element {
  /**
   * Tema global (dark / light)
   */
  const { theme: appTheme } = useTheme();

  /**
   * Estado serializado del editor (JSON)
   */
  const [editorJSON, setEditorJSON] = useState<string>('');

  /**
   * Cache del último valor serializado para evitar renders innecesarios
   */
  const lastValue = useRef<string>('');

  /**
   * Headings detectados para tabla de contenidos
   */
  const [headings, setHeadings] = useState<
    { text: string; level: number; id: string }[]
  >([]);

  /**
   * Manejo de tabs (Editor / Debug)
   */
  const { activeTab, selectTab, getTabTextClass } = useTabs({
    initialTab: 'editor',
    tabs: ['editor', 'debug'],
  });

  /**
   * Configuración inicial de Lexical
   */
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

  /**
   * Handler principal de cambios del editor
   * 
   * Responsabilidades:
   * - Serializar estado
   * - Persistir en localStorage
   * - Detectar headings dinámicamente
   */
  const onChange = (
    editorState: import('lexical').EditorState,
    editor: import('lexical').LexicalEditor
  ) => {
    const serializedObj = editorState.toJSON();
    const serialized = JSON.stringify(serializedObj);

    // Evita procesamiento redundante
    if (serialized === lastValue.current) return;
    lastValue.current = serialized;

    setEditorJSON(serialized);

    /* ---------- Persistencia ---------- */
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }

    /* ---------- Extracción de headings ---------- */
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

  /* ---------- Clases dinámicas ---------- */

  const bgClass =
    appTheme === 'dark'
      ? 'bg-gray-900 text-gray-100'
      : 'bg-white text-gray-800';

  const borderClass =
    appTheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  /**
   * Render de tabs con animación (framer-motion)
   */
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

  /* ---------- Render ---------- */

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

          {/* Tabla de contenidos (solo en modo editor) */}
          {activeTab === 'editor' && (
            <TableOfContents headings={headings} theme={appTheme} />
          )}
        </div>
      </div>
    </div>
  );
}