"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres");
                setIsLoading(false);
                return;
            }

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.message || "Error al registrarse");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Error al registrarse. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-peach-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-peach-100">
                <div className="p-8 text-center bg-peach-100/30">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-peach-500 text-white mb-4 shadow-md transform -rotate-3">
                        <Sparkles className="size-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-peach-900">Únete a DesignersBox</h1>
                    <p className="text-peach-600 mt-2">Empieza a organizar tu creatividad</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-peach-700 ml-1">Nombre</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 focus:border-transparent transition-all bg-peach-50/30 disabled:opacity-50"
                                placeholder="Tu Nombre"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-peach-700 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 focus:border-transparent transition-all bg-peach-50/30 disabled:opacity-50"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-peach-700 ml-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-400 focus:border-transparent transition-all bg-peach-50/30 disabled:opacity-50"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-peach-500">Mínimo 6 caracteres</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-peach-500 hover:bg-peach-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-peach-600">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-peach-800 font-bold hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
