"use client"

import React from 'react'
import Link from 'next/link'
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

/** Navigation items displayed in the bottom mobile nav bar. */
const navItems = [
  { icon: Home, href: "/home" },
  { icon: Search, href: "/search" },
  { icon: Bell, href: "/notifications" },
  { icon: Mail, href: "/messages" },
  { icon: User, href: "/account" },
]

/**
 * Bottom navigation bar component for mobile screens.
 * Renders icon-only navigation links for the main app sections.
 */
const NavMenu = () => {

  const path = "";

  return (
    <NavigationMenu className="justify-center w-full max-w-full">
      <NavigationMenuList className="flex justify-around items-center w-screen list-none">
        {navItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className={cn(
                  `flex flex-col items-center justify-center transition-colors 
                    hover:text-violet focus:text-violet px-4 py-4`
                )}
              >
                <item.icon
                  className={cn(
                    "w-7 h-7 transition-all",
                    path === item.href ? "text-foreground" : "text-muted-foreground"
                  )}
                  strokeWidth={path === item.href ? 2.5 : 2}
                />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavMenu