"use client";

import { useStore } from "@/store/useStore";
import { DollarSign } from "lucide-react";

export function BudgetWidget() {
    const { subjects } = useStore();

    const totalBudget = subjects.reduce((total, subject) => {
        const subjectTotal = subject.materials.reduce((subSum, material) => subSum + material.cost, 0);
        return total + subjectTotal;
    }, 0);

    return (
        <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-peach-600 font-medium">Presupuesto</h3>
                <div className="p-2 bg-peach-100 rounded-lg text-peach-500">
                    <DollarSign className="size-5" />
                </div>
            </div>

            <p className="text-3xl font-bold text-peach-900">
                ${totalBudget.toLocaleString('es-CO')}
            </p>
            <div className="mt-4 text-xs text-peach-500 font-medium">
                Total invertido en materiales
            </div>
        </div>
    );
}
