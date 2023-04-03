import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 24 * 60 * 60
    },

    providers: [
        CredentialsProvider({
            id: "username-password",
            name: "Luasheild Authentication",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                const { username, password } = credentials as { username: string, password: string };
                const response = await fetch("https://luashield.com/api/login", {
                    method: "POST",
                    body: JSON.stringify({ username, password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const user = await response.json();
                console.log(user);
                
                if (response.ok && user) {
                    return user;
                }
                throw new Error("Invalid Credentials");
            }
        })
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                if (user.email == "admin@example.com") {
                    user.role = "admin"
                }

                token.user = user
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = token.user as any
            return session;
        },
    }

}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);