"use client";

import { useStore } from "@/store/useStore";
import { DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BudgetPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { subjects } = useStore();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/register");
        }
    }, [status, router]);

    if (status !== "authenticated") {
        return null;
    }

    const totalBudget = subjects.reduce((total, subject) => {
        const subjectTotal = subject.materials.reduce((subSum, material) => subSum + material.cost, 0);
        return total + subjectTotal;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-peach-900">Presupuesto Global</h1>
                <p className="text-peach-600">Control de gastos en materiales por materia.</p>
            </header>

            {/* Total Card */}
            <div className="bg-white/60 backdrop-blur border border-peach-100 p-8 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-peach-600 font-medium text-lg mb-1">Gasto Total Acumulado</h3>
                    <p className="text-5xl font-bold text-peach-900">${totalBudget.toLocaleString('es-CO')}</p>
                </div>
                <div className="p-4 bg-peach-100 rounded-2xl text-peach-500">
                    <DollarSign className="size-10" />
                </div>
            </div>

            {/* Breakdown by Subject */}
            <div className="bg-white/60 backdrop-blur border border-peach-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-peach-100">
                    <h3 className="font-bold text-peach-900 text-lg">Desglose por Materia</h3>
                </div>
                <div className="divide-y divide-peach-100">
                    {subjects.length === 0 ? (
                        <div className="p-8 text-center text-peach-400 italic">No hay materias registradas.</div>
                    ) : (
                        subjects.map(subject => {
                            const subTotal = subject.materials.reduce((acc, m) => acc + m.cost, 0);
                            return (
                                <div key={subject.id} className="p-6 flex items-center justify-between hover:bg-peach-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                                        <div>
                                            <h4 className="font-bold text-peach-900 text-lg">{subject.name}</h4>
                                            <p className="text-sm text-peach-500">{subject.materials.length} materiales</p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold text-peach-800">${subTotal.toLocaleString('es-CO')}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
