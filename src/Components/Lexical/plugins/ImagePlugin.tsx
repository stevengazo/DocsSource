import { createCommand, type LexicalCommand, type LexicalEditor, $getRoot, $insertNodes } from 'lexical';
import { useEffect, type JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DecoratorNode } from 'lexical';

/* ---------- Comando para insertar imagen ---------- */
export const INSERT_IMAGE_COMMAND: LexicalCommand<{ src: string }> = createCommand();

/* ---------- Nodo de imagen ---------- */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src);
  }

  constructor(src: string) {
    super();
    this.__src = src;
  }

  createDOM(): HTMLElement {
    const img = document.createElement('img');
    img.src = this.__src;
    img.className = 'max-w-full rounded-md';
    img.style.display = 'block';
    img.style.margin = '8px 0';
    return img;
  }

  updateDOM(): false {
    return false;
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
    };
  }

  static importJSON(serializedNode: any): ImageNode {
    return new ImageNode(serializedNode.src);
  }

  decorate(): JSX.Element {
    return <img src={this.__src} className="max-w-full rounded-md" alt="" />;
  }
}

/* ---------- Plugin para registrar comando ---------- */
export default function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<{ src: string }>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const { src } = payload;
        const imageNode = new ImageNode(src);
        $insertNodeToNearestRoot(editor, imageNode);
        return true;
      },
      0
    );
  }, [editor]);

  return null;
}

/* ---------- Función auxiliar para insertar nodo ---------- */
function $insertNodeToNearestRoot(editor: LexicalEditor, node: ImageNode) {
  editor.update(() => {
    const root = $getRoot();
    $insertNodes([node]);
    node.selectNext();
  });
}