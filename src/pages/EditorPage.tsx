import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from './../Components/Lexical/Editor';

interface DocumentData {
  title: string;
  description: string;
  author: string;
  creation: string;
  currentVersion: string;
  tags: string[];
}

export default function EditorPage() {
  const [document, setDocument] = useState<DocumentData>({
    title: '',
    description: '',
    author: '',
    creation: '',
    currentVersion: '',
    tags: [],
  });

  const [collapsed, setCollapsed] = useState(false);

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
                  value={document.creation}
                  onChange={(e) => setDocument({ ...document, creation: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Versión actual</label>
                <input
                  type="text"
                  value={document.currentVersion}
                  onChange={(e) => setDocument({ ...document, currentVersion: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
                <input
                  type="text"
                  value={document.tags.join(', ')}
                  onChange={(e) => setDocument({ ...document, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <h3 className="text-lg font-semibold">Documento</h3>
        </div>
        <Editor />
      </motion.div>
    </div>
  );
}