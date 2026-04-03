import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $isElementNode,
} from 'lexical';
import {
  $createHeadingNode,
  $isHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagePlugin';
import { $createDividerNode, $isDividerNode } from '../plugins/DividerNode';
import { useTheme } from '../context/ThemeContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import TableDropdown from './../Components/Editor/Tabledropdown';
 
/* ---------- SVG Icons ---------- */
const icons = {
  undo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h10a6 6 0 010 12H7" />
      <polyline points="7 3 3 7 7 11" />
    </svg>
  ),
  redo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7H11a6 6 0 000 12h6" />
      <polyline points="17 3 21 7 17 11" />
    </svg>
  ),
  bold: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z" />
    </svg>
  ),
  italic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0012 0V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  strikethrough: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M7 7.5C7 6 8.3 5 10 5h4c1.7 0 3 1.2 3 2.7 0 1-.5 1.9-1.3 2.3" />
      <path d="M17 17c0 1.5-1.3 2.7-3 2.7h-4C8.3 19.7 7 18.5 7 17c0-1 .5-1.9 1.3-2.3" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
  divider: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  bulletList: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  orderedList: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  alignLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  ),
  alignCenter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
  alignRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
    </svg>
  ),
  alignJustify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
};
 
/* ---------- UI Components ---------- */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
      <div className="flex items-center gap-0.5">{children}</div>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 select-none">{title}</span>
    </div>
  );
}
 
function Btn({
  active,
  disabled,
  onClick,
  children,
  tooltip,
  wide = false,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  tooltip: string;
  wide?: boolean;
}) {
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.06 }}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        disabled={disabled}
        onClick={onClick}
        className={`
          flex items-center justify-center gap-1.5 rounded-md text-sm transition-colors duration-100
          ${wide ? 'px-2.5 py-1.5 text-xs font-medium' : 'w-7 h-7'}
          ${disabled
            ? 'opacity-30 cursor-not-allowed text-gray-400 dark:text-gray-600'
            : active
              ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
          }
        `}
      >
        <span className="w-[15px] h-[15px] flex items-center justify-center shrink-0">
          {children}
        </span>
        {wide && <span>{tooltip}</span>}
      </motion.button>
 
      {/* Tooltip — solo cuando no es wide (los wide ya muestran label) */}
      {!wide && (
        <div className="
          pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          text-[11px] bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900
          px-2 py-0.5 rounded whitespace-nowrap z-50 shadow-sm
        ">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      )}
    </div>
  );
}
 
/* ---------- ToolbarPlugin ---------- */
export default function ToolbarPlugin({
  onUploadImages,
}: {
  onUploadImages: (files: FileList | null) => Promise<void>;
}) {
  const [editor] = useLexicalComposerContext();
  const { theme: appTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
 
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
 
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
 
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
 
    if ($isHeadingNode(element)) setBlockType(element.getTag());
    else if ($isListNode(element)) setBlockType(element.getListType());
    else if ($isQuoteNode(element)) setBlockType('quote');
    else if ($isDividerNode(element)) setBlockType('divider');
    else setBlockType('paragraph');
  }, []);
 
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => { $updateToolbar(); return false; },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(CAN_UNDO_COMMAND, (p) => (setCanUndo(p), false), COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_REDO_COMMAND, (p) => (setCanRedo(p), false), COMMAND_PRIORITY_LOW),
    );
  }, [editor, $updateToolbar]);
 
  const setBlock = useCallback((type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
 
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
 
      switch (type) {
        case 'paragraph': {
          const node = $createParagraphNode();
          if ($isElementNode(element)) node.append(...element.getChildren());
          element.replace(node);
          node.selectStart();
          break;
        }
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const node = $createHeadingNode(type);
          if ($isElementNode(element)) node.append(...element.getChildren());
          element.replace(node);
          node.selectStart();
          break;
        }
        case 'quote': {
          const node = $createQuoteNode();
          if ($isElementNode(element)) node.append(...element.getChildren());
          element.replace(node);
          node.selectStart();
          break;
        }
        case 'divider': {
          const divider = $createDividerNode();
          const paragraph = $createParagraphNode();
          element.replace(divider);
          divider.insertAfter(paragraph);
          paragraph.selectStart();
          break;
        }
        case 'bullet':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;
        case 'number':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;
      }
    });
  }, [editor]);
 
  const handleUploadImage = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (typeof src === 'string') {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [editor]);
 
  return (
    <div className={appTheme === 'dark' ? 'dark' : ''}>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="
          flex items-center flex-wrap gap-y-1 gap-x-0 px-2 py-1.5
          border-b border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          sticky top-0 z-10
        "
      >
        {/* Historial */}
        <Group title="Historial">
          <Btn
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            tooltip="Deshacer"
          >
            {icons.undo}
          </Btn>
          <Btn
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            tooltip="Rehacer"
          >
            {icons.redo}
          </Btn>
        </Group>
 
        {/* Fuente */}
        <Group title="Fuente">
          <Btn
            active={isBold}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            tooltip="Negrita"
          >
            {icons.bold}
          </Btn>
          <Btn
            active={isItalic}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            tooltip="Cursiva"
          >
            {icons.italic}
          </Btn>
          <Btn
            active={isUnderline}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            tooltip="Subrayado"
          >
            {icons.underline}
          </Btn>
          <Btn
            active={isStrikethrough}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
            tooltip="Tachado"
          >
            {icons.strikethrough}
          </Btn>
        </Group>
 
        {/* Bloque */}
        <Group title="Bloque">
          <select
            value={blockType}
            onChange={(e) => setBlock(e.target.value)}
            className="
              h-7 px-2 text-xs rounded-md border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
              cursor-pointer
            "
          >
            <option value="paragraph">Párrafo</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
          <Btn
            active={blockType === 'quote'}
            onClick={() => setBlock('quote')}
            tooltip="Cita en bloque"
          >
            {icons.quote}
          </Btn>
          <Btn
            active={blockType === 'divider'}
            onClick={() => setBlock('divider')}
            tooltip="Divisor"
          >
            {icons.divider}
          </Btn>
        </Group>
 
        {/* Listas */}
        <Group title="Listas">
          <Btn
            active={blockType === 'bullet'}
            onClick={() => setBlock('bullet')}
            tooltip="Lista con viñetas"
          >
            {icons.bulletList}
          </Btn>
          <Btn
            active={blockType === 'number'}
            onClick={() => setBlock('number')}
            tooltip="Lista numerada"
          >
            {icons.orderedList}
          </Btn>
        </Group>
 
        {/* Alineación */}
        <Group title="Alineación">
          <Btn
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
            tooltip="Alinear izquierda"
          >
            {icons.alignLeft}
          </Btn>
          <Btn
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
            tooltip="Centrar"
          >
            {icons.alignCenter}
          </Btn>
          <Btn
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
            tooltip="Alinear derecha"
          >
            {icons.alignRight}
          </Btn>
          <Btn
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
            tooltip="Justificar"
          >
            {icons.alignJustify}
          </Btn>
        </Group>
 
        {/* Insertar */}
        <Group title="Insertar">
          <TableDropdown
            onInsert={({ rows, columns}:any) =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns })
            }
          />
          <Btn
            wide
            onClick={() => fileInputRef.current?.click()}
            tooltip="Imagen"
          >
            {icons.image}
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              handleUploadImage(files);
              onUploadImages?.(files);
              // Reset para permitir subir el mismo archivo dos veces
              e.target.value = '';
            }}
          />
        </Group>
      </motion.div>
    </div>
  );
}