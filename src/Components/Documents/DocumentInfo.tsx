import { useState } from "react";
import { useTheme } from "./../../context/ThemeContext";

interface DocumentInfoProps {
  doc: any;
}

const DocumentInfo = ({ doc }: DocumentInfoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [document, setDocument] = useState(doc);

  const inputClass = `
    w-full px-3 py-2 rounded border
    ${isDark ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}
  `;

  const readOnlyClass = `
    w-full px-3 py-2 rounded border
    ${isDark ? "border-gray-700 bg-gray-700 text-gray-400" : "border-gray-300 bg-gray-100 text-gray-500"}
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={document.title}
          onChange={(e) => setDocument({ ...document, title: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Autor</label>
        <input
          type="text"
          value={document.author}
          onChange={(e) => setDocument({ ...document, author: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={document.description}
          onChange={(e) => setDocument({ ...document, description: e.target.value })}
          className={inputClass}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de creación</label>
        <input
          type="date"
          value={new Date(document.createdAt).toISOString().substring(0, 10)}
          onChange={(e) =>
            setDocument({ ...document, createdAt: new Date(e.target.value) })
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ID / Versión</label>
        <input
          type="text"
          value={document.id}
          readOnly
          className={readOnlyClass}
        />
      </div>
    </div>
  );
};

export default DocumentInfo;