// src/hooks/useDocuments.ts
import { useEffect, useState } from 'react';
import type { Document } from '../types/Document';
import type { RootNode } from '../types/DocumentNodes';

const STORAGE_KEY = 'my-documents';

// Generador simple de IDs únicos
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Document[] = JSON.parse(stored);
        setDocuments(parsed);
      } catch {
        setDocuments([]);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian los documentos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  // Crear un nuevo documento
  const addDocument = (title: string, description = '', content?: RootNode) => {
    const newDoc: Document = {
      id: generateId(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'Unknown',
      content: content || {
        type: 'root',
        version: 1,
        format: '',
        indent: 0,
        direction: null,
        children: [],
      },
    };
    setDocuments((docs) => [...docs, newDoc]);
    return newDoc;
  };

  // Actualizar documento
  const updateDocument = (id: string, updates: Partial<Omit<Document, 'createdAt' | 'id'>>) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id
          ? { ...doc, ...updates, updatedAt: new Date()}
          : doc
      )
    );
  };

  // Eliminar documento
  const deleteDocument = (id: string) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  // Obtener documento por id
  const getDocument = (id: string) => documents.find((doc) => doc.id === id);

  return {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
  };
}