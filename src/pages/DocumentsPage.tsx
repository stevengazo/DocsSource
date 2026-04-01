import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface DocumentModalProps {
  doc?: { title?: string; description?: string };
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}

const DocumentModal = ({ doc, onClose, onSave }: DocumentModalProps) => {
  const [title, setTitle] = useState(doc?.title || '');
  const [description, setDescription] = useState(doc?.description || '');

  const handleSave = () => {
    if (!title.trim()) return alert('El título es obligatorio');
    onSave({ title, description });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-6 w-96"
        >
          <h2 className="text-lg font-semibold mb-4">
            {doc ? 'Editar Documento' : 'Nuevo Documento'}
          </h2>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-2 py-1 rounded outline-none"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-2 py-1 rounded outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
            >
              Guardar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DocumentsWorkspace = () => {
  const { docs, createDoc } = useDocuments();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDoc = (docId: string) => {
    navigate(`/editor/${docId}`);
  };

  const handleCreateDoc = (data: { title: string; description: string }) => {
    const newDoc = createDoc(data.title, data.description);
    navigate(`/editor/${newDoc.id}`);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Documentos</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
          + Nuevo Documento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto flex-1">
        {Object.values(docs).length === 0 && (
          <div className="p-4 text-gray-500 text-sm">No hay documentos</div>
        )}

        {Object.values(docs).map((doc: any) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDoc(doc.id)}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <div className="font-medium">{doc.title || 'Sin título'}</div>
              <div className="text-gray-500 text-sm truncate">
                {doc.description || 'Sin descripción'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <DocumentModal
          onClose={() => setModalOpen(false)}
          onSave={handleCreateDoc}
        />
      )}
    </div>
  );
};

export default DocumentsWorkspace;