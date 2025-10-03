"use client";

import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Button } from "../ui/button";
import { LoaderCircle, LogIn, LogOut, Settings, Users } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion"; // Note: The original code used "motion/react", the common import is "framer-motion"
import RegisterCompanyClient from "./RegisterCompanyClient";
import { UserRoleEnum } from "@prisma/client/edge";
import LoginDialog from "../auth/LoginDialog";
import { useParams, useSearchParams } from "next/navigation";

type SessionType = ReturnType<typeof useSession>;

const UserInfoButton = () => {
  const session = useSession();
  const [showDetails, setShowDetails] = useState(false);
  const [showRegisterClient, setShowRegisterClient] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logOutClicked, setLogOutClicked] = useState(false);
  const { companyName } = useParams();

  const middlewareShowLogin = useSearchParams().get("showLogin");

  const shouldShowLogin = !!(showLogin || middlewareShowLogin);

  const handleLogout = async () => {
    setLogOutClicked(true);
    await signOut({ callbackUrl: `/${companyName}/available-jobs` });
    setLogOutClicked(false);
  };

  const userRoles: UserRoleEnum[] = session.data?.user.role || [];

  function handleSwitchingRole() {
    if (userRoles.includes("RECRUITER")) {
      console.log("Already a recruiter, handle navigation or UI change here");
    } else {
      setShowRegisterClient(true);
    }
    setShowDetails(false);
  }

  if (session.status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <>
        <LoginDialog open={shouldShowLogin} onOpenChange={setShowLogin} />
        <Button onClick={() => setShowLogin(true)}>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </>
    );
  }

  if (session.status === "authenticated") {
    return (
      <>
        {showRegisterClient && <RegisterCompanyClient />}
        <div
          className="relative flex cursor-pointer items-center gap-4"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {session.data.user.image ? (
            <Image
              width={40}
              height={40}
              src={session.data.user.image}
              className="rounded-full"
              alt="user icon"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 font-bold">
              {session.data.user.username?.charAt(0).toUpperCase() ||
                session.data.user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="truncate text-sm font-medium">
            {session.data.user.name ||
              session.data.user.username ||
              session.data.user.email}
          </h1>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute bottom-full left-0 mb-2 w-52 origin-bottom-left rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                <ul className="flex flex-col">
                  <li>
                    <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent transition-colors">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSwitchingRole}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Switch Role</span>
                    </button>
                  </li>
                  {/* Divider */}
                  <div className="my-1 h-px bg-muted" />
                  <li>
                    <button
                      onClick={handleLogout}
                      disabled={logOutClicked}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm text-red-500 hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {logOutClicked ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }

  return null; // Should not be reached
};

export default UserInfoButton;
