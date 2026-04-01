// src/pages/DocumentsPage.tsx
import DocumentsTable from "../Components/Documents/DocumentsTable.js";
import { useTheme } from "../context/ThemeContext";

const DocumentsPage = () => {
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen p-6 ${bgClass}`}>
      <h1 className="text-2xl font-semibold mb-4">Documents</h1>
      <DocumentsTable />
    </div>
  );
};

export default DocumentsPage;