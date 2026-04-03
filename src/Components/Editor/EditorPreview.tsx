// src/Components/Lexical/EditorPreview.tsx

import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import html2pdf from 'html2pdf.js';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';

import { DividerNode } from './../../plugins/DividerNode';
import { ImageNode } from './../../plugins/ImagePlugin';

import { useTheme } from '../../context/ThemeContext';
import theme from '../../utils/theme';

/* ---------- Config ---------- */

type PageSize = 'A4' | 'LETTER' | 'LEGAL';

const PAGE_SIZES = {
  A4: { width: 794, height: 1123 },
  LETTER: { width: 816, height: 1056 },
  LEGAL: { width: 816, height: 1344 },
};

/* ---------- Plugin ---------- */

function LoadPreviewStatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;

    try {
      const parsed = JSON.parse(value);
      if (!parsed?.root) return;

      const state = editor.parseEditorState(value);

      queueMicrotask(() => {
        editor.setEditorState(state);
      });
    } catch (e) {
      console.error(e);
    }
  }, [value, editor]);

  return null;
}

/* ---------- MAIN ---------- */

export default function EditorPreview({ value }: { value: string }): JSX.Element {
  const { theme: appTheme } = useTheme();
  const isDark = appTheme === 'dark';

  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [pages, setPages] = useState<HTMLElement[][]>([]);

  const hiddenRootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = PAGE_SIZES[pageSize];

  const initialConfig = useMemo(
    () => ({
      namespace: 'Preview',
      theme,
      editable: false,
      onError: console.error,
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

  /* ---------- PAGINACIÓN REAL ---------- */

  const paginate = () => {
    const root = hiddenRootRef.current;
    if (!root) return;

    // 🔥 ESTE ES EL FIX CLAVE
    const content = root.querySelector('[contenteditable]');
    if (!content) return;

    const blocks = Array.from(content.children) as HTMLElement[];

    const newPages: HTMLElement[][] = [];

    let currentPage: HTMLElement[] = [];
    let height = 0;
    const maxHeight = size.height - 120;

    for (const el of blocks) {
      const h = el.offsetHeight;

      if (height + h > maxHeight) {
        newPages.push(currentPage);
        currentPage = [];
        height = 0;
      }

      currentPage.push(el.cloneNode(true) as HTMLElement);
      height += h;
    }

    if (currentPage.length) newPages.push(currentPage);

    setPages(newPages);
  };

  /* ---------- Esperar render REAL ---------- */

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        paginate();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [value, pageSize]);

  /* ---------- PDF ---------- */

  const handleDownloadPDF = () => {
    if (!containerRef.current) return;

    html2pdf()
      .set({
        margin: 0,
        filename: 'documento.pdf',
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: 'px',
          format: [size.width, size.height],
        },
      })
      .from(containerRef.current)
      .save();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value as PageSize)}
        >
          <option value="A4">A4</option>
          <option value="LETTER">Letter</option>
          <option value="LEGAL">Legal</option>
        </select>

        <button onClick={handleDownloadPDF}>
          Descargar PDF
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-300 p-6">
        <div ref={containerRef} className="flex flex-col gap-6">
          {pages.map((page, i) => (
            <div
              key={i}
              style={{ width: size.width, minHeight: size.height }}
              className={`shadow-xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-16">
                {page.map((node, idx) => (
                  <div key={idx} ref={(el) => el && el.appendChild(node)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden render */}
      <div className="absolute opacity-0 pointer-events-none -z-10">
        <div ref={hiddenRootRef} style={{ width: size.width }}>
          <LexicalComposer initialConfig={initialConfig}>
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <LoadPreviewStatePlugin value={value} />
          </LexicalComposer>
        </div>
      </div>
    </div>
  );
}