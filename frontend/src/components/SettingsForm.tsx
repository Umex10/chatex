"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react'
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
import { useGetUserQuery, useUpdateUserMutation } from '@redux/api/apiSlice';
import { User } from '../../constants/User';
import { toast } from 'sonner';
import { CldImage } from 'next-cloudinary';
import axios from 'axios';

/** Zod schema for validating the edit-account form fields. */
export const editAccountSchema = z.object({
  name: z.string().min(2, "Name is to short").or(z.literal("")),
  bio: z.string().max(160, "Bio is to long").optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  website: z
    .string()
    .url({ message: "That is not a valid url..." })
    .optional()
    .or(z.literal("")),
  avatar: z.any().optional(),
  banner: z.any().optional(),
});

/** Type inferred from `editAccountSchema` representing validated form values. */
export type AccountSchemaValues = z.infer<typeof editAccountSchema>;

/**
 * Account settings page.
 * Allows the authenticated user to edit their display name, bio, location and website.
 * Only sends the update request when at least one field has actually changed.
 */
const Settings = () => {

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(undefined);
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const { data: meUser } = useGetUserQuery(undefined);
  const avatar = meUser?.avatar ? meUser?.avatar : "user-avatar_yr4qhg";
  const banner = meUser?.banner ? meUser?.banner : "stadion_x556pn";

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [avatarView, setAvatarView] = useState<string | null>(null);
  const [bannerView, setBannerView] = useState<string | null>(null);

  const form = useForm<AccountSchemaValues>({
    resolver: zodResolver(editAccountSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name,
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      avatar: user?.avatar,
      banner: user?.banner
    }
  });

  useEffect(() => {

    if (user) {
      form.reset({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        avatar: user.avatar,
        banner: user.banner
      });

    }

  }, [user, form]);

  /**
   * Handles the settings form submission.
   * Compares the new values against the current user data and only calls
   * `updateUser` when something has actually changed.
   */
  const onSubmit = async (updatedData: AccountSchemaValues) => {

    // We will not change the formData directly
    const payload = { ...updatedData };

    // Look if there is any change to an attribute to the user, if not return
    const isChanged = Object.keys(payload).some(
      key => payload[key as keyof AccountSchemaValues] !== user?.[key as keyof User]
    );

    if (!isChanged) return;

    const toastId = toast.loading('Saving...');

    if (updatedData.avatar !== user?.avatar) {
      const res = await generateSecureUrl(updatedData.avatar);
      if (!res.success) return;
      payload.avatar = res.data.secure_url;
    }
    if (updatedData.banner !== user?.banner) {
      const res = await generateSecureUrl(updatedData.banner);
      if (!res.success) return;
      payload.banner = res.data.secure_url;
    }

    try {
      await updateUser(payload).unwrap();
      toast.success('Your Account was successfully updated!', { id: toastId });

      setAvatarView(null);
      setBannerView(null);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "An error occured while updating your account.";
      console.error(errorMessage);
      toast.error(errorMessage, { id: toastId });
    }

  }

  const generateSecureUrl = async (file: File) => {

    const formData = new FormData();

    formData.append("file", file);

    // Unsigned key so we can actually send from the frontend
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return { success: true, data: res.data };
    } catch (err: any) {
      console.error("An error occured while uploading the file:", err);

      return { success: false, error: err }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(type, file, { shouldDirty: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setAvatarView(reader.result as string);
        if (type === 'banner') setBannerView(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='w-full flex-1 flex flex-col'>
      <ReturnHeader>
        <Button variant="secondary"
          type="submit"
          form="edit-account-form"
          className='rounded-xl bg-violet-500'>
          Save Changes
        </Button>
      </ReturnHeader>
      {/* Banner & Avatar */}
      <div
        className='relative w-full cursor-pointer group'
        onClick={() => bannerInputRef.current?.click()}
      >
        <div className="bg-zinc-800 w-full h-40">
          <CldImage
            width={800}
            height={400}
            src={bannerView || banner}
            alt="User Banner"
            crop="thumb"
            gravity="face"
            format="auto"
            quality="auto"
            loading='eager'
            className="w-full h-40 object-cover hover:opacity-80 transition-opacity"
          />
        </div>

        <input
          type="file"
          ref={bannerInputRef}
          className="hidden"
          accept="image/*"
          form='edit-account-form'
          onChange={(e) => handleFileChange(e, 'banner')}
        />

        <div
          className="absolute left-4 bottom-0 translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            avatarInputRef.current?.click();
          }}
        >
          <div className="relative w-24 h-24 rounded-full border-4 border-black overflow-hidden bg-zinc-900">
            <CldImage
              width="56"
              height="56"
              src={avatarView || avatar}
              alt="User Avatar"
              crop="thumb"
              gravity="face"
              format="auto"
              quality="auto"
              loading='eager'
              className="w-full h-full object-cover hover:opacity-80 transition-opacity"
            />
          </div>

          <input
            type="file"
            ref={avatarInputRef}
            className="hidden"
            accept="image/*"
            form='edit-account-form'
            onChange={(e) => handleFileChange(e, 'avatar')}
          />
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