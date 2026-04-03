import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface DocumentInfoProps {
  doc: any;
}

const DocumentInfo = ({ doc }: DocumentInfoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [document, setDocument] = useState(doc);

  const baseClass = `w-full px-2 py-1.5 text-sm rounded border ${isDark ? "border-gray-700 bg-gray-800 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`;
  const readOnlyClass = `w-full px-2 py-1.5 text-sm rounded border ${isDark ? "border-gray-700 bg-gray-700 text-gray-400" : "border-gray-300 bg-gray-100 text-gray-500"}`;

  const Input = ({ label, value, onChange, type = "text", readOnly = false }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={onChange} className={baseClass} rows={2} />
      ) : (
        <input type={type} value={value} onChange={onChange} readOnly={readOnly} className={readOnly ? readOnlyClass : baseClass} />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
      <Input label="Título" value={document.title} onChange={(e: any) => setDocument({ ...document, title: e.target.value })} />
      <Input label="Autor" value={document.author} onChange={(e: any) => setDocument({ ...document, author: e.target.value })} />
      <div className="md:col-span-2">
        <Input label="Descripción" type="textarea" value={document.description} onChange={(e: any) => setDocument({ ...document, description: e.target.value })} />
      </div>
      <Input
        label="Fecha de creación"
        type="date"
        value={new Date(document.createdAt).toISOString().substring(0, 10)}
        onChange={(e: any) => setDocument({ ...document, createdAt: new Date(e.target.value) })}
      />
      <Input label="ID / Versión" value={document.id} readOnly />
    </div>
  );
};

export default DocumentInfo;