import { UserRole } from "@prisma/client";

export class JWTPayloadType {
    id: number;
    email: string;
    role: UserRole;
    active:  boolean | null;
}