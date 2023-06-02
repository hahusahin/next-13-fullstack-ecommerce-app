"use client";

import { FC, PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

const NextAuthSessionProvider: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
