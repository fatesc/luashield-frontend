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
            id: "email-password",
            name: "Luasheild Authentication",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
                const { email, password } = credentials as { email: string, password: string };
                const response = await fetch("https://randomuser.me/api/", {
                    method: "GET",
                    // body: JSON.stringify({ email, password }),
                    // headers: {
                    //     "Content-Type": "application/json"
                    // }
                });
                const user = await response.json();
                
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