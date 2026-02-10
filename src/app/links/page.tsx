"use client";

import { LinksWidget } from "@/components/dashboard/LinksWidget";
import { UnitConverter } from "@/components/tools/UnitConverter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LinksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/register");
        }
    }, [status, router]);

    if (status !== "authenticated") {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-peach-900">Recursos y Herramientas</h1>
                <p className="text-peach-600">Directorio de proveedores, enlaces y utilidades de diseño.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LinksWidget />
                </div>
                <div>
                    <UnitConverter />
                </div>
            </div>
        </div>
    );
}
