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
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagePlugin';
import { $createDividerNode, $isDividerNode } from '../plugins/DividerNode';
import { useTheme } from '../../../context/ThemeContext';

/* ---------- UI Components ---------- */
function Group({ title, children }: any) {
  return (
    <div className="flex flex-col items-center px-2 border-r last:border-r-0">
      <div className="flex items-center gap-1">{children}</div>
      <span className="text-[10px] text-gray-400 dark:text-gray-300 mt-1">{title}</span>
    </div>
  );
}

function Btn({ active, disabled, onClick, children, tooltip }: any) {
  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        disabled={disabled}
        onClick={onClick}
        className={`
          px-2 py-1 rounded text-sm
          ${disabled
            ? 'opacity-40 cursor-not-allowed'
            : active
              ? 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'}
        `}
      >
        {children}
      </motion.button>
      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
}

/* ---------- ToolbarPlugin Component ---------- */
export default function ToolbarPlugin({ onUploadImages }: { onUploadImages: (files: FileList | null) => void }) {
  const [editor] = useLexicalComposerContext();
  const { theme: appTheme } = useTheme(); // 'light' | 'dark'

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
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
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(CAN_UNDO_COMMAND, (p) => (setCanUndo(p), false), COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_REDO_COMMAND, (p) => (setCanRedo(p), false), COMMAND_PRIORITY_LOW)
    );
  }, [editor, $updateToolbar]);

  const setBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      let newNode;

      switch (type) {
        case 'paragraph':
          newNode = $createParagraphNode();
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          newNode = $createHeadingNode(type);
          break;
        case 'quote':
          newNode = $createQuoteNode();
          break;
        case 'divider':
          newNode = $createDividerNode();
          const paragraph = $createParagraphNode();
          element.replace(newNode);
          newNode.insertAfter(paragraph);
          paragraph.selectStart();
          return;
        case 'bullet':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          return;
        case 'number':
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          return;
        default:
          return;
      }

      if (!newNode) return;
      if ($isElementNode(element)) {
        newNode.append(...element.getChildren());
      }
      element.replace(newNode);
      newNode.selectStart();
    });
  };

  const handleUploadImage = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result;
          if (typeof src === 'string') {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [editor]
  );

  return (
    <div className={appTheme === 'dark' ? 'dark' : ''}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 p-2 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10"
      >
        {/* Clipboard */}
        <Group title="Clipboard">
          <Btn disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} tooltip="Undo">↶</Btn>
          <Btn disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} tooltip="Redo">↷</Btn>
        </Group>

        {/* Fuente */}
        <Group title="Fuente">
          <Btn active={isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} tooltip="Bold"><b>B</b></Btn>
          <Btn active={isItalic} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} tooltip="Italic"><i>I</i></Btn>
          <Btn active={isUnderline} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} tooltip="Underline"><u>U</u></Btn>
          <Btn active={isStrikethrough} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')} tooltip="Strike"><s>S</s></Btn>
        </Group>

        {/* Párrafo */}
        <Group title="Párrafo">
       <select
            value={blockType}
            onChange={(e) => setBlock(e.target.value)}
            className="px-2 py-1 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            title="Seleccionar Heading"
          >
            <option value="paragraph">Párrafo</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
          <Btn active={blockType === 'divider'} onClick={() => setBlock('divider')} tooltip="Divider">—</Btn>
          <Btn onClick={() => setBlock('bullet')} tooltip="Bullet List">•</Btn>
          <Btn onClick={() => setBlock('number')} tooltip="Numbered List">1.</Btn>
          <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} tooltip="Left">⬅</Btn>
          <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} tooltip="Center">↔</Btn>
          <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} tooltip="Right">➡</Btn>
          <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} tooltip="Justify">☰</Btn>
        </Group>

        {/* Imagen */}
        <Group title="Imagen">
          <Btn tooltip="Insert Image" onClick={() => document.getElementById('image-upload')?.click()}>🖼️</Btn>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUploadImage(e.target.files)}
            className="hidden"
          />
        </Group>
      </motion.div>
    </div>
  );
}