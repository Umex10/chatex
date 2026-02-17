"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Image as ImageIcon, MapPin, Smile, PencilLine, X } from "lucide-react"

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
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@redux/store"
import { addShout } from "@redux/slices/shoutsSlice"

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Dein Shout darf nicht leer sein.")
    .max(280, "Shouts sind auf 280 Zeichen begrenzt."),
})

export function CreateShout() {

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const dispatch = useDispatch<AppDispatch>();

  function onSubmit(values: z.infer<typeof formSchema>) {

    const newShout = {
      accImg: '/acc.png',
      name: 'Ramizio Roman',
      hasBadge: true,
      username: 'Wastust1234',
      createdAt: "1 std.",
      desc: values.content,
      shoutImg: '/stadion.jpg',
      comments: 300,
      reShouts: 5000,
      likes: 33333
    };

    dispatch(addShout(newShout));

    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "fixed right-6 bottom-24 md:hidden",
            "h-14 w-14 rounded-full shadow-lg shadow-violet-400/20",
            "bg-violet-500 hover:bg-violet-600 active:scale-95 transition-all duration-200",
            "flex items-center justify-center p-0"
          )}
        >
          <PencilLine className="w-6 h-6 text-white" strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] top-[15%] translate-y-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <DialogTitle className="text-xl font-bold">New Shout</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3 pt-4">
              <div className="h-10 w-10 rounded-full bg-violet-100 shrink-0" />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        placeholder="What will you shout?"
                        className="min-h-[120px] resize-none border-none focus-visible:ring-0 text-lg p-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex gap-1 text-violet-500">
                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-9 w-9">
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                type="submit" 
                className="bg-violet-500 hover:bg-violet-600 rounded-full px-6 font-bold"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                Shout
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}