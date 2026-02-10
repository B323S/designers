"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function GuestTaskCard() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-peach-100 max-w-md mx-auto relative z-10 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
                <div className="absolute -top-6 -left-6 size-12 bg-peach-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce" />
                <h3 className="text-2xl font-bold text-peach-900 mb-2">¿Nueva tarea?</h3>
                <p className="text-peach-600 mb-6">Organiza rápidamente tus pendientes para hoy.</p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título de la tarea..."
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-peach-50 border border-peach-200 placeholder:text-peach-300 transition-all font-medium text-peach-400"
                    />

                    <select disabled className="w-full px-4 py-3 rounded-xl bg-peach-50 border border-peach-200 text-peach-400 font-medium appearance-none">
                        <option>Seleccionar Materia...</option>
                    </select>

                    <div className="flex gap-3">
                        <Link href="/register" className="flex-1 py-3 bg-peach-500 text-white font-bold rounded-xl shadow-lg text-center">
                            Regístrate
                        </Link>
                        <Link href="/login" className="flex-1 py-3 border border-peach-300 text-peach-600 font-bold rounded-xl text-center bg-white">
                            Entrar
                        </Link>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-peach-400 text-sm font-semibold justify-center">
                        <span>Tareas pendientes: </span>
                        <span className="text-peach-600 text-lg">12</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-peach-100 max-w-md mx-auto relative z-10 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
            <div className="absolute -top-6 -left-6 size-12 bg-peach-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce" />
            <h3 className="text-2xl font-bold text-peach-900 mb-2">¿Nueva tarea?</h3>
            <p className="text-peach-600 mb-6">Organiza rápidamente tus pendientes para hoy.</p>

            <form className="space-y-4">
                <input
                    type="text"
                    placeholder="Título de la tarea..."
                    className="w-full px-4 py-3 rounded-xl bg-peach-50 border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 placeholder:text-peach-300 transition-all font-medium text-peach-800"
                />
                <select className="w-full px-4 py-3 rounded-xl bg-peach-50 border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 text-peach-800 font-medium appearance-none">
                    <option>Seleccionar Materia...</option>
                </select>
                <button className="w-full py-3 bg-peach-500 text-white font-bold rounded-xl shadow-lg hover:bg-peach-600 transform hover:-translate-y-1 transition-all">
                    Guardar Tarea
                </button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-peach-400 text-sm font-semibold justify-center">
                <span>Tareas pendientes: </span>
                <span className="text-peach-600 text-lg">12</span>
            </div>
        </div>
    );
}
