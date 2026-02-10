"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2, Image as ImageIcon, ExternalLink, DollarSign } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function InventoryManager() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newCost, setNewCost] = useState("");
    const [newImage, setNewImage] = useState("");

    if (!subject) return null;

    const handleAdd = () => {
        if (!newName) return;
        const newMaterial = {
            id: crypto.randomUUID(),
            name: newName,
            cost: Number(newCost) || 0,
            imageUrl: newImage
        };

        updateSubject(subject.id, {
            materials: [...subject.materials, newMaterial]
        });

        setNewName('');
        setNewCost('');
        setNewImage('');
        setIsAdding(false);
    };

    const handleDelete = (materialId: string) => {
        if (confirm("¿Eliminar material?")) {
            updateSubject(subject.id, {
                materials: subject.materials.filter(m => m.id !== materialId)
            });
        }
    };

    const totalCost = subject.materials.reduce((acc, m) => acc + m.cost, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-peach-900">Inventario de Materiales</h2>
                    <p className="text-peach-600">Gasto Total: <span className="text-2xl font-bold text-peach-800">${totalCost.toLocaleString('es-CO')}</span></p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-peach-300 hover:bg-peach-400 text-peach-900 rounded-lg font-medium transition-colors"
                >
                    <Plus className="size-4" /> Añadir Material
                </button>
            </div>

            {isAdding && (
                <div className="bg-peach-50 p-4 rounded-xl border border-peach-200 mb-6 animate-fade-in">
                    <h3 className="font-bold text-peach-800 mb-2">Nuevo Material</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            placeholder="Nombre del material"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 size-4 text-peach-400" />
                            <input
                                type="number"
                                placeholder="Costo"
                                className="w-full pl-9 px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                                value={newCost}
                                onChange={e => setNewCost(e.target.value)}
                            />
                        </div>
                        <input
                            placeholder="URL de imagen (opcional)"
                            className="px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                            value={newImage}
                            onChange={e => setNewImage(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-peach-600 hover:bg-peach-100 rounded-lg">Cancelar</button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-peach-400 text-white font-bold rounded-lg hover:bg-peach-500">Guardar</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subject.materials.map(material => (
                    <div key={material.id} className="group relative bg-white border border-peach-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-peach-100 relative items-center justify-center flex">
                            {material.imageUrl ? (
                                <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="size-12 text-peach-300" />
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-peach-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleDelete(material.id)} className="p-2 bg-white rounded-full text-red-500 hover:text-red-700">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-peach-900 truncate" title={material.name}>{material.name}</h4>
                            <p className="text-peach-500 font-medium">${material.cost.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {subject.materials.length === 0 && !isAdding && (
                <div className="text-center py-10 text-peach-400 italic border-2 border-dashed border-peach-100 rounded-xl">
                    Tu inventario está vacío.
                </div>
            )}
        </div>
    );
}
