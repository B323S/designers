"use client";

import { useStore } from "@/store/useStore";
import { Clock } from "lucide-react";

export function DeliveriesWidget() {
    const { subjects } = useStore();

    // Calculate upcoming tasks (placeholder logic: count all tasks in non-done columns)
    // In a real app, we'd check dates. For now, we sum up all tasks.
    const pendingTasks = subjects.reduce((total, sub) => {
        // Assuming 'done' or 'completed' status is not counted, but we don't have standard IDs yet.
        // We'll just count all kanban tasks for now or tasks not in the last column.
        if (!sub.kanbanColumns || sub.kanbanColumns.length === 0) return total;

        const lastColumnId = sub.kanbanColumns[sub.kanbanColumns.length - 1].id;
        const tasksNotDone = sub.kanbanTasks.filter(t => t.statusId !== lastColumnId).length;
        return total + tasksNotDone;
    }, 0);

    return (
        <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-peach-600 font-medium">Próximas Entregas</h3>
                <div className="p-2 bg-peach-100 rounded-lg text-peach-500">
                    <Clock className="size-5" />
                </div>
            </div>
            <p className="text-3xl font-bold text-peach-900">{pendingTasks}</p>
            <div className="mt-4 text-xs text-peach-500 font-medium">
                Tareas pendientes
            </div>
        </div>
    );
}
