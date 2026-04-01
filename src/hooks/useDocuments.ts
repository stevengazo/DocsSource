import { useEffect, useState } from 'react';

const STORAGE_KEY = 'editor-documents';

export function useDocuments() {
  const [docs, setDocs] = useState<Record<string, any>>({});
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Load inicial desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setDocs(parsed);
      const first = Object.keys(parsed)[0];
      if (first) setCurrentId(first);
    }
  }, []);

  // Persistencia automática en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    console.log('Documentos guardados:', docs); // ✅ imprime en consola cada cambio
  }, [docs]);

  // Crear documento y devolverlo
  const createDoc = (title = 'Nuevo documento', content: any = null) => {
    const id = crypto.randomUUID();

    const newDoc = {
      id,
      title,
      content,
      updatedAt: Date.now(),
    };

    setDocs((prev) => ({ ...prev, [id]: newDoc }));
    setCurrentId(id);

    return newDoc;
  };

  const deleteDoc = (id: string) => {
    const copy = { ...docs };
    delete copy[id];

    setDocs(copy);

    if (currentId === id) {
      const next = Object.keys(copy)[0] || null;
      setCurrentId(next);
    }
  };

  const updateDoc = (id: string, data: any) => {
    setDocs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...data,
        updatedAt: Date.now(),
      },
    }));
  };

  return {
    docs,
    currentId,
    currentDoc: currentId ? docs[currentId] : null,
    setCurrentId,
    createDoc,
    deleteDoc,
    updateDoc,
  };
}