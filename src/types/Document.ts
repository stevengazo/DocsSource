// src/types/Document.ts
import type { RootNode } from "./DocumentNodes";

export interface Document {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;

  // Contenido del documento siempre como RootNode
  content: RootNode;
}