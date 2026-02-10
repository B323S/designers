"use client";

import { useStore } from "@/store/useStore";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function GradeCalculator() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);

    if (!subject) return null;

    // Helpers
    const handleAddGroup = () => {
        const newGroup = {
            id: crypto.randomUUID(),
            name: "Nuevo Corte",
            weight: 0,
            grades: [],
        };
        updateSubject(subject.id, {
            gradeGroups: [...subject.gradeGroups, newGroup],
        });
    };

    const updateGroup = (groupId: string, updates: any) => {
        const newGroups = subject.gradeGroups.map((g) =>
            g.id === groupId ? { ...g, ...updates } : g
        );
        updateSubject(subject.id, { gradeGroups: newGroups });
    };

    const deleteGroup = (groupId: string) => {
        if (confirm("¿Eliminar este corte y sus notas?")) {
            const newGroups = subject.gradeGroups.filter((g) => g.id !== groupId);
            updateSubject(subject.id, { gradeGroups: newGroups });
        }
    };

    const addGrade = (groupId: string) => {
        const group = subject.gradeGroups.find((g) => g.id === groupId);
        if (!group) return;

        const newGrade = {
            id: crypto.randomUUID(),
            name: "Nueva Nota",
            value: 0,
            weight: 0, // 0 implies equal weight or custom
        };
        updateGroup(groupId, { grades: [...group.grades, newGrade] });
    };

    const updateGrade = (groupId: string, gradeId: string, updates: any) => {
        const group = subject.gradeGroups.find((g) => g.id === groupId);
        if (!group) return;

        const newGrades = group.grades.map((g) =>
            g.id === gradeId ? { ...g, ...updates } : g
        );
        updateGroup(groupId, { grades: newGrades });
    };

    const deleteGrade = (groupId: string, gradeId: string) => {
        const group = subject.gradeGroups.find((g) => g.id === groupId);
        if (!group) return;
        updateGroup(groupId, { grades: group.grades.filter(g => g.id !== gradeId) });
    };

    // Calculations
    const calculateGroupAverage = (group: any) => {
        if (group.grades.length === 0) return 0;
        const sum = group.grades.reduce((acc: number, g: any) => acc + Number(g.value), 0);
        return (sum / group.grades.length).toFixed(1);
    };

    const calculateTotalAverage = () => {
        let total = 0;
        let totalWeight = 0;

        subject.gradeGroups.forEach(g => {
            const groupAvg = parseFloat(calculateGroupAverage(g) as string);
            total += groupAvg * (g.weight / 100);
            totalWeight += g.weight;
        });

        return total.toFixed(1);
    };

    const maxGrade = useStore(state => {
        if (state.gradingScale === '0-100') return 100;
        if (state.gradingScale === '0-10') return 10;
        return 5;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-peach-900">Calculadora de Semestre</h2>
                    <p className="text-peach-600">Promedio Actual: <span className="text-2xl font-bold text-peach-800">{calculateTotalAverage()} / {maxGrade}</span></p>
                </div>
                <button
                    onClick={handleAddGroup}
                    className="flex items-center gap-2 px-4 py-2 bg-peach-300 hover:bg-peach-400 text-peach-900 rounded-lg font-medium transition-colors"
                >
                    <Plus className="size-4" /> Añadir Corte/Grupo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subject.gradeGroups.map((group) => (
                    <div key={group.id} className="bg-peach-50/50 border border-peach-200 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4 pb-2 border-b border-peach-200">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <input
                                        className="bg-transparent font-bold text-peach-900 focus:outline-none focus:border-b border-peach-400 w-full"
                                        value={group.name}
                                        onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-peach-600">
                                    <span>Peso:</span>
                                    <input
                                        type="number"
                                        className="bg-white/50 w-16 px-1 rounded border border-peach-200 focus:outline-none text-center"
                                        value={group.weight}
                                        onChange={(e) => updateGroup(group.id, { weight: Number(e.target.value) })}
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className={`px-3 py-1 rounded-lg font-bold text-sm ${parseFloat(calculateGroupAverage(group) as string) < (maxGrade * 0.6) ? 'bg-red-100 text-red-800' : 'bg-peach-200 text-peach-800'}`}>
                                    {calculateGroupAverage(group)}
                                </div>
                                <button onClick={() => deleteGroup(group.id)} className="text-peach-400 hover:text-red-400">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {group.grades.map((grade) => (
                                <div key={grade.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        className="flex-1 bg-white/60 px-2 py-1 rounded border border-peach-100 focus:outline-none focus:border-peach-300"
                                        value={grade.name}
                                        onChange={(e) => updateGrade(group.id, grade.id, { name: e.target.value })}
                                        placeholder="Actividad"
                                    />
                                    <input
                                        type="number"
                                        className="w-16 bg-white/60 px-2 py-1 rounded border border-peach-100 focus:outline-none focus:border-peach-300 text-center font-medium text-peach-900"
                                        value={grade.value}
                                        onChange={(e) => {
                                            let val = Number(e.target.value);
                                            if (val > maxGrade) val = maxGrade;
                                            if (val < 0) val = 0;
                                            updateGrade(group.id, grade.id, { value: val })
                                        }}
                                        max={maxGrade}
                                        min={0}
                                        placeholder="0.0"
                                    />
                                    <button onClick={() => deleteGrade(group.id, grade.id)} className="text-peach-300 hover:text-red-300">
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => addGrade(group.id)}
                                className="w-full py-1 mt-2 text-xs text-peach-500 hover:text-peach-700 hover:bg-peach-100 rounded border border-dashed border-peach-200 transition-colors"
                            >
                                + Añadir Nota
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {subject.gradeGroups.length === 0 && (
                <div className="text-center py-10 text-peach-400 italic">
                    No hay cortes de evaluación. Añade uno para empezar.
                </div>
            )}
        </div>
    );
}
