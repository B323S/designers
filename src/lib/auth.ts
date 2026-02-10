import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    debug: process.env.NODE_ENV !== "production",
    logger: {
        error(code, ...metadata) {
            console.error("NextAuth error:", code, metadata);
        },
        warn(code, ...metadata) {
            console.warn("NextAuth warn:", code, metadata);
        },
        debug(code, ...metadata) {
            console.debug("NextAuth debug:", code, metadata);
        },
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.id = token.sub || token.id || token?.user?.id;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id;
                token.id = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};
