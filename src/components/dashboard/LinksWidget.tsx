"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { DirectLink as LinkType } from "@/types";

export function LinksWidget() {
    const { directLinks, addDirectLink, removeDirectLink } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const handleAdd = () => {
        if (!newTitle) return;
        const link: LinkType = {
            id: crypto.randomUUID(),
            title: newTitle,
            url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
        };
        addDirectLink(link);
        setNewTitle('');
        setNewUrl('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-peach-900">Directorio y Recursos</h3>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 hover:bg-peach-100 rounded-lg text-peach-600 transition-colors"
                    >
                        <Plus className="size-5" />
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-peach-50 p-4 rounded-xl border border-peach-200 mb-6 animate-fade-in">
                        <div className="space-y-3">
                            <input
                                placeholder="Título del enlace"
                                className="w-full px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />
                            <input
                                placeholder="URL / Sitio Web"
                                className="w-full px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 text-sm">
                                <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-peach-600">Cancelar</button>
                                <button onClick={handleAdd} className="px-4 py-2 bg-peach-400 text-white rounded-lg">Guardar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-peach-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <ExternalLink className="size-4" /> Enlaces
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {directLinks.map(link => (
                                <div key={link.id} className="group relative bg-peach-50 hover:bg-peach-100 rounded-xl p-3 transition-colors border border-transparent hover:border-peach-200">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <h4 className="font-bold text-peach-800 truncate" title={link.title}>{link.title}</h4>
                                        <p className="text-xs text-peach-500 truncate">{link.url.replace(/^https?:\/\//, '')}</p>
                                    </a>
                                    <button
                                        onClick={() => removeDirectLink(link.id)}
                                        className="absolute top-2 right-2 text-peach-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
