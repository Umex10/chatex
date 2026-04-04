"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useGetUserQuery } from "@redux/api/apis/userApi"

/**
 * Bottom navigation bar component for mobile screens.
 * Renders icon-only navigation links for the main app sections.
 */
const NavMenu = () => {

  const path = usePathname();
  const { data: user } = useGetUserQuery(undefined);

  /** Navigation items displayed in the bottom mobile nav bar. */
  const navItems = [
    { icon: Home, href: "/home", keyUrl: "/home" },
    { icon: Search, href: "/search", keyUrl: "/search" },
    { icon: Mail, href: "/chat/messages", keyUrl: "/chat" },
    { icon: User, href: `/${user?.username}`, keyUrl: `/${user?.username}` },
  ]

  return (
    <NavigationMenu className="justify-center w-full max-w-full">
      <NavigationMenuList className="flex justify-around items-center w-screen list-none">
        {/* Navigation Items */}
        {navItems.map((item, index) => {
          const isActive = path.includes(item.keyUrl);
          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    `flex flex-col items-center justify-center transition-colors 
                    hover:text-violet focus:text-violet px-4 py-4`
                  )}
                  onClick={(e) => {
                    if (isActive) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      "w-7 h-7 transition-all",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavMenu