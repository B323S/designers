export type GradeGroup = {
    id: string;
    name: string; // e.g., "Partial 1", "Final Project"
    weight: number; // Percentage (0-100)
    grades: { id: string; name: string; value: number; weight: number }[]; // value is 0-5 or 0-10 or 0-100, assuming 0-5 based on context or user preference. Let's genericize.
};

export type KanbanColumn = {
    id: string;
    title: string;
    order: number;
};

export type KanbanTask = {
    id: string;
    title: string;
    statusId: string; // matches KanbanColumn id
    description?: string;
};

export type Material = {
    id: string;
    name: string;
    cost: number;
    imageUrl?: string;
};

export type ScheduleItem = {
    day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
    startTime: string; // "08:00"
    endTime: string; // "10:00"
    type: 'Teoría' | 'Práctica' | 'Taller';
    roomId?: string;
};

export type Subject = {
    id: string;
    name: string;
    color: string; // Hex code for custom accent
    schedule: ScheduleItem[];
    gradeGroups: GradeGroup[];
    materials: Material[];
    kanbanColumns: KanbanColumn[];
    kanbanTasks: KanbanTask[];
    moodboardImages: { id: string; url: string; note?: string }[];
    fileLinks: { id: string; name: string; url: string }[];
    processNotes: string; // HTML or Markdown
};

export type DirectLink = {
    id: string;
    title: string;
    url: string;
};

export type AppState = {
    userName: string;
    gradingScale: '0-5' | '0-10' | '0-100';
    subjects: Subject[];
    directLinks: DirectLink[];
    // Actions
    setGradingScale: (scale: '0-5' | '0-10' | '0-100') => void;
    addSubject: (subject: Subject) => void;
    updateSubject: (id: string, updates: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;
    addDirectLink: (link: DirectLink) => void;
    removeDirectLink: (id: string) => void;
    setUserName: (name: string) => void;
};
