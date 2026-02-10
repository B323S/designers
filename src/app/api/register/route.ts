import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Faltan datos requeridos (nombre, email, contraseña)" },
                { status: 400 }
            );
        }

        if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
            return NextResponse.json(
                { message: "Los campos no pueden estar vacíos" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Este correo electrónico ya está registrado" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { 
                message: "Usuario creado exitosamente",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Error al crear la cuenta. Intenta de nuevo más tarde." },
            { status: 500 }
        );
    }
}
