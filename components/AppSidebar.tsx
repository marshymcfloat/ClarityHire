"use client";

import {
  Briefcase,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserInfoButton from "./dashboard/UserInfoButton";
import { Company } from "@prisma/client/edge";

export function AppSidebar({ company }: { company: Company }) {
  const session = useSession();

  const items = [
    {
      title: "Available Jobs",
      url: ``,
      icon: Briefcase,
    },
    {
      title: "Job Applications",
      url: `/${session.data?.user.id}/job-applications`,
      icon: Home,
    },

    {
      title: "Inbox",
      url: "",
      icon: Inbox,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="capitalize font-medium">
          {company.name}
        </SidebarHeader>

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
        <UserInfoButton />
      </SidebarFooter>
    </Sidebar>
  );
}
