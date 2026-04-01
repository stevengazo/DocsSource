import DocumentsTable from "../Components/Documents/DocumentsTable";
import { useDocuments } from "../hooks/useDocuments";
import { useTheme } from "../context/ThemeContext";
import { useDocumentsContext } from "../context/DocumentsContext";

const DocumentsPage = () => {
  
  const { documents, addDocument } = useDocumentsContext();
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen p-6 ${bgClass}`}>
      <h1 className="text-2xl font-semibold mb-4">Documents</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => 
          addDocument(
            `Document ${documents.length + 1}`, 
            '', // description vacío
            {
              type: 'root',
              version: 1,
              format: '',
              indent: 0,
              direction: null,
              children: [],
            } // content vacío
          )
        }
      >
        Add Document
      </button>
      <DocumentsTable documents={documents} />
    </div>
  );
};

export default DocumentsPage;