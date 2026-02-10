"use client";

import { ScheduleWidget } from "@/components/dashboard/ScheduleWidget";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SchedulePage() {
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
        <div className="max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-peach-900">Horario Semanal</h1>
                <p className="text-peach-600">Visualiza y organiza tus clases.</p>
            </header>

            <div className="max-w-5xl mx-auto">
                <ScheduleWidget />
            </div>
        </div>
    );
}
