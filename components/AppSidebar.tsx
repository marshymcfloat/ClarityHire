"use client";

import {
  Calendar,
  Home,
  Inbox,
  LoaderCircle,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar() {
  const session = useSession();

  const [logOutClicked, setLogOutClicked] = useState(false);

  session;
  const items = [
    {
      title: "Home",
      url: `/${session.data?.user.id}/dashboard`,
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    setLogOutClicked(true);
    await signOut();
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {session.status === "loading" && (
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        )}

        {session.status === "authenticated" && (
          <div className="flex items-center gap-4">
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
      </SidebarFooter>
    </Sidebar>
  );
}
