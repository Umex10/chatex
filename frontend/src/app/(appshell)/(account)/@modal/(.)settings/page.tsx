"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import SettingsForm from "@/components/profile/SettingsForm"

/**
 * Intercepted settings modal.
 * Shown instead of the full settings page during client-side navigation to /settings,
 * so the underlying account page remains visible in the background.
 */
export default function SettingsModal() {
  const router = useRouter()

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent 
        className="h-full w-full max-w-none sm:max-w-[600px] sm:h-auto p-0 bg-black border-none sm:border-zinc-800 rounded-none sm:rounded-2xl overflow-y-auto"
      >
        {/* Needed, otherwise an error would be thrown */}
        <VisuallyHidden>
          <DialogTitle>Account Settings</DialogTitle>
        </VisuallyHidden>
        
        <SettingsForm />
      </DialogContent>
    </Dialog>
  )
}