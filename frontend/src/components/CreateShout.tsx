"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { Image as ImageIcon, MapPin, Smile, PencilLine, X } from "lucide-react"
import { useRef, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCreateShoutMutation, useGetUserQuery } from "@redux/api/apiSlice"
import { CldImage } from "next-cloudinary"
import { generateSecureUrl } from "@/utils/cloudinary"
import Spinner from "./Spinner"

const shoutSchema = z.object({
  text: z
    .string()
    .min(1, "Your shout cannot be empty.")
    .max(280, "Shouts are limited to 280 characters."),
  images: z.array(z.instanceof(File)).max(4, "You can add up to 4 images.").optional(),
})

type ShoutFormValues = z.infer<typeof shoutSchema>

/**
 * Standalone shout composer form — used both inline (home feed) and inside the dialog.
 * Handles image picking, Cloudinary uploads and posting via the API mutation.
 */
export function ShoutComposer({ onSubmitted }: { onSubmitted?: () => void }) {
  const { data: user } = useGetUserQuery(undefined)
  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg"
  const [createShout, { isLoading }] = useCreateShoutMutation()

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imageViews, setImageViews] = useState<string[]>([])

  const form = useForm<ShoutFormValues>({
    resolver: zodResolver(shoutSchema),
    mode: "onSubmit",
    defaultValues: { text: "", images: [] },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const current = form.getValues("images") ?? []
    const combined = [...current, ...files].slice(0, 4)
    form.setValue("images", combined, { shouldDirty: true, shouldValidate: true })
    setImageViews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 4))
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    const current = form.getValues("images") ?? []
    form.setValue("images", current.filter((_, i) => i !== index), { shouldDirty: true, shouldValidate: true })
    setImageViews(prev => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: ShoutFormValues) {
    const uploadedUrls: string[] = []
    for (const file of values.images ?? []) {
      const res = await generateSecureUrl(file)
      if (res.success) uploadedUrls.push(res.data.secure_url)
    }
    try {
      await createShout({ text: values.text, images: uploadedUrls }).unwrap()
    } catch (err) {
      console.error(err)
    }
    form.reset()
    setImageViews([])
    onSubmitted?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">

        {/* Loading Overlay */}
        {isLoading || form.formState.isSubmitting && (
          <div className="absolute z-50 inset-0 flex w-full items-center justify-center bg-transparent">
            <Spinner></Spinner>
          </div>
        )}

        <div className={`flex flex-row gap-3 ${isLoading ? "opacity-50" : ""}`}>

          {/* User Avatar */}
          <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
            <CldImage
              width="48"
              height="48"
              src={avatar}
              alt="User Avatar"
              crop="thumb"
              gravity="face"
              format="auto"
              quality="auto"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col flex-1 gap-1 items-start">
            {/* Text Input */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="What's new to you?"
                      className="placeholder:text-zinc-500 placeholder:text-lg text-lg max-h-[400px] min-h-[80px] resize-none border-none focus-visible:ring-0 p-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-semibold text-red-500" />
                </FormItem>
              )}
            />

            {/* Image previews */}
            {imageViews.length > 0 && (
              <div className="flex flex-row gap-2 flex-wrap mt-1">
                {imageViews.map((preview, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <Image src={preview} alt={`Preview ${i + 1}`} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-black/60 hover:bg-black/80 rounded-full h-5 w-5 p-0.5"
                    >
                      <X className="w-3 h-3 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full flex flex-row justify-between items-center mt-1 border-t pt-2">
              {/* Toolbar: Image, Emoji, Location */}
              <div className="flex items-center gap-1 text-violet-500">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 [&_svg]:!size-5"
                  disabled={imageViews.length >= 4}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon />
                </Button>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9 [&_svg]:!size-5">
                  <Smile />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9 [&_svg]:!size-5">
                  <MapPin />
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-violet-500 hover:bg-violet-600 rounded-full px-6 font-bold"
                disabled={isLoading || !form.formState.isDirty || !form.formState.isValid}
              >
                Shout
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

/**
 * Dialog trigger wrapper around ShoutComposer.
 * Used in the Sidebar and as the mobile floating action button.
 */
export function CreateShout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Element */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* Composer Dialog */}
      <DialogContent className="sm:max-w-[600px] top-[15%] translate-y-0">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-bold">New Shout</DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <ShoutComposer onSubmitted={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
