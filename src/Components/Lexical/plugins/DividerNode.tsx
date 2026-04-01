import { DecoratorNode, type SerializedLexicalNode, type Spread, $isRangeSelection } from 'lexical';
import type { JSX } from 'react';
import { $createParagraphNode } from 'lexical';

export type SerializedDividerNode = Spread<
  {
    type: 'divider';
    version: 1;
  },
  SerializedLexicalNode
>;

export class DividerNode extends DecoratorNode<JSX.Element> {
  static getType() {
    return 'divider';
  }

  constructor(key?: string) {
    super(key); // clave pasada al constructor
  }

  static clone(node: DividerNode) {
    return new DividerNode(node.__key); // clonar con clave
  }

  static importJSON(): DividerNode {
    return new DividerNode();
  }

  exportJSON(): SerializedDividerNode {
    return {
      type: 'divider',
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const hr = document.createElement('hr');
    hr.className = 'my-4 border-gray-300';
    return hr;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <hr className="my-4 border-gray-300" />;
  }
}

/** Crea un DividerNode sin hijos */
export function $createDividerNode() {
  return new DividerNode();
}

export function $isDividerNode(node: any): node is DividerNode {
  return node instanceof DividerNode;
}

/**
 * Inserta un divider y automáticamente crea un párrafo vacío debajo,
 * dejando el cursor listo para seguir escribiendo.
 */
export function insertDividerWithParagraph(editor: any) {
  editor.update(() => {
    const selection = editor.getSelection();
    if (!$isRangeSelection(selection)) return;

    // Crear divider
    const divider = $createDividerNode();
    selection.insertNodes([divider]);

    // Crear párrafo vacío debajo
    const paragraph = $createParagraphNode();
    divider.insertAfter(paragraph);

    // Mover cursor al nuevo párrafo
    paragraph.selectStart();
  });
}