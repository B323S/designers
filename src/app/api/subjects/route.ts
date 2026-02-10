import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const subjects = await prisma.subject.findMany({
            where: { userId: session.user.id },
        });

        // Parse JSON fields
        const parsedSubjects = subjects.map(sub => ({
            ...sub,
            gradeGroups: JSON.parse(sub.gradeGroups),
            materials: JSON.parse(sub.materials),
            kanbanColumns: JSON.parse(sub.kanbanColumns),
            kanbanTasks: JSON.parse(sub.kanbanTasks),
            moodboardImages: JSON.parse(sub.moodboardImages),
            fileLinks: JSON.parse(sub.fileLinks),
            schedule: JSON.parse(sub.schedule),
        }));

        return NextResponse.json(parsedSubjects);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching subjects" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, name, color, gradeGroups, materials, kanbanColumns, kanbanTasks, moodboardImages, fileLinks, schedule, processNotes } = body;

        const newSubject = await prisma.subject.create({
            data: {
                id, // Optional: if client provides ID
                name,
                color,
                gradeGroups: JSON.stringify(gradeGroups || []),
                materials: JSON.stringify(materials || []),
                kanbanColumns: JSON.stringify(kanbanColumns || []),
                kanbanTasks: JSON.stringify(kanbanTasks || []),
                moodboardImages: JSON.stringify(moodboardImages || []),
                fileLinks: JSON.stringify(fileLinks || []),
                schedule: JSON.stringify(schedule || []),
                processNotes: processNotes || "",
                userId: session.user.id,
            },
        });

        return NextResponse.json(newSubject);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating subject" }, { status: 500 });
    }
}
