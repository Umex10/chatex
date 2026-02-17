"use client"

import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  PencilLine
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
import { cn } from "@/lib/utils"
import { CreateShout } from "./CreateShout"

const navItems = [
  { title: "Home", href: "/home", icon: Home },
  { title: "Search", href: "#", icon: Search },
  { title: "Notifications", href: "#", icon: Bell },
  { title: "Messages", href: "#", icon: Mail },
  { title: "Account", href: "#", icon: User },
  { title: "More", href: "#", icon: MoreHorizontal },
]

export function AppSidebar() {

  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile();

  const path = "";

  return (
    <header>
      <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:bg-transparent">
        <SidebarHeader className="p-4"
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}>
          <div className="flex gap-2 items-center">
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
              <SidebarMenu className="gap-0">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="h-12 px-2 py-8 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!py-8 group-data-[collapsible=icon]:!w-12"
                    >
                      <a href={item.href}>
                        <item.icon
                          className={cn(
                            "transition-all",
                            path === item.href ? "text-foreground" : "text-muted-foreground"
                          )}
                          strokeWidth={path === item.href ? 2.5 : 2}
                        />
                        <span className={`text-xl ${path === item.href ? "text-foreground" : "text-muted-foreground"}`}>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <CreateShout>
                    <SidebarMenuButton className="h-12 px-2 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 
                    bg-violet-500 text-white rounded-full [&>svg]:!size-7">
                      <PencilLine className="w-6 h-6 group-[:not([data-collapsible=icon])]:hidden " />
                      <span className="w-full text-xl  font-bold
                      group-data-[collapsible=icon]:hidden group-[:not([data-collapsible=icon])]:text-center">Shout</span>
                    </SidebarMenuButton>
                  </CreateShout>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="h-14 px-2 group-data-[collapsible=icon]:!h-14 group-data-[collapsible=icon]:!w-14"
                tooltip="Account"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 flex items-center justify-center"></div>

                <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                  <span className="text-lg font-medium truncate w-full">Dein Name</span>
                  <span className="text-base text-gray-500 truncate w-full">@username</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </header>


  )
}