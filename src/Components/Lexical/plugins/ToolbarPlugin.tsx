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
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

function Divider() {
    return <div className="w-px h-6 bg-gray-200 mx-2" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, $updateToolbar]);

    const baseBtn =
        'px-2 py-1 rounded-md text-sm flex items-center justify-center transition';
    const activeBtn = 'bg-gray-200 text-black';
    const inactiveBtn =
        'text-gray-500 hover:bg-gray-100 hover:text-gray-800';
    const disabledBtn = 'opacity-40 cursor-not-allowed';

    return (
        <div className='flex flex-col shadow rounded gap-1 p-2 border-b bg-white sticky top-0 z-10'>
            <div
                ref={toolbarRef}
                className="flex items-center "
            >
                {/* Undo / Redo */}
                <button
                    disabled={!canUndo}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    className={`${baseBtn} ${canUndo ? inactiveBtn : disabledBtn
                        }`}
                >
                    ↶
                </button>

                <button
                    disabled={!canRedo}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    className={`${baseBtn} ${canRedo ? inactiveBtn : disabledBtn
                        }`}
                >
                    ↷
                </button>

                <Divider />

                {/* Text formatting */}
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                    className={`${baseBtn} ${isBold ? activeBtn : inactiveBtn
                        }`}
                >
                    <b>B</b>
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                    className={`${baseBtn} ${isItalic ? activeBtn : inactiveBtn
                        }`}
                >
                    <i>I</i>
                </button>

                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                    className={`${baseBtn} ${isUnderline ? activeBtn : inactiveBtn
                        }`}
                >
                    <u>U</u>
                </button>

                <button
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                    }
                    className={`${baseBtn} ${isStrikethrough ? activeBtn : inactiveBtn
                        }`}
                >
                    <s>S</s>
                </button>

                <Divider />

                {/* Alignment */}
                <button
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    }
                    className={`${baseBtn} ${inactiveBtn}`}
                >
                    ⬅
                </button>

                <button
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    }
                    className={`${baseBtn} ${inactiveBtn}`}
                >
                    ↔
                </button>

                <button
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    }
                    className={`${baseBtn} ${inactiveBtn}`}
                >
                    ➡
                </button>

                <button
                    onClick={() =>
                        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                    }
                    className={`${baseBtn} ${inactiveBtn}`}
                >
                    ☰
                </button>
            </div>
        </div>
    );
}