"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Settings } from "lucide-react";

const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Horario", href: "/schedule" },
    { label: "Presupuesto", href: "/budget" },
    { label: "Enlaces", href: "/links" },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-peach-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="size-10 bg-peach-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                            D
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-peach-900 leading-none tracking-tight">Designers<span className="text-peach-500">Box</span></h1>
                            <span className="text-xs text-peach-400 tracking-widest uppercase font-semibold">Tu espacio creativo</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-lg font-medium transition-colors duration-200 relative group",
                                    pathname === item.href
                                        ? "text-peach-600"
                                        : "text-gray-500 hover:text-peach-500"
                                )}
                            >
                                {item.label}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-full h-0.5 bg-peach-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100",
                                    pathname === item.href && "scale-x-100"
                                )} />
                            </Link>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-4">
                        {status === "authenticated" ? (
                            <>
                                <span className="text-sm text-peach-700 font-medium hidden md:block">
                                    Hola, {session.user?.name}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-peach-600 hover:text-peach-800 font-medium text-sm transition-colors"
                                >
                                    Salir
                                </button>
                                <Link
                                    href="/settings"
                                    className="bg-peach-500 hover:bg-peach-600 text-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <Settings className="size-4" />
                                    <span className="hidden sm:inline">Config</span>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-peach-600 hover:text-peach-800 font-bold px-4 py-2 transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-peach-500 hover:bg-peach-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
