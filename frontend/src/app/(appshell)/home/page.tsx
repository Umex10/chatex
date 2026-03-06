"use client"

import OneShout from '@/components/OneShout'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Button } from '@/components/ui/button';
import { CreateShout } from '@/components/CreateShout';
import { Image as ImageIcon, PencilLine, X } from 'lucide-react';
import { useCreateShoutMutation, useGetShoutsQuery, useGetUserQuery } from '@redux/api/apiSlice';
import { CldImage } from 'next-cloudinary';
import { generateSecureUrl } from '@/utils/cloudinary';
import { Textarea } from "@/components/ui/textarea"

const homeShoutSchema = z.object({
  text: z
    .string()
    .min(1, "Your shout cannot be empty.")
    .max(280, "Shouts are limited to 280 characters."),
  images: z.array(z.instanceof(File)).max(4, "You can add up to 4 images.").optional(),
});

export type ShoutValues = z.infer<typeof homeShoutSchema>;
export type ShoutPayload = { text: string; images: string[] };

/**
 * Home feed page for authenticated users.
 * Displays a tabbed shout feed ("For you" / "Following") and a
 * floating compose button on mobile screens.
 */
const Home = () => {

  const [activeTab, setActiveTab] = useState("for-you");

  const { data: user } = useGetUserQuery(undefined);
  const avatar = user?.avatar ? user?.avatar : "user-avatar_yr4qhg";
  const username = user?.username ? user?.username : "user-avatar_yr4qhg";
  const { data: shouts } = useGetShoutsQuery(username);
  const [createShout, { isLoading }] = useCreateShoutMutation();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageViews, setImageViews] = useState<string[]>([]);

  const form = useForm<ShoutValues>({
    resolver: zodResolver(homeShoutSchema),
    mode: "onChange",
    defaultValues: {
      text: "",
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const current = form.getValues("images") ?? [];
    const combined = [...current, ...files].slice(0, 4);
    form.setValue("images", combined, { shouldDirty: true, shouldValidate: true });
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImageViews(prev => [...prev, ...newPreviews].slice(0, 4));
    // Reset input so the same file can be picked again
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const current = form.getValues("images") ?? [];
    form.setValue("images", current.filter((_, i) => i !== index), { shouldDirty: true, shouldValidate: true });
    setImageViews(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: ShoutValues) {
    const files = values.images ?? [];
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const res = await generateSecureUrl(file);
      if (res.success) uploadedUrls.push(res.data.secure_url);
    }

    try {
      await createShout({ text: values.text, images: uploadedUrls }).unwrap();
    } catch (err) {
      console.error(err);
    }

    form.reset();
    setImageViews([]);
  }

  return (
    <div className='w-full text-3xl'>

      <Tabs defaultValue="for-you" className="w-full"
        onValueChange={setActiveTab}>
        <TabsList className='bg-background w-full grid grid-cols-2 h-14 p-0'>
          <TabsTrigger value="for-you" className={`flex-1 text-lg
            ${activeTab === "for-you" ? "underline decoration-2 underline-offset-20" : ""}`}>For you</TabsTrigger>
          <TabsTrigger value="following" className={`flex-1 text-lg
            ${activeTab === "following" ? "underline decoration-2 underline-offset-20" : ""}`}>Following</TabsTrigger>
        </TabsList>
        <div className='hidden md:block p-3 w-full border-y'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className='flex flex-row gap-1'>
                  <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
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

                  <div className='flex flex-col flex-1 gap-1 items-start'>
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Textarea
                              placeholder="What's new to you?"
                              className='placeholder:text-zinc-500 placeholder:text-lg text-lg max-h-[400px]'
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
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt={`Preview ${i + 1}`}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-1.5 -right-1.5 bg-black bg-opacity-60 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3 text-white" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className='w-full flex flex-row justify-between items-center mt-1'>
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
                      </div>

                      <Button
                        type="submit"
                        className='text-xl rounded-xl'
                        variant="secondary"
                        disabled={!form.formState.isDirty || !form.formState.isValid}
                      >
                        Shout
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </Form>
        </div>
        <TabsContent value="for-you" className='m-0'>
          {shouts?.map(shout => (
            <OneShout {...shout} key={shout.name}></OneShout>
          ))}
        </TabsContent>
        <TabsContent value="following" className='m-0'>Change your following here.</TabsContent>
      </Tabs>

      <CreateShout>
        <Button className="fixed right-6 bottom-24 h-12 w-12 rounded-full bg-violet-500 md:hidden [&_svg]:!size-6">
          <PencilLine className="w-8 h-8 text-white" />
        </Button>
      </CreateShout>
    </div>
  )
}

export default Home
