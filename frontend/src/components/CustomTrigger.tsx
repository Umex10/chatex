import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "./ui/button"

export const CustomTrigger = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button onClick={toggleSidebar} className="p-2">
      <Image
        src="/next.svg"
        width={32}
        height={32}
        alt="Chatex Logo"
        className="rounded-full"
      />
    </Button>
  )
}