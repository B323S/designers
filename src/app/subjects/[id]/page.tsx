"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { GradeCalculator } from "@/components/subject/GradeCalculator";
import { InventoryManager } from "@/components/subject/InventoryManager";
import { KanbanBoard } from "@/components/subject/KanbanBoard";
import { Moodboard } from "@/components/subject/Moodboard";
import { FileRepo } from "@/components/subject/FileRepo";
import { ProcessNotes } from "@/components/subject/ProcessNotes";
import { ArrowLeft, Calculator, Package, Trello, Image as ImageIcon, FileText, FolderOpen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder components
// const GradeCalculator = () => <div>Calculadora en construcción...</div>;
// const InventoryManager = () => <div>Inventario en construcción...</div>;
// const KanbanBoard = () => <div>Kanban en construcción...</div>;
// const Moodboard = () => <div>Moodboard en construcción...</div>;
// const FileRepo = () => <div>Repositorio en construcción...</div>;
// const ProcessNotes = () => <div>Notas en construcción...</div>;

type Tab = 'grades' | 'inventory' | 'kanban' | 'moodboard' | 'files' | 'notes';

export default function SubjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const { subjects, deleteSubject, updateSubject } = useStore();
    const subject = subjects.find(s => s.id === id);
    const [activeTab, setActiveTab] = useState<Tab>('grades');

    if (!subject) {
        return (
            <div className="flex min-h-screen bg-peach-50 items-center justify-center">
                <p className="text-peach-800">Materia no encontrada.</p>
                <button onClick={() => router.push('/')} className="ml-4 text-peach-600 underline">Volver</button>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm("¿Estás seguro de eliminar esta materia?")) {
            deleteSubject(subject.id);
            router.push('/');
        }
    };

    const tabs = [
        { id: 'grades', label: 'Calculadora', icon: Calculator },
        { id: 'inventory', label: 'Inventario', icon: Package },
        { id: 'kanban', label: 'Kanban', icon: Trello },
        { id: 'moodboard', label: 'Moodboard', icon: ImageIcon },
        { id: 'files', label: 'Archivos', icon: FolderOpen },
        { id: 'notes', label: 'Notas', icon: FileText },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/')} className="p-2 hover:bg-peach-200 rounded-lg text-peach-700 transition-colors">
                            <ArrowLeft className="size-5" />
                        </button>
                        <h1 className="text-3xl font-bold text-peach-900">{subject.name}</h1>
                    </div>
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="size-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-6 border-b border-peach-200/50 pb-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all font-medium text-sm whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-peach-900 border-b-2 border-peach-400 shadow-sm"
                                    : "text-peach-600 hover:text-peach-800 hover:bg-peach-100/50"
                            )}
                        >
                            <tab.icon className="size-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-b-2xl rounded-tr-2xl shadow-sm min-h-[500px]">
                {activeTab === 'grades' && <GradeCalculator />}
                {activeTab === 'inventory' && <InventoryManager />}
                {activeTab === 'kanban' && <KanbanBoard />}
                {activeTab === 'moodboard' && <Moodboard />}
                {activeTab === 'files' && <FileRepo />}
                {activeTab === 'notes' && <ProcessNotes />}
            </div>
        </div>
    );
}
