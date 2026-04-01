// src/context/DocumentsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Document } from '../types/Document';
import { v4 as uuidv4 } from 'uuid';

interface DocumentsContextType {
  documents: Document[];
  addDocument: (title: string, description?: string, content?: any) => Document;
  updateDocument: (id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | undefined;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

// Hook que maneja la lógica de documentos
function useDocuments(): DocumentsContextType {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const stored = localStorage.getItem('documents');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (title: string, description = '', content: any = {}) => {
    const newDoc: Document = {
      id: uuidv4(),
      title,
      description,
      content,
      author: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments((prev) => [...prev, newDoc]);
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const getDocument = (id: string) => documents.find((doc) => doc.id === id);

  return { documents, addDocument, updateDocument, deleteDocument, getDocument };
}

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const docHook = useDocuments();
  return <DocumentsContext.Provider value={docHook}>{children}</DocumentsContext.Provider>;
};

export const useDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) throw new Error('useDocumentsContext must be used within DocumentsProvider');
  return context;
};