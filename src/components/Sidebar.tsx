"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { CreateSubjectModal } from "./CreateSubjectModal";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const { subjects, fetchData } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status, fetchData]);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <>
            {isModalOpen && <CreateSubjectModal onClose={() => setIsModalOpen(false)} />}
            <aside className="w-64 bg-peach-50/50 border-r border-peach-200 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto hidden md:flex flex-col flex-shrink-0">
                <div className="p-4 pt-6">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <p className="text-xs font-bold text-peach-600 uppercase tracking-widest">Materias</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-peach-500 hover:text-peach-800 transition-colors p-1.5 hover:bg-peach-200 rounded-md"
                            title="Nueva Materia"
                        >
                            <Plus className="size-4" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        {subjects.length === 0 ? (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full text-left px-4 py-3 text-sm text-peach-500 italic hover:bg-peach-100/50 rounded-lg transition-colors border border-dashed border-peach-200 hover:border-peach-300"
                            >
                                + Crear primera materia
                            </button>
                        ) : (
                            subjects.map(sub => (
                                <Link
                                    key={sub.id}
                                    href={`/subjects/${sub.id}`}
                                    className={cn(
                                        "block px-4 py-2 rounded-lg text-sm transition-colors truncate font-medium",
                                        pathname === `/subjects/${sub.id}`
                                            ? "bg-peach-200/80 text-peach-900 shadow-sm"
                                            : "text-peach-700 hover:bg-peach-100 hover:text-peach-900"
                                    )}
                                >
                                    {sub.name}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
