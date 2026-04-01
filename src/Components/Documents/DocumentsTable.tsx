// src/Components/DocumentsTable.tsx
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import  type { Document } from '../../types/Document';

interface DocumentsTableProps {
  documents: Document[];
}

const DocumentsTable = ({ documents }: DocumentsTableProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const tableBg = theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`overflow-x-auto rounded-lg shadow-sm ${tableBg} border ${borderColor}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Last Edited</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Author</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {documents.map((doc, index) => (
            <tr
              key={index}
              onClick={() => navigate(`/editor/${doc.id}`)} // puedes usar index o agregar un id
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2 text-sm">{doc.title}</td>
              <td className="px-4 py-2 text-sm">{new Date(doc.updatedAt).toLocaleString()}</td>
              <td className="px-4 py-2 text-sm">{doc.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;