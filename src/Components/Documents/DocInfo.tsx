// src/components/Documents/DocInfo.tsx
import { useTheme } from "../../context/ThemeContext";

interface DocumentInfoProps {
  doc: any;
}

const DocInfo = ({ doc }: DocumentInfoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const readOnlyClass = `w-full px-2 py-1.5 text-sm rounded border ${
    isDark ? "border-gray-700 bg-gray-700 text-gray-400" : "border-gray-300 bg-gray-100 text-gray-500"
  }`;

  const Input = ({ label, value, type = "text" }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} readOnly className={readOnlyClass} rows={2} />
      ) : (
        <input type={type} value={value} readOnly className={readOnlyClass} />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <Input label="Título" value={doc.title} />
      <Input label="Autor" value={doc.author} />
      <div className="md:col-span-2">
        <Input label="Descripción" type="textarea" value={doc.description} />
      </div>
      <Input
        label="Fecha de creación"
        type="date"
        value={new Date(doc.createdAt).toISOString().substring(0, 10)}
      />
      <Input label="ID / Versión" value={doc.id} />
    </div>
  );
};

export default DocInfo;