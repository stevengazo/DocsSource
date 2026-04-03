import {
  createCommand,
  type LexicalCommand,
  type LexicalEditor,
  $insertNodes,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  createEditor,
  COMMAND_PRIORITY_HIGH,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  type NodeKey,
  type SerializedLexicalNode,
} from 'lexical';
import { useEffect, useRef, useState, useCallback, type JSX } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DecoratorNode} from 'lexical';
import { mediaFileReader } from '@lexical/utils';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';

/* ─────────────────────────────────────────────────────────────────
   Comando
───────────────────────────────────────────────────────────────── */
export const INSERT_IMAGE_COMMAND: LexicalCommand<{ src: string; width?: number; height?: number }> =
  createCommand('INSERT_IMAGE_COMMAND');

/* ─────────────────────────────────────────────────────────────────
   Hook de upload (sin cambios respecto al original)
───────────────────────────────────────────────────────────────── */
export function useImageUpload() {
  const [editor] = useLexicalComposerContext();

  const uploadImages = async (files: File[], ed: LexicalEditor) => {
    const results = await mediaFileReader(files, ['image/']);
    results.forEach((file) => {
      ed.dispatchCommand(INSERT_IMAGE_COMMAND, { src: file.result });
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    await uploadImages(Array.from(files), editor);
  };

  return { handleImageUpload };
}

/* ─────────────────────────────────────────────────────────────────
   Serialización
───────────────────────────────────────────────────────────────── */
export interface SerializedImageNode extends SerializedLexicalNode {
  type: 'image';
  version: 1;
  src: string;
  width: number | null;
  height: number | null;
}

/* ─────────────────────────────────────────────────────────────────
   ImageNode — extiende DecoratorNode correctamente
   - createDOM devuelve un <span> contenedor (nunca <img> directo)
   - updateDOM retorna false → React maneja el render vía decorate()
   - width/height guardan el tamaño personalizado
───────────────────────────────────────────────────────────────── */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width: number | null;
  __height: number | null;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__width, node.__height, node.__key);
  }

  constructor(src: string, width: number | null = null, height: number | null = null, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }

  /* El DOM real es solo un <span> inline-block vacío.
     React monta el JSX devuelto por decorate() dentro de él. */
  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.style.display = 'block';
    return span;
  }

  /* false → Lexical nunca toca el DOM directamente; React lo maneja */
  updateDOM(): false {
    return false;
  }

  /* Permite que el nodo sea seleccionable con NodeSelection */
  isInline(): boolean {
    return false;
  }

  /* Necesario para que DELETE/BACKSPACE funcionen con NodeSelection */
  isKeyboardSelectable(): boolean {
    return true;
  }

  /* ── Serialización ── */
  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.width, serializedNode.height);
  }

  /* ── Mutadores (siempre a través de getWritable) ── */
  setSize(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  /* ── El JSX que React monta en el span contenedor ── */
  decorate(editor: LexicalEditor): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        nodeKey={this.__key}
        width={this.__width}
        height={this.__height}
        editor={editor}
      />
    );
  }
}

/* ─────────────────────────────────────────────────────────────────
   Componente React con resize y selección
───────────────────────────────────────────────────────────────── */
const MIN_SIZE = 40;

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw';

interface ImageComponentProps {
  src: string;
  nodeKey: NodeKey;
  width: number | null;
  height: number | null;
  editor: LexicalEditor;
}

function ImageComponent({ src, nodeKey, width, height, editor }: ImageComponentProps) {
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  /* Tamaño local durante el resize */
  const [size, setSize] = useState<{ w: number | null; h: number | null }>({
    w: width,
    h: height,
  });

  /* Sincroniza cuando cambia el nodo desde fuera */
  useEffect(() => {
    setSize({ w: width, h: height });
  }, [width, height]);

  /* ── Borrar nodo al pulsar Delete / Backspace cuando está seleccionado ── */
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        (event) => {
          if (isSelected) {
            event?.preventDefault();
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (node) node.remove();
            });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => {
          if (isSelected) {
            event?.preventDefault();
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if (node) node.remove();
            });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, isSelected, nodeKey]);

  /* ── Click para seleccionar ── */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      editor.update(() => {
        clearSelection();
        setSelected(true);
      });
    },
    [editor, clearSelection, setSelected]
  );

  /* ── Lógica de resize por arrastre ── */
  const startResize = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      const img = imgRef.current;
      if (!img) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = img.offsetWidth;
      const startH = img.offsetHeight;
      const ratio = startH / startW;

      const onMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        let newW: number;
        if (handle === 'se' || handle === 'ne') {
          newW = Math.max(MIN_SIZE, startW + dx);
        } else {
          newW = Math.max(MIN_SIZE, startW - dx);
        }
        const newH = Math.round(newW * ratio);
        setSize({ w: Math.round(newW), h: newH });
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        /* Persistir en el nodo de Lexical */
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node instanceof ImageNode) {
            const img2 = imgRef.current;
            if (img2) node.setSize(img2.offsetWidth, img2.offsetHeight);
          }
        });
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [editor, nodeKey]
  );

  const imgStyle: React.CSSProperties = {
    display: 'block',
    maxWidth: '100%',
    borderRadius: 6,
    cursor: isSelected ? 'default' : 'pointer',
    outline: isSelected ? '2px solid #378ADD' : '2px solid transparent',
    outlineOffset: 2,
    transition: 'outline-color 0.12s',
    userSelect: 'none',
    ...(size.w ? { width: size.w } : {}),
    ...(size.h ? { height: size.h } : {}),
  };

  const handleStyle = (cursor: string): React.CSSProperties => ({
    position: 'absolute',
    width: 10,
    height: 10,
    background: '#378ADD',
    border: '2px solid #fff',
    borderRadius: 2,
    cursor,
    zIndex: 10,
  });

  return (
    <span
      ref={containerRef}
      style={{ display: 'inline-block', position: 'relative', lineHeight: 0 }}
      onClick={handleClick}
    >
      <img ref={imgRef} src={src} alt="" draggable={false} style={imgStyle} />

      {/* Handles de resize — solo visibles cuando está seleccionado */}
      {isSelected && (
        <>
          {/* SE */}
          <span
            onMouseDown={(e) => startResize(e, 'se')}
            style={{ ...handleStyle('se-resize'), bottom: -5, right: -5 }}
          />
          {/* SW */}
          <span
            onMouseDown={(e) => startResize(e, 'sw')}
            style={{ ...handleStyle('sw-resize'), bottom: -5, left: -5 }}
          />
          {/* NE */}
          <span
            onMouseDown={(e) => startResize(e, 'ne')}
            style={{ ...handleStyle('ne-resize'), top: -5, right: -5 }}
          />
          {/* NW */}
          <span
            onMouseDown={(e) => startResize(e, 'nw')}
            style={{ ...handleStyle('nw-resize'), top: -5, left: -5 }}
          />
        </>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Plugin principal — registra el comando INSERT_IMAGE_COMMAND
   y también deselecciona la imagen al hacer click fuera
───────────────────────────────────────────────────────────────── */
export default function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    /* Registrar nodo (necesario si no está en la config del editor) */
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode no está registrado en la config del editor. Agrégalo a nodes: [ImageNode]');
    }

    return editor.registerCommand<{ src: string; width?: number; height?: number }>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const imageNode = new ImageNode(payload.src, payload.width ?? null, payload.height ?? null);
          $insertNodes([imageNode]);
        });
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}