"use client";

import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Button } from "../ui/button";
import { LoaderCircle, LogOut, Settings, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import RegisterCompanyClient from "./RegisterCompanyClient";
import { UserRoleEnum } from "@prisma/client/edge";

type SessionType = ReturnType<typeof useSession>;

const UserInfoButton = ({
  session,
  logOutClicked,
  handleLogout,
}: {
  logOutClicked: boolean;
  handleLogout: () => void;
  session: SessionType;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRegisterClient, setShowRegisterClient] = useState(false);

  const userRoles: UserRoleEnum[] = session.data?.user.role;

  function handleSwitchingRole() {
    if (userRoles.includes("RECRUITER")) {
      console.log("meow");
    } else {
      setShowRegisterClient(true);
    }
  }

  return (
    <>
      {showRegisterClient && <RegisterCompanyClient />}
      {session.status === "loading" && (
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      )}

      {session.status === "authenticated" && (
        <div
          className="flex items-center gap-4 relative"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          <AnimatePresence>
            {showDetails && (
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute bottom-full left-0 mb-2 w-52 origin-bottom-left rounded-md border bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <ul className="flex flex-col">
                  <li>
                    <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-left hover:bg-accent focus:outline-none focus:bg-accent transition-colors">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSwitchingRole}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-left hover:bg-accent focus:outline-none focus:bg-accent transition-colors"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Switch Role</span>
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          {session.data.user.image ? (
            <Image
              width={40}
              height={40}
              src={session.data.user.image}
              className="rounded-full"
              alt="user icon"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300  font-bold">
              {session.data.user.username?.charAt(0).toUpperCase() ||
                session.data.user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="truncate text-sm font-medium">
            {session.data.user.name ||
              session.data.user.username ||
              session.data.user.email}
          </h1>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleLogout}
        disabled={logOutClicked || session.status !== "authenticated"}
      >
        {logOutClicked && <LoaderCircle className="mr-2 animate-spin" />}
        <LogOut className="mr-2" /> Logout
      </Button>
    </>
  );
};

export default UserInfoButton;
