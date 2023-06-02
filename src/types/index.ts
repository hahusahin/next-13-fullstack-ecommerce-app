import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "hashedPassword" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};
