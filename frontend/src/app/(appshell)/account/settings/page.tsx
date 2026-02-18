"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReturnHeader from '@/components/ReturnHeader';

export const editAccountSchema = z.object({
  name: z.string().min(2, "Name ist zu kurz").optional().or(z.literal("")),
  bio: z.string().max(160, "Bio ist zu lang").optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url({ message: "That is not a valid url..." })
    .optional()
    .or(z.literal("")),
});

export type AccountSchemaValues = z.infer<typeof editAccountSchema>;

const Settings = () => {
  const form = useForm<AccountSchemaValues>({
    resolver: zodResolver(editAccountSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      website: ""
    }
  });

  const onSubmit = async (data: AccountSchemaValues) => {
    console.log(data);
  }

  return (
    <div className='w-full flex flex-col'>
      <ReturnHeader>
        <Button variant="secondary"
          type="submit"
          form="edit-account-form"
          className='rounded-xl bg-violet-500'>
          Save Changes
        </Button>
      </ReturnHeader>
      {/* Banner & Avatar */}
      <div className='relative w-full'>
        <div className="bg-zinc-800 w-full h-40">
          <Image
            src="/stadion.jpg"
            width={800}
            height={200}
            alt='Account Banner'
            className='w-full h-40 object-cover'
            priority
          />
        </div>

        <div className="absolute left-4 bottom-0 translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full border-4 border-black overflow-hidden bg-zinc-900 shadow-xl">
            <Image
              src="/avatar.png"
              fill
              alt="Profile"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className='flex-1 flex flex-col pt-16 px-4 pb-10'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='edit-account-form'
            className="space-y-6"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative border rounded-md border-zinc-700 focus-within:border-violet-500 transition-colors group">
                  <FormLabel className="absolute left-3 top-2.5 text-sm font-semibold text-zinc-500 group-focus-within:text-violet-500">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-transparent pt-12 pb-4 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-semibold px-3 pb-2 text-red-500" />
                </FormItem>
              )}
            />

            {/* BIO */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="relative border rounded-md border-zinc-700 focus-within:border-violet-500 transition-colors group">
                  <FormLabel className="absolute left-3 top-2.5 text-sm font-semibold text-zinc-500 group-focus-within:text-violet-500">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-none bg-transparent pt-12 pb-3 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[120px] text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-semibold px-3 pb-2 text-red-500" />
                </FormItem>
              )}
            />

            {/* LOCATION */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="relative border rounded-md border-zinc-700 focus-within:border-violet-500 transition-colors group">
                  <FormLabel className="absolute left-3 top-2.5 text-sm font-semibold text-zinc-500 group-focus-within:text-violet-500">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-transparent pt-12 pb-4 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-semibold px-3 pb-2 text-red-500" />
                </FormItem>
              )}
            />

            {/* WEBSITE */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="relative border rounded-md border-zinc-700 focus-within:border-violet-500 transition-colors group">
                  <FormLabel className="absolute left-3 top-2.5 text-sm font-semibold text-zinc-500 group-focus-within:text-violet-500">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none bg-transparent pt-12 pb-4 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-semibold px-3 pb-2 text-red-500" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Settings