import { useMemo } from "react";
import { useTheme } from "../../src/context/ThemeContext";

type DebugPanelProps = {
  data: string;
};

export function DebugPanel({ data }: DebugPanelProps) {
  const { theme } = useTheme();

  console.log("DebugPanel renderizado con data:", data);

  const formatted = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }, [data]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
  };

  return (
    <div
      className={`mt-4 h-full border rounded-lg shadow-sm ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b ${
          theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-100 bg-gray-50"
        }`}
      >
        <span
          className={`text-xs font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Editor State (JSON)
        </span>

        <button
          onClick={handleCopy}
          className={`text-xs px-2 py-1 rounded transition ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
          }`}
        >
          Copy
        </button>
      </div>

      {/* Content */}
      <div className=" h-fit overflow-auto">
        <pre
          className={`text-xs p-3 font-mono leading-relaxed ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {formatted}
        </pre>
      </div>
    </div>
  );
}