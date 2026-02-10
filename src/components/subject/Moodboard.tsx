"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2, Image as ImageIcon, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export function Moodboard() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);
    const [isAdding, setIsAdding] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [newNote, setNewNote] = useState("");

    if (!subject) return null;

    const handleAdd = () => {
        if (!newUrl) return;
        const newItem = {
            id: crypto.randomUUID(),
            url: newUrl,
            note: newNote
        };
        updateSubject(subject.id, { moodboardImages: [...subject.moodboardImages, newItem] });
        setNewUrl('');
        setNewNote('');
        setIsAdding(false);
    };

    const handleDelete = (itemId: string) => {
        if (confirm("¿Eliminar imagen?")) {
            updateSubject(subject.id, { moodboardImages: subject.moodboardImages.filter(i => i.id !== itemId) });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-peach-900">Moodboard de Referencias</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-peach-300 hover:bg-peach-400 text-peach-900 rounded-lg font-medium transition-colors"
                >
                    <Plus className="size-4" /> Añadir Referencia
                </button>
            </div>

            {isAdding && (
                <div className="bg-peach-50 p-4 rounded-xl border border-peach-200 mb-6 animate-fade-in">
                    <div className="flex flex-col gap-3">
                        <input
                            placeholder="URL de la imagen o link"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newUrl}
                            onChange={e => setNewUrl(e.target.value)}
                        />
                        <input
                            placeholder="Nota (opcional)"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-peach-600">Cancelar</button>
                            <button onClick={handleAdd} className="px-4 py-2 bg-peach-400 text-white rounded-lg">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="masonry-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subject.moodboardImages.map(item => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-peach-100 bg-white">
                        <img src={item.url} alt="Reference" className="w-full h-auto object-cover min-h-[100px]" onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Error+Loading';
                        }} />

                        <div className="absolute inset-0 bg-peach-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-full text-red-500 hover:text-red-700">
                                <Trash2 className="size-4" />
                            </button>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-peach-500 hover:text-peach-700">
                                <ExternalLink className="size-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {subject.moodboardImages.length === 0 && !isAdding && (
                <div className="text-center py-10 text-peach-400 italic border-2 border-dashed border-peach-100 rounded-xl">
                    Agrega imágenes o referencias visuales para inspirarte.
                </div>
            )}
        </div>
    );
}
