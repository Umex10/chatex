"use client"

import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

const navItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Search", url: "#", icon: Search },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Messages", url: "#", icon: Mail },
  { title: "Account", url: "#", icon: User },
  { title: "More", url: "#", icon: MoreHorizontal },
]

export function AppSidebar() {

  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile();

  return (
    <header>
          <Sidebar collapsible="icon">
        <SidebarHeader className="p-4"
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}>
          <div className="flex items-center gap-2">
            <Image
                src="/chatex4.png"
                  width={50}
                  height={70}
                  alt="Chatex Logo"
                  className="w-10 h-10"
            />
            <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">
              Chatex
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="py-6">
                      <a href={item.url}>
                        <item.icon className="w-6 h-6" />
                        <span className="text-lg">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <SidebarMenuButton className="py-8" tooltip="Profil">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Dein Name</span>
                <span className="text-xs text-gray-500">@username</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </header>
      

  )
}