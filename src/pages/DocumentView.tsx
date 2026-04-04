// src/pages/DocumentView.tsx
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import EditorPreview from "../Components/Editor/EditorPreview";
import DocInfo from "../Components/Documents/DocInfo";
import { useState, useEffect } from "react";
import type { RootNode } from "lexical";
import DocumentHistory from "../Components/Documents/DocumentHistory";

const LOCAL_STORAGE_KEY = 'lexical-editor-content';

interface Document {
    id: string;
    title: string;
    author: string;
    description: string;
    content: RootNode;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentView = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [document, setDocument] = useState<Document>({
        id: 'local-doc',
        title: '',
        author: '',
        description: '',
        content: {} as RootNode,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const [editorContent, setEditorContent] = useState<RootNode | null>(null);

    // Cargar contenido del localStorage
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setEditorContent(parsed);
            } catch (e) {
                console.error("Error parsing saved document content:", e);
            }
        }
    }, []);

    return (
        <div className={`min-h-screen h-9/12 p-6 transition-colors ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <h2 className="text-2xl font-bold mb-6">Documento</h2>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Panel izquierdo: información del documento */}
                <div className="md:w-1/3">
                    <DocInfo doc={document} />
                    <hr />     <DocumentHistory />

                </div>

                {/* Panel derecho: visor de contenido en solo lectura */}
                <div className="md:w-2/3 space-y-4">
                    <div className={`p-4 rounded-lg shadow ${isDark ? "bg-gray-800" : "bg-white"} h-[600px] overflow-auto`}>
                        <EditorPreview value={editorContent} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentView;