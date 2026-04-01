// src/Components/DocumentsTable.tsx
import { useTheme } from '../../context/ThemeContext';

const DocumentsTable = () => {
  const { theme } = useTheme();

  const tableBg = theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`overflow-x-auto rounded-lg shadow-sm ${tableBg} border ${borderColor}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Last Edited</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 text-sm">Document 1</td>
            <td className="px-4 py-2 text-sm">2024-06-01</td>
          </tr>
          <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 text-sm">Document 2</td>
            <td className="px-4 py-2 text-sm">2024-06-03</td>
          </tr>
          {/* Agrega más filas dinámicamente según tu data */}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;