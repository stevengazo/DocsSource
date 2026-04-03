// src/pages/EditorPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from './../Components/Lexical/Editor';
import type { Document } from '../types/Document';
import type { RootNode } from '../types/DocumentNodes';
import DocumentInfo from '../Components/Documents/DocumentInfo';

export default function EditorPage() {

  const [collapsed, setCollapsed] = useState(false);

  // Documento mock/local (sin carga externa)
  const [document, setDocument] = useState<Document>({
    id: 'local-doc',
    title: '',
    author: '',
    description: '',
    content: {} as RootNode,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Solo actualiza estado local (sin contexto)
  const handleUpdateDocument = (updatedContent: RootNode) => {
    const updatedDoc = {
      ...document,
      content: updatedContent,
      updatedAt: new Date(),
    };

    setDocument(updatedDoc);
  };

  return (
    <div className=" h-screen-85 flex flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
            <DocumentInfo doc={document} />

          </>
        )}
      </motion.div>

      {/* Contenido del Editor animado */}
      <motion.div
        className="flex flex-col justify-center px-4 py-6 gap-4"
        animate={{
          width: collapsed ? '100%' : '70%',
          margin: collapsed ? '0 auto' : '0',
        }}
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

        <Editor  />
      </motion.div>
    </div>
  );
}