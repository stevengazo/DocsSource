// src/hooks/useLexicalEditor.ts
import { useState, useMemo } from 'react';
import { $getRoot } from 'lexical';
import { HeadingNode } from '@lexical/rich-text';
import { mediaFileReader } from '@lexical/utils';
import { INSERT_IMAGE_COMMAND } from '../Components/Lexical/plugins/ImagePlugin';
import type { RootNode } from '../types/DocumentNodes';
import type { LexicalEditor, EditorState } from 'lexical';

interface UseLexicalEditorProps {
  content: any;
  updateDocument: (doc: any) => void;
}

export function useLexicalEditor({ content, updateDocument }: UseLexicalEditorProps) {
  const [editorJSON, setEditorJSON] = useState<string>(JSON.stringify(content || {}));
  const [tab, setTab] = useState<'editor' | 'debug'>('editor');
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);

  const initialConfig = useMemo(() => ({
    namespace: 'MyEditor',
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      // Otros nodos se pueden agregar aquí si es necesario
    ],
  }), []);

  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    const serialized = editorState.toJSON();
    setEditorJSON(JSON.stringify(serialized));

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

  const handleImageUpload = async (files: File[], editor: LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach(file => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  return {
    editorJSON,
    tab,
    setTab,
    headings,
    initialConfig,
    onChange,
    handleImageUpload,
  };
}