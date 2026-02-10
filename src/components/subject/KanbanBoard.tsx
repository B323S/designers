"use client";

import { useStore } from "@/store/useStore";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Plus, MoreHorizontal, X, GripVertical, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import { KanbanColumn as IColumn, KanbanTask as ITask } from "@/types";

export function KanbanBoard() {
    const { id } = useParams();
    const { subjects, updateSubject } = useStore();
    const subject = subjects.find((s) => s.id === id);

    const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // 3px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!subject) return null;

    const columnsId = useMemo(() => subject.kanbanColumns.map((col) => col.id), [subject.kanbanColumns]);

    // Actions
    const addColumn = () => {
        const newCol: IColumn = {
            id: crypto.randomUUID(),
            title: `Nueva Columna`,
            order: subject.kanbanColumns.length
        };
        updateSubject(subject.id, { kanbanColumns: [...subject.kanbanColumns, newCol] });
    };

    const updateColumnTitle = (colId: string, title: string) => {
        const newCols = subject.kanbanColumns.map(c => c.id === colId ? { ...c, title } : c);
        updateSubject(subject.id, { kanbanColumns: newCols });
    };

    const deleteColumn = (colId: string) => {
        if (confirm("¿Eliminar columna y sus tareas?")) {
            // Also delete tasks in this column
            const newTasks = subject.kanbanTasks.filter(t => t.statusId !== colId);
            const newCols = subject.kanbanColumns.filter(c => c.id !== colId);
            updateSubject(subject.id, { kanbanColumns: newCols, kanbanTasks: newTasks });
        }
    };

    const addTask = (colId: string) => {
        const newTask: ITask = {
            id: crypto.randomUUID(),
            title: "Nueva Tarea",
            statusId: colId
        };
        updateSubject(subject.id, { kanbanTasks: [...subject.kanbanTasks, newTask] });
    };

    const updateTask = (taskId: string, updates: Partial<ITask>) => {
        const newTasks = subject.kanbanTasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
        updateSubject(subject.id, { kanbanTasks: newTasks });
    };

    const deleteTask = (taskId: string) => {
        updateSubject(subject.id, { kanbanTasks: subject.kanbanTasks.filter(t => t.id !== taskId) });
    };

    // DnD Handlers
    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Column Drag
        const isActiveColumn = active.data.current?.type === "Column";
        if (isActiveColumn) {
            const activeIndex = subject.kanbanColumns.findIndex(c => c.id === activeId);
            const overIndex = subject.kanbanColumns.findIndex(c => c.id === overId);
            if (activeIndex !== overIndex) {
                updateSubject(subject.id, {
                    kanbanColumns: arrayMove(subject.kanbanColumns, activeIndex, overIndex)
                });
            }
        }

        // Task Drag is handled in drag over mostly, but final drop needs check
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            const activeIndex = subject.kanbanTasks.findIndex((t) => t.id === activeId);
            const overIndex = subject.kanbanTasks.findIndex((t) => t.id === overId);

            if (subject.kanbanTasks[activeIndex].statusId !== subject.kanbanTasks[overIndex].statusId) {
                const newTasks = [...subject.kanbanTasks];
                newTasks[activeIndex].statusId = subject.kanbanTasks[overIndex].statusId;
                // We can also reorder here but simple status switch for now is enough for basic Kanban
                updateSubject(subject.id, { kanbanTasks: arrayMove(newTasks, activeIndex, overIndex) });
            } else {
                // Same column reorder
                updateSubject(subject.id, { kanbanTasks: arrayMove(subject.kanbanTasks, activeIndex, overIndex) });
            }
        }

        const isOverColumn = over.data.current?.type === "Column";
        // Dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            const activeIndex = subject.kanbanTasks.findIndex((t) => t.id === activeId);
            if (subject.kanbanTasks[activeIndex].statusId !== overId) {
                const newTasks = [...subject.kanbanTasks];
                newTasks[activeIndex].statusId = String(overId);
                updateSubject(subject.id, { kanbanTasks: arrayMove(newTasks, activeIndex, activeIndex) }); // Just update status
            }
        }
    };

    return (
        <div className="h-full min-h-[500px] flex flex-col">
            <div className="mb-4">
                <button onClick={addColumn} className="text-sm bg-peach-200 text-peach-900 px-3 py-1 rounded-lg hover:bg-peach-300 transition-colors">
                    + Añadir Columna
                </button>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                    <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                        {subject.kanbanColumns.map((col) => (
                            <ColumnContainer
                                key={col.id}
                                column={col}
                                tasks={subject.kanbanTasks.filter(t => t.statusId === col.id)}
                                updateTitle={updateColumnTitle}
                                deleteColumn={deleteColumn}
                                addTask={addTask}
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                            />
                        ))}
                    </SortableContext>
                </div>

                {typeof document !== 'undefined' && createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                tasks={subject.kanbanTasks.filter(t => t.statusId === activeColumn.id)}
                                updateTitle={() => { }}
                                deleteColumn={() => { }}
                                addTask={() => { }}
                                updateTask={() => { }}
                                deleteTask={() => { }}
                            />
                        )}
                        {activeTask && (
                            <TaskCard task={activeTask} deleteTask={() => { }} updateTask={() => { }} />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}

function ColumnContainer({ column, tasks, updateTitle, deleteColumn, addTask, deleteTask, updateTask }: any) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: { type: "Column", column },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const tasksIds = useMemo(() => tasks.map((t: any) => t.id), [tasks]);

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-[300px] h-[400px] rounded-xl bg-peach-100/50 border-2 border-dashed border-peach-300 opacity-60 flex-shrink-0"
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-[300px] bg-peach-50/80 rounded-xl border border-peach-200 flex flex-col flex-shrink-0 max-h-[600px]"
        >
            <div
                {...attributes}
                {...listeners}
                className="p-3 bg-peach-100 rounded-t-xl border-b border-peach-200 flex items-center justify-between cursor-grab active:cursor-grabbing"
            >
                <div className="flex-1 font-bold text-peach-900 flex gap-2">
                    <input
                        value={column.title}
                        onChange={(e) => updateTitle(column.id, e.target.value)}
                        className="bg-transparent focus:outline-none focus:bg-white/50 rounded w-full"
                    />
                </div>
                <button onClick={() => deleteColumn(column.id)} className="text-peach-400 hover:text-red-400">
                    <Trash2 className="size-4" />
                </button>
            </div>

            <div className="flex-1 p-2 overflow-y-auto min-h-[100px] space-y-2 custom-scrollbar">
                <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task: any) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                    ))}
                </SortableContext>
            </div>

            <button
                onClick={() => addTask(column.id)}
                className="m-2 p-2 flex items-center gap-2 text-peach-600 hover:bg-peach-100 rounded-lg transition-colors text-sm font-medium"
            >
                <Plus className="size-4" /> Añadir Tarea
            </button>
        </div>
    );
}

function TaskCard({ task, deleteTask, updateTask }: any) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: "Task", task },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-white/80 p-3 rounded-lg shadow-sm border border-peach-200 h-[80px] opacity-50 relative"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white p-3 rounded-lg shadow-sm border border-peach-100 hover:border-peach-300 group relative text-sm"
        >
            <div {...attributes} {...listeners} className="absolute top-2 right-2 cursor-grab text-peach-300 opacity-0 group-hover:opacity-100">
                <GripVertical className="size-4" />
            </div>

            <textarea
                className="w-full bg-transparent resize-none focus:outline-none font-medium text-peach-900 pr-5"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                rows={2}
            />

            <button
                onClick={() => deleteTask(task.id)}
                className="absolute bottom-2 right-2 text-peach-300 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X className="size-3" />
            </button>
        </div>
    );
}
