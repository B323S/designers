"use client";

import { useStore } from "@/store/useStore";
import { X, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { ScheduleItem } from "@/types";

interface AddScheduleModalProps {
    day: string;
    startTime: string;
    onClose: () => void;
}

export function AddScheduleModal({ day, startTime, onClose }: AddScheduleModalProps) {
    const { subjects, updateSubject } = useStore();
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
    const [endTime, setEndTime] = useState(() => {
        // Default to 1 hour later
        const [hour] = startTime.split(':').map(Number);
        return `${String(hour + 1).padStart(2, '0')}:00`;
    });
    const [type, setType] = useState<ScheduleItem['type']>('Teoría');
    const [roomId, setRoomId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubjectId) return;

        const subject = subjects.find(s => s.id === selectedSubjectId);
        if (!subject) return;

        const newItem: ScheduleItem = {
            day: day as any,
            startTime,
            endTime,
            type,
            roomId
        };

        updateSubject(selectedSubjectId, {
            schedule: [...subject.schedule, newItem]
        });

        onClose();
    };

    const hours = [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
        '19:00', '20:00', '21:00', '22:00'
    ];

    return (
        <div className="fixed inset-0 bg-peach-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-peach-100 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-peach-900">Añadir Clase</h2>
                        <p className="text-sm text-peach-500">{day} - {startTime}</p>
                    </div>
                    <button onClick={onClose} className="text-peach-400 hover:text-peach-600 transition-colors">
                        <X className="size-6" />
                    </button>
                </div>

                {subjects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-peach-600 mb-4">Primero necesitas crear una materia.</p>
                        <button onClick={onClose} className="text-peach-500 hover:underline">Cerrar</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-peach-700 mb-1">Materia</label>
                            <select
                                className="w-full px-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                value={selectedSubjectId}
                                onChange={e => setSelectedSubjectId(e.target.value)}
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-peach-700 mb-1">Hora Inicio</label>
                                <div className="flex items-center px-3 py-2 rounded-xl border border-peach-200 bg-peach-50 text-peach-600">
                                    <Clock className="size-4 mr-2" />
                                    {startTime}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-peach-700 mb-1">Hora Fin</label>
                                <select
                                    className="w-full px-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                >
                                    {hours.filter(h => h > startTime).map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-peach-700 mb-1">Tipo</label>
                                <select
                                    className="w-full px-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                >
                                    <option value="Teoría">Teoría</option>
                                    <option value="Práctica">Práctica</option>
                                    <option value="Taller">Taller</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-peach-700 mb-1">Salón (Op.)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 size-4 text-peach-400" />
                                    <input
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                        placeholder="Ej. A-204"
                                        value={roomId}
                                        onChange={e => setRoomId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-peach-600 font-medium hover:bg-peach-50 rounded-xl transition-colors">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-peach-400 hover:bg-peach-500 text-white font-bold rounded-xl shadow-sm transition-all"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
