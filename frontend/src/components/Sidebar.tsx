"use client"

import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  PencilLine,
  LogOut,
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

import { SignOutMenu } from "./SignOutMenu"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CreateShout } from "./CreateShout"
import { usePathname, useRouter } from "next/navigation"
import { CldImage } from 'next-cloudinary';
import { useGetUserQuery } from "@redux/api/apiSlice"
import { signOutRequest } from "@/actions/auth-account-actions"
import { toast } from "sonner"
import { Button } from "./ui/button"
import Link from "next/link"



/**
 * Main application sidebar component.
 * On desktop it renders a collapsible icon/text sidebar with navigation links,
 * a "Shout" compose button, and a footer with the user avatar and sign-out menu.
 * On mobile it renders expanded as a slide-in drawer showing the user profile summary
 * with a quick sign-out button.
 */
export function AppSidebar() {

  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile();

  const router = useRouter();
  const path = usePathname();
  const { data: user, isLoading } = useGetUserQuery(undefined);

  const navItems = [
    { title: "Home", href: "/home", icon: Home },
    { title: "Search", href: "#", icon: Search },
    { title: "Notifications", href: "#", icon: Bell },
    { title: "Messages", href: "#", icon: Mail },
    { title: "Account", href: `/${user?.username}`, icon: User },
    { title: "More", href: "#", icon: MoreHorizontal },
  ]

  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg";
  const name = user?.name ? user?.name : "Was seite";
  const username = user?.username ? user?.username : "@wasSeite10";
  const followersCount = user?.followersCount ? user?.followersCount : 0;
  const followingCount = user?.followingCount ? user?.followingCount : 0;

  /**
   * Signs the current user out by calling the server action, showing a toast,
   * and redirecting to the landing page.
   */
  function handleSignOut() {
    const toastId = toast.loading("Signing out...");
    signOutRequest();

    toast.success("Successfully signed you out!", { id: toastId });

    router.push("/");
  }

  return (
    <header>
      <Sidebar collapsible="icon" className="[&>[data-sidebar=sidebar]]:bg-transparent">
        <SidebarHeader className="p-4"
          onClick={() => {
            if (isMobile) {
              toggleSidebar();
            }
          }}>
          {/* md screens */}
          <div className='p-0 m-0 hidden md:flex justify-start
            items-center gap-2'>
            <Image
              src="/chatex4.png"
              width={50}
              height={70}
              alt="Chatex Logo"
              className="w-14 h-14"
            />
            <h2 className="font-bold text-xl">Chatex</h2>
          </div>

          <div className="flex flex-row items-start">
            <div className="flex-1 flex flex-col items-start md:flex-row gap-2">

              {/* mobile screens */}
              <div className="md:hidden w-14 h-14 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
                <CldImage
                  width="56"
                  height="56"
                  src={avatar}
                  alt="User Avatar"
                  crop="thumb"
                  gravity="face"
                  format="auto"
                  quality="auto"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className='md:hidden flex-1 flex flex-col justify-center gap-2'>
                <div>
                  <h2 className='text-xl font-bold'>{name}</h2>
                  <h3 className='text-base'>@{username}</h3>
                </div>

                <div className='flex flex-row gap-4'>
                  <h4 className='flex gap-1'>
                    <span className='font-bold'>{followingCount}</span>
                    <span className='opacity-50'>Following</span>
                  </h4>

                  <h5 className='flex gap-1'>
                    <span className='font-bold'>{followersCount}</span>
                    <span className='opacity-50'>Follower</span>
                  </h5>
                </div>
              </div>
            </div>
            <div className="pt-2.5">
              <Button
                onClick={handleSignOut}
                className="md:hidden bg-red-500 rounded-full"
              >
                <LogOut className="w-8 h-8" />
              </Button>
            </div>

          </div>

        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title} onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="h-12 px-2 py-8 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!py-8 group-data-[collapsible=icon]:!w-12"
                    >
                      <Link href={item.href}
                        onClick={(e) => {
                          if (`${path}` === item.href) {
                            e.preventDefault();
                          }
                        }}>
                        <item.icon
                          className={cn(
                            "transition-all",
                            path === item.href ? "text-foreground" : "text-muted-foreground"
                          )}
                          strokeWidth={path === item.href ? 2.5 : 2}
                        />
                        <span className={`text-xl ${path === item.href ? "text-foreground" : "text-muted-foreground"}`}>{item.title}</span>
                      </Link>
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
              <SignOutMenu onSignOut={handleSignOut}>
                <SidebarMenuButton
                  size="lg"
                  className="hidden md:flex h-14 px-2 group-data-[collapsible=icon]:!h-14 group-data-[collapsible=icon]:!w-14"
                  tooltip="Account"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                    <CldImage
                      width="56"
                      height="56"
                      src={user?.avatar || "user-avatar_yr4qhg"}
                      alt="User Avatar"
                      crop="thumb"
                      gravity="face"
                      format="auto"
                      quality="auto"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-lg font-medium truncate w-full">
                      {user?.name ?? "Load..."}
                    </span>
                    <span className="text-base text-gray-500 truncate w-full">
                      {user?.username ? `@${user.username}` : "@..."}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SignOutMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </header>
  )
}