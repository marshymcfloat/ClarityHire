"use client";

import { SessionProvider } from "next-auth/react";

const NextSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextSessionProvider;
