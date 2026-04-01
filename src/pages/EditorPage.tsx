// src/pages/EditorPage.tsx
import Editor from "./../Components/Lexical/Editor";

export default function EditorPage() {
  return (
    <div className="min-h-screen  flex flex-col">
      
      {/* Contenido */}
      <div className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl">
          <Editor />
        </div>
      </div>

    </div>
  );
}