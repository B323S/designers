"use client";

import { useStore } from "@/store/useStore";
import { X, Clock, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { ScheduleItem } from "@/types";

interface EditScheduleModalProps {
    initialSubjectName: string;
    scheduleItem: ScheduleItem;
    onClose: () => void;
}

export function EditScheduleModal({ initialSubjectName, scheduleItem, onClose }: EditScheduleModalProps) {
    const { subjects, updateSubject } = useStore();
    const [endTime, setEndTime] = useState(scheduleItem.endTime);
    const [type, setType] = useState<ScheduleItem['type']>(scheduleItem.type);
    const [roomId, setRoomId] = useState(scheduleItem.roomId || "");

    // Find which subject this item actually belongs to (in case name is just display)
    // Actually we need the subject ID to update it.
    // Let's find the subject that contains this exact schedule item instance or matches
    const subject = subjects.find(s =>
        s.schedule.some(i =>
            i.day === scheduleItem.day &&
            i.startTime === scheduleItem.startTime &&
            i.endTime === scheduleItem.endTime
        )
    );

    const handleDelete = () => {
        if (!subject) return;

        // Filter out this specific item
        const newSchedule = subject.schedule.filter(i =>
            !(i.day === scheduleItem.day && i.startTime === scheduleItem.startTime)
        );

        updateSubject(subject.id, { schedule: newSchedule });
        onClose();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject) return;

        const newSchedule = subject.schedule.map(i => {
            if (i.day === scheduleItem.day && i.startTime === scheduleItem.startTime) {
                return {
                    ...i,
                    endTime,
                    type,
                    roomId
                };
            }
            return i;
        });

        updateSubject(subject.id, { schedule: newSchedule });
        onClose();
    };

    if (!subject) return null;

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
                        <h2 className="text-xl font-bold text-peach-900">Editar Clase</h2>
                        <p className="text-sm text-peach-500">{subject.name} - {scheduleItem.day}</p>
                    </div>
                    <button onClick={onClose} className="text-peach-400 hover:text-peach-600 transition-colors">
                        <X className="size-6" />
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-peach-700 mb-1">Hora Inicio</label>
                            <div className="flex items-center px-3 py-2 rounded-xl border border-peach-200 bg-peach-50 text-peach-600">
                                <Clock className="size-4 mr-2" />
                                {scheduleItem.startTime}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-peach-700 mb-1">Hora Fin</label>
                            <select
                                className="w-full px-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                            >
                                {hours.filter(h => h > scheduleItem.startTime).map(h => (
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
                            <label className="block text-sm font-medium text-peach-700 mb-1">Salón</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 size-4 text-peach-400" />
                                <input
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                                    value={roomId}
                                    onChange={e => setRoomId(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-red-400 hover:bg-red-500 rounded-xl transition-colors font-medium shadow-sm"
                        >
                            <Trash2 className="size-4" />
                            Eliminar
                        </button>

                        <div className="flex gap-3">
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
                    </div>
                </form>
            </div>
        </div>
    );
}
