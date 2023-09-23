import { Order, Product, User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "hashedPassword" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeProduct = Omit<Product, "createdAt"> & {
  createdAt: string;
};

// export type SafeOrder = Omit<Order, "createdAt"> & {
//   createdAt: string;
// };
