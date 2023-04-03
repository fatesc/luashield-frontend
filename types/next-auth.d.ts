import NextAuth, { DefaultSession } from "next-auth";
import { Buyer, User } from "./types";
import { Result } from "./types.temp";

 

declare module "next-auth" {
    interface Session {
        user: Buyer
    }

    interface User {
        role: "admin" | "basic"
        active: boolean
    }
};

