import { Branch, User, UserRoleAssigned } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface user {
        id: number;
        name: string;
        email: string;
        branchId: number;
        verified: boolean;
        branch : Branch;
        roles : UserRoleAssigned[];
        deleted: boolean;
    }

    interface Session extends DefaultSession {
        user: user;
    }

    declare module "next-auth/jwt" {
        interface JWT {
            user : user
        }
    }
}
