// src/pages/EditorPage.tsx
import Editor from "./../Components/Lexical/Editor";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header opcional */}
      <div className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <h1 className="text-sm font-medium text-gray-700">
          Editor
        </h1>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl">
          <Editor />
        </div>
      </div>

    </div>
  );
}