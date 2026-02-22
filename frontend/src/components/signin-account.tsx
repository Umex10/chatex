"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSignInMutation } from "@redux/api/apiSlice";
import { toast } from "sonner";

/**
 * Zod schema for validating sign-in form data.
 * Defines validation rules for username and password fields.
 */
const signInAccountSchema = z.object({
    username: z
        .string()
        .min(3, {
            message: "Username must be at least 3 characters.",
        })
        .max(20, {
            message: "Username must be at most 20 characters.",
        }),
    key: z.string().min(8, {
        message: "Key must be at least 8 characters.",
    }),
});

/**
 * Type representing the validated sign-in form values.
 */
export type SignInAccountValues = z.infer<typeof signInAccountSchema>;

interface SignInAccountProps {
    children: React.ReactNode;
}

/**
 * Dialog component for user sign-in.
 * Displays a form modal for authenticating existing users.
 */
export function SignInAcc({ children }: SignInAccountProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [signIn] = useSignInMutation();

    const form = useForm<SignInAccountValues>({
        resolver: zodResolver(signInAccountSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            key: "",
        },
    });

    /**
     * Handles form submission for user sign-in.
     * Authenticates the user, updates Redux state, and navigates to the feed page.
     */
    const onSubmit = async (freshData: SignInAccountValues) => {

        const toastId = toast.loading("Singing in...");

        try {
            const res = await signIn(freshData).unwrap();

            toast.success("Welcome!", { id: toastId });

            setOpen(false);
            form.reset();

            router.refresh();

            setTimeout(() => {
                router.push("/home");
            }, 100);
        } catch (error: any) {
            const errorMessage = error?.message || "An error occured while signing you in.";
            toast.error(errorMessage, { id: toastId });
            console.error(errorMessage, error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Sign In
                    </DialogTitle>
                    <DialogDescription>
                        Welcome back! Sign in to your account to continue chatting.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe123" {...field} data-testid="username" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your key"
                                            data-testid="key"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!form.formState.isValid}
                                data-testid="confirm-sign-in-button"
                                className="flex-1 bg-violet-600 dark:text-white dark:bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-violet-700"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

