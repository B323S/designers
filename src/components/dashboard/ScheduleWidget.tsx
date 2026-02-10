"use client";

import { useStore } from "@/store/useStore";

import { useState } from "react";
import { AddScheduleModal } from "./AddScheduleModal";
import { EditScheduleModal } from "./EditScheduleModal";
import { ScheduleItem } from "@/types";

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HOURS = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
];

export function ScheduleWidget() {
    const { subjects } = useStore();
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);
    const [editingItem, setEditingItem] = useState<{ subjectName: string, item: ScheduleItem } | null>(null);

    // Helper to find class at a specific time slot
    // This is a simplified view; in a real app, we'd handle durations properly.
    // Check if a time slot is occupied by a class
    const getClass = (day: string, time: string) => {
        for (const sub of subjects) {
            const found = sub.schedule.find(s => {
                // String comparison works for "HH:MM" format (e.g. "07:00" <= "09:00" < "11:00")
                return s.day === day && time >= s.startTime && time < s.endTime;
            });

            if (found) {
                // Calculate if this is the first slot of the class to show simpler UI or full details
                const isStart = found.startTime === time;
                return {
                    subject: sub.name,
                    color: sub.color,
                    type: found.type,
                    location: found.roomId,
                    isStart,
                    rawItem: found // Pass the raw item for editing
                };
            }
        }
        return null;
    };

    return (
        <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm min-h-[400px]">
            {selectedSlot && (
                <AddScheduleModal
                    day={selectedSlot.day}
                    startTime={selectedSlot.time}
                    onClose={() => setSelectedSlot(null)}
                />
            )}
            {editingItem && (
                <EditScheduleModal
                    initialSubjectName={editingItem.subjectName}
                    scheduleItem={editingItem.item}
                    onClose={() => setEditingItem(null)}
                />
            )}
            <h3 className="text-xl font-bold text-peach-900 mb-4">Horario Semanal</h3>
            <div className="overflow-x-auto">
                <div className="min-w-[600px] grid grid-cols-6 gap-x-2 gap-y-0">
                    {/* Header */}
                    <div className="text-xs font-semibold text-peach-400 pb-2">Hora</div>
                    {DAYS.map(day => (
                        <div key={day} className="text-xs font-semibold text-peach-600 text-center uppercase tracking-wider pb-2">
                            {day}
                        </div>
                    ))}

                    {/* Grid */}
                    {HOURS.map((hour, hourIndex) => (
                        <div key={hour} className="contents">
                            {/* Time Label */}
                            <div className="text-xs text-peach-400 py-1 border-t border-peach-100 flex items-start h-[60px]">
                                {hour}
                            </div>

                            {/* Days */}
                            {DAYS.map(day => {
                                const classInfo = getClass(day, hour);
                                // Check if next slot has the same class to determine bottom border/radius
                                const nextHour = HOURS[hourIndex + 1];
                                const nextClass = nextHour ? getClass(day, nextHour) : null;
                                const isContinues = nextClass && nextClass.subject === classInfo?.subject;

                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        className="h-[60px] border-t border-peach-100 p-0 relative group"
                                    >
                                        {classInfo ? (
                                            <div
                                                onClick={() => setEditingItem({
                                                    subjectName: classInfo.subject,
                                                    item: classInfo.rawItem
                                                })}
                                                className={`w-full text-xs flex flex-col justify-center shadow-sm relative z-10 transition-transform hover:scale-[1.02] cursor-pointer
                                                    ${classInfo.isStart ? 'rounded-t-lg pt-2' : 'pt-0'}
                                                    ${!isContinues ? 'rounded-b-lg pb-2' : 'pb-0'}
                                                `}
                                                style={{
                                                    backgroundColor: classInfo.color || '#F7CDBC',
                                                    height: 'calc(100% + 1px)', // Slight overlap to cover borders
                                                    marginTop: '-1px',
                                                }}
                                            >
                                                {classInfo.isStart && (
                                                    <div className="px-2">
                                                        <span className="font-bold text-peach-900 line-clamp-1">{classInfo.subject}</span>
                                                        <span className="text-peach-800 opacity-80">{classInfo.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setSelectedSlot({ day, time: hour })}
                                                className="h-full w-full rounded-lg hover:bg-peach-50 transition-colors cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="text-peach-300 text-lg">+</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
