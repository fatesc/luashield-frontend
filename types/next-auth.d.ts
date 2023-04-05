import NextAuth, { DefaultSession } from "next-auth";
import { Buyer, User } from "./types";
import { Result } from "./types.temp";

 

declare module "next-auth" {
    interface Session {
        user: Buyer
    }

    interface User extends Buyer {
        // role: "admin" | "basic";
    }

    interface JWT {
        user: Buyer
    }
    interface DefaultJWT {
        user: BUyer
    }
};

