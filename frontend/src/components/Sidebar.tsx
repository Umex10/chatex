"use client"

import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  Settings,
  MoreHorizontal
} from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  { title: "Home", url: "#", icon: Home },
  { title: "Explore", url: "#", icon: Search },
  { title: "Notifications", url: "#", icon: Bell },
  { title: "Messages", url: "#", icon: Mail },
  { title: "Profile", url: "#", icon: User },
  { title: "More", url: "#", icon: MoreHorizontal },
]

export function AppSidebar() {

  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile();

  return (
    <header>
          <Sidebar collapsible="offcanvas">
        <SidebarHeader className="p-4"
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}>
          <span className="font-bold text-xl">Chatex</span>
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
          <SidebarMenuButton className="py-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex flex-col">
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