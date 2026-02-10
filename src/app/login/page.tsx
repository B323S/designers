"use client";

import { useState, useEffect } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        getCsrfToken().then((t) => {
            if (mounted) setCsrfToken(t as string | null);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                csrfToken,
                redirect: false,
            });

            if (res?.error) {
                setError("Correo o contraseña incorrectos");
            } else if (res?.ok) {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Error al iniciar sesión. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-peach-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-peach-100">
                <div className="p-8 text-center bg-peach-100/30">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-peach-500 text-white mb-4 shadow-md transform rotate-3">
                        <LayoutGrid className="size-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-peach-900">Bienvenido de nuevo</h1>
                    <p className="text-peach-600 mt-2">Ingresa a tu espacio creativo</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

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
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-peach-500 hover:bg-peach-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Cargando..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-peach-600">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/register" className="text-peach-800 font-bold hover:underline">
                            Regístrate
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
