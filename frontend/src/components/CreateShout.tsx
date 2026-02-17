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
import { Children, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@redux/store"
import { addShout } from "@redux/slices/shoutsSlice"

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Dein Shout darf nicht leer sein.")
    .max(280, "Shouts sind auf 280 Zeichen begrenzt."),
})

export function CreateShout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
       {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] top-[15%] translate-y-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <DialogTitle className="text-xl font-bold">New Shout</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
            <div className="w-full h-full flex flex-row items-start gap-3 pt-4">
              <div className="w-12 h-12 rounded-full bg-violet-100 shrink-0" />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        placeholder="What will you shout out?"
                        className="min-h-[120px] resize-none border-none focus-visible:ring-0 !text-xl placeholder:text-xl p-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="flex gap-1 text-violet-500">
                <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 text-white bg-transparent
                [&_svg]:!size-8">
                  <ImageIcon className="h-8 w-8" />
                </Button>
                <Button size="icon" className="rounded-full h-14 w-14 text-white bg-transparent
                [&_svg]:!size-8">
                  <Smile className="h-8 w-8" />
                </Button>
                <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 text-white bg-transparent
                [&_svg]:!size-8">
                  <MapPin className="h-8 w-8" />
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