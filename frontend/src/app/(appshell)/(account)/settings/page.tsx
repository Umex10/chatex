"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import SettingsForm from "@/components/SettingsForm"
import { useGetUserQuery } from "@redux/api/apiSlice"
import AccountPage from "../[username]/page"

/**
 * Rendered on hard refresh / direct navigation to /settings.
 * Intercepting routes only fire on client-side navigation, so this page
 * is responsible for showing the same "dialog over account background" UI
 * that @modal/(.)settings/page.tsx provides during soft navigation.
 */
export default function SettingsPage() {
  const router = useRouter()
  const { data: me } = useGetUserQuery(undefined)

  // Build a resolved Promise<{ username }> that AccountPage expects as `params`
  const params = Promise.resolve({ username: me?.username ?? "" })

  return (
    <>
      {/* Account page — visible behind the dialog */}
      {me && <AccountPage params={params} />}

      {/* Settings Dialog */}
      <Dialog open={true} onOpenChange={() => router.push(`/${me?.username ?? ""}`)}>
        <DialogContent
          className="h-full w-full max-w-none sm:max-w-[600px] sm:h-auto p-0 bg-black border-none sm:border-zinc-800 rounded-none sm:rounded-2xl overflow-y-auto"
        >
          <VisuallyHidden>
            <DialogTitle>Account Settings</DialogTitle>
          </VisuallyHidden>
          <SettingsForm />
        </DialogContent>
      </Dialog>
    </>
  )
}