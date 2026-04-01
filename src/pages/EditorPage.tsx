// src/pages/EditorPage.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Editor from './../Components/Lexical/Editor';
import { useDocumentsContext } from '../context/DocumentsContext';
import  type { Document } from '../types/Document';
import { useParams } from 'react-router-dom';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const { updateDocument, getDocument } = useDocumentsContext();
  const [document, setDocument] = useState<Document | undefined>();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    console.log(id)
    const doc = getDocument(id);
    console.log("Documento",doc)
    if (doc) setDocument(doc);
  }, [id]);

  // Función para actualizar tanto el estado local como el contexto
  const handleUpdateDocument = (updatedContent: any) => {
    if (!document) return;
    const updatedDoc = { ...document, content: updatedContent, updatedAt: new Date() };
    setDocument(updatedDoc);
    updateDocument( document.id, updatedDoc);
  };

  if (!document) return <div className="p-6 text-gray-500 dark:text-gray-400">Cargando documento...</div>;

  return (
    <div className="min-h-screen flex flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Información del Documento animada */}
      <motion.div
        className="px-4 py-6 border-r border-gray-200 dark:border-gray-700"
        animate={{ width: collapsed ? 0 : '30%' }}
        initial={{ width: '30%' }}
        transition={{ duration: 0.4 }}
      >
        {!collapsed && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Información del Documento</h1>
              <button
                onClick={() => setCollapsed(true)}
                className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Ocultar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={document.title}
                  onChange={(e) => setDocument({ ...document, title: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Autor</label>
                <input
                  type="text"
                  value={document.author}
                  onChange={(e) => setDocument({ ...document, author: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={document.description}
                  onChange={(e) => setDocument({ ...document, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de creación</label>
                <input
                  type="date"
                  value={new Date(document.createdAt).toISOString().substring(0, 10)}
                  onChange={(e) => setDocument({ ...document, createdAt: new Date(e.target.value)})}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ID / Versión</label>
                <input
                  type="text"
                  value={document.id}
                  readOnly
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Contenido del Editor animado */}
      <motion.div
        className="flex flex-col justify-center px-4 py-6 gap-4"
        animate={{ width: collapsed ? '100%' : '70%', margin: collapsed ? '0 auto' : '0' }}
        initial={{ width: '70%' }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-end mb-2">
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="text-sm px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Mostrar información
            </button>
          )}
        </div>

        <div className="border rounded p-2 mb-2 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold">Editor</h3>
        </div>

        <Editor content={document.content} updateDocument={handleUpdateDocument} />
      </motion.div>
    </div>
  );
}