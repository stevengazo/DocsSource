import { useState, useMemo } from 'react';
import { mediaFileReader } from '@lexical/utils';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import ImagePlugin, { ImageNode, INSERT_IMAGE_COMMAND } from './../Components/Lexical/plugins/ImagePlugin';

function onError(error: Error) {
  console.error(error);
}

export function useEditorState() {
  // Estado del editor
  const [editorJSON, setEditorJSON] = useState<string>('');
  const [tab, setTab] = useState<'editor' | 'debug'>('editor');

  // Configuración inicial del editor
  const initialConfig = useMemo(() => ({
    namespace: 'MyEditor',
    theme: undefined, // Puedes importar tu theme si quieres
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

  // Función para actualizar JSON del editor
  const onChange = (state: import('lexical').EditorState) => {
    const json = state.toJSON();
    setEditorJSON(JSON.stringify(json));
  };

  // Función para manejar subida de imágenes
  const handleImageUpload = async (files: File[], editor: import('lexical').LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach(file => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  return {
    editorJSON,
    tab,
    setTab,
    initialConfig,
    onChange,
    handleImageUpload,
  };
}