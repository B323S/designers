"use client";

import { useStore } from "@/store/useStore";
import { Settings, Check } from "lucide-react";

export default function SettingsPage() {
    const { gradingScale, setGradingScale, userName, setUserName } = useStore();

    const scales = [
        { id: '0-5', label: 'Escala 0.0 - 5.0' },
        { id: '0-10', label: 'Escala 0.0 - 10.0' },
        { id: '0-100', label: 'Escala 0 - 100' },
    ];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-peach-900 flex items-center gap-3">
                    <Settings className="size-8 text-peach-500" />
                    Configuración
                </h1>
            </header>

            <div className="max-w-2xl space-y-8">
                {/* User Profile Section */}
                <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-peach-800 mb-4">Perfil</h2>
                    <div>
                        <label className="block text-sm font-medium text-peach-700 mb-2">Tu Nombre</label>
                        <input
                            className="w-full px-4 py-2 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grading Scale Section */}
                <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-peach-800 mb-4">Sistema de Calificación</h2>
                    <p className="text-peach-600 mb-6">Elige la escala de notas que usa tu universidad o colegio.</p>

                    <div className="space-y-3">
                        {scales.map((scale) => (
                            <button
                                key={scale.id}
                                onClick={() => setGradingScale(scale.id as any)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${gradingScale === scale.id
                                    ? 'bg-peach-100 border-peach-400 shadow-sm'
                                    : 'bg-white border-peach-100 hover:bg-peach-50'
                                    }`}
                            >
                                <span className={`font-medium ${gradingScale === scale.id ? 'text-peach-900' : 'text-peach-600'}`}>
                                    {scale.label}
                                </span>
                                {gradingScale === scale.id && (
                                    <div className="size-6 bg-peach-500 rounded-full flex items-center justify-center text-white">
                                        <Check className="size-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
