import { create } from 'zustand';
import { AppState, Subject, DirectLink } from '@/types';

interface StoreState extends AppState {
    fetchData: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    userName: '',
    gradingScale: '0-5',
    subjects: [],
    directLinks: [],

    setUserName: (name) => set({ userName: name }),
    setGradingScale: (scale) => set({ gradingScale: scale }),

    fetchData: async () => {
        try {
            const res = await fetch('/api/subjects');
            if (res.ok) {
                const data = await res.json();
                set({ subjects: data });
            }
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    },

    addSubject: async (subject) => {
        try {
            const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subject),
            });
            if (res.ok) {
                const newSubject = await res.json();
                set((state) => ({ subjects: [...state.subjects, newSubject] }));
            }
        } catch (error) {
            console.error('Failed to add subject:', error);
        }
    },

    updateSubject: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            subjects: state.subjects.map((sub) =>
                sub.id === id ? { ...sub, ...updates } : sub
            ),
        }));

        // TODO: Implement API Endpoint for PUT/PATCH if needed
    },

    deleteSubject: async (id) => {
        // Optimistic delete
        set((state) => ({
            subjects: state.subjects.filter((sub) => sub.id !== id),
        }));

        // TODO: Implement API Endpoint for DELETE if needed
    },

    addDirectLink: (link) =>
        set((state) => ({ directLinks: [...state.directLinks, link] })),

    removeDirectLink: (id) =>
        set((state) => ({
            directLinks: state.directLinks.filter((link) => link.id !== id),
        })),
}));

