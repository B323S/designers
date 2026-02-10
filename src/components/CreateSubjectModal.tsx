"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateSubjectModalProps {
    onClose: () => void;
}

export function CreateSubjectModal({ onClose }: CreateSubjectModalProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#ffbe98");
    const { addSubject } = useStore();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const id = crypto.randomUUID();
        addSubject({
            id,
            name,
            color: color,
            schedule: [],
            gradeGroups: [],
            materials: [],
            kanbanColumns: [
                { id: crypto.randomUUID(), title: 'Por hacer', order: 0 },
                { id: crypto.randomUUID(), title: 'En proceso', order: 1 },
                { id: crypto.randomUUID(), title: 'Hecho', order: 2 }
            ],
            kanbanTasks: [],
            moodboardImages: [],
            fileLinks: [],
            processNotes: ''
        });

        router.push(`/subjects/${id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-peach-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-peach-100 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-peach-900">Nueva Materia</h2>
                    <button onClick={onClose} className="text-peach-400 hover:text-peach-600 transition-colors">
                        <X className="size-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-peach-700 mb-2">Nombre de la materia</label>
                        <input
                            id="name"
                            autoFocus
                            className="w-full px-4 py-3 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 text-lg"
                            placeholder="Ej. Taller de Diseño III"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-peach-700 mb-2">Color</label>
                        <div className="flex gap-3">
                            {['#ffbe98', '#ff9aa2', '#e2f0cb', '#b5ead7', '#c7ceea', '#ecc9c9', '#fbf8cc'].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-peach-600 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-peach-600 font-medium hover:bg-peach-50 rounded-xl transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-peach-400 hover:bg-peach-500 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Crear Materia
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
