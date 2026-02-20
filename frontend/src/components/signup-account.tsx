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
import { signUpAccount } from "@/actions/auth-account-actions"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setAccessJwtState } from "@redux/slices/accessJwtSlice";
import { useRouter } from "next/navigation";
import { setUser } from "@redux/slices/userSlice";
import { useSignUpMutation } from "@redux/api/apiSlice";

/**
 * Zod schema for validating sign-up form data.
 * Includes validation for all user registration fields and password confirmation.
 */
const createAccountSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        username: z
            .string()
            .min(3, {
                message: "Username must be at least 3 characters.",
            })
            .max(20, {
                message: "Username must be at most 20 characters.",
            })
            .regex(/^[a-zA-Z0-9_]+$/, {
                message: "Username can only contain letters, numbers, and underscores.",
            }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        phone: z.string().min(10, {
            message: "Phone number must be at least 10 digits.",
        }),
        key: z.string().min(8, {
            message: "Key must be at least 8 characters.",
        }),
        keyConfirm: z.string(),
    })
    .refine((data) => data.key === data.keyConfirm, {
        message: "Keys don't match",
        path: ["keyConfirm"],
    });

/**
 * Type representing the validated sign-up form values.
 */
export type SignUpAccountValues = z.infer<typeof createAccountSchema>;

interface SignUpAccountProps {
    children: React.ReactNode;
}

/**
 * Dialog component for user registration.
 * Displays a form modal for creating new user accounts.
 */
export function SignUpAccount({ children }: SignUpAccountProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const [signUp] = useSignUpMutation();

    const dispatch: AppDispatch = useDispatch();


    const form = useForm<SignUpAccountValues>({
        resolver: zodResolver(createAccountSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            username: "",
            email: "",
            phone: "",
            key: "",
            keyConfirm: "",
        },
    });

    /**
     * Handles form submission for user registration.
     * Creates a new account, updates Redux state, and navigates to the feed page.
     */
    const onSubmit = async (data: SignUpAccountValues) => {
        const { keyConfirm, ...freshData } = data;

        try {

            const res = await signUp(freshData).unwrap();

            setOpen(false);
            form.reset();

            router.refresh();

            setTimeout(() => {
                router.push("/home");
            }, 100);
        } catch (error) {
            console.error("An error occured while signing in:", error);
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild
                data-testid="sign-up-button">
                {children}
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Create Account
                    </DialogTitle>
                    <DialogDescription>
                        Join our community and start chatting today. Fill in your details
                        below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="py-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input data-testid="name" placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input data-testid="username" placeholder="johndoe123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            data-testid="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input data-testid="phone" type="tel" placeholder="+1234567890" {...field} />
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
                                            data-testid="key"
                                            type="password"
                                            placeholder="Enter your key"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="keyConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            data-testid="keyConfirm"
                                            type="password"
                                            placeholder="Confirm your key"
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
                                data-testid="create-account-button"
                                disabled={!form.formState.isValid}
                                className="flex-1 bg-violet-600 dark:text-white dark:bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-violet-700"
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
