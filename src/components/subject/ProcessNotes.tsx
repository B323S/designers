"use client";

import { useStore } from "@/store/useStore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export function ProcessNotes() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (subject) setContent(subject.processNotes || "");
    }, [subject?.id]); // Only update on load or id change, not every keystroke loop

    if (!subject) return null;

    const handleSave = () => {
        updateSubject(subject.id, { processNotes: content });
        alert("Notas guardadas.");
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-peach-900">Bitácora de Proceso</h2>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-peach-400 text-white font-bold rounded-lg hover:bg-peach-500 transition-colors shadow-sm"
                >
                    Guardar Cambios
                </button>
            </div>

            <div className="flex-1 min-h-[400px]">
                <textarea
                    className="w-full h-full p-6 rounded-xl border border-peach-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-peach-300 text-peach-900 leading-relaxed resize-none shadow-inner"
                    placeholder="Escribe aquí tu bitácora, ideas, o evolución del diseño..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </div>
    );
}
