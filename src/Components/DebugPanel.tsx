
import { useMemo } from "react";

type DebugPanelProps = {
  data: string;
};

export function DebugPanel({ data }: DebugPanelProps) {
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
    <div className="mt-4 border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
        <span className="text-xs font-medium text-gray-600">
          Editor State (JSON)
        </span>

        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          Copy
        </button>
      </div>

      {/* Content */}
      <div className="max-h-60 overflow-auto">
        <pre className="text-xs p-3 font-mono text-gray-800 leading-relaxed">
          {formatted}
        </pre>
      </div>
    </div>
  );
}