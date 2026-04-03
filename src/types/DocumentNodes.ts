// src/types/DocumentNodes.ts

import { LexicalNode } from "lexical";



// Tipos de nodos
export type NodeType =
  | "root"
  | "heading"
  | "paragraph"
  | "text"
  | "divider"
  | "list"
  | "listitem"
  | "image";

// Base de todos los nodos
export interface BaseNode {
  type: NodeType;
  version: number;
  format?: string | number;
  indent?: number;
  direction?: string | null;
}

// Nodo de texto
export interface TextNode extends BaseNode {
  type: "text";
  text: string;
  detail: number;
  format: number;
  mode: "normal" | string;
  style: string;
}

// Nodo de encabezado
export interface HeadingNode extends BaseNode {
  type: "heading";
  tag: string; // "h1", "h2", etc.
  children: Node[];
}

// Nodo de párrafo
export interface ParagraphNode extends BaseNode {
  type: "paragraph";
  children: Node[];
  textFormat: number;
  textStyle: string;
}

// Divider (separador)
export interface DividerNode extends BaseNode {
  type: "divider";
}

// Nodo de imagen
export interface ImageNode extends BaseNode {
  type: "image";
  src: string;
}

// Item de lista
export interface ListItemNode extends BaseNode {
  type: "listitem";
  value: number;
  children: Node[];
}

// Lista
export interface ListNode extends BaseNode {
  type: "list";
  listType: "number" | "bullet";
  start: number;
  tag: string; // "ol" o "ul"
  children: ListItemNode[];
}

// Nodo raíz
export interface RootNode extends BaseNode {
  type: "root";
  children: Node[];
}

// Nodo recursivo
export type Node =
  | RootNode
  | HeadingNode
  | ParagraphNode
  | TextNode
  | DividerNode
  | ListNode
  | ListItemNode
  | ImageNode;

// Estado JSON inicial del editor
export const initialEditorState: RootNode = {
  type: "root",
  version: 1,
  format: "",
  indent: 0,
  direction: null,
  children: [
    {
      type: "paragraph",
      version: 1,
      format: "",
      indent: 0,
      direction: null,
      textFormat: 0,
      textStyle: "",
      children: [],
    },
  ],
};