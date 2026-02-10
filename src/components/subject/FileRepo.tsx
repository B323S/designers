"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2, FolderOpen, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export function FileRepo() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    if (!subject) return null;

    const handleAdd = () => {
        if (!newName || !newUrl) return;
        const newItem = {
            id: crypto.randomUUID(),
            name: newName,
            url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
        };
        updateSubject(subject.id, { fileLinks: [...subject.fileLinks, newItem] });
        setNewName('');
        setNewUrl('');
        setIsAdding(false);
    };

    const handleDelete = (itemId: string) => {
        if (confirm("¿Eliminar enlace?")) {
            updateSubject(subject.id, { fileLinks: subject.fileLinks.filter(i => i.id !== itemId) });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-peach-900">Repositorio de Archivos</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-peach-300 hover:bg-peach-400 text-peach-900 rounded-lg font-medium transition-colors"
                >
                    <Plus className="size-4" /> Añadir Carpeta/Archivo
                </button>
            </div>

            {isAdding && (
                <div className="bg-peach-50 p-4 rounded-xl border border-peach-200 mb-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            placeholder="Nombre (ej. Entregas Drive)"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <input
                            placeholder="Link (url)"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newUrl}
                            onChange={e => setNewUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-peach-600">Cancelar</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-peach-400 text-white rounded-lg">Guardar</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {subject.fileLinks.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-peach-100 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-peach-100 rounded-lg text-peach-500">
                                <FolderOpen className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-peach-900">{item.name}</h4>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-peach-500 hover:underline flex items-center gap-1">
                                    {item.url} <ExternalLink className="size-3" />
                                </a>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-peach-300 hover:text-red-400">
                            <Trash2 className="size-5" />
                        </button>
                    </div>
                ))}
            </div>

            {subject.fileLinks.length === 0 && !isAdding && (
                <div className="text-center py-10 text-peach-400 italic border-2 border-dashed border-peach-100 rounded-xl">
                    Guarda enlaces a tus carpetas de Drive o Dropbox aquí.
                </div>
            )}
        </div>
    );
}
