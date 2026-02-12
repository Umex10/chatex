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
import { signUpAccount } from "@/actions/auth"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setAccessJwtState } from "@redux/slices/accessJwtSlice";
import { useRouter } from "next/navigation";

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

export type SignUpAccountValues = z.infer<typeof createAccountSchema>;

interface SignUpAccountProps {
    children: React.ReactNode;
}

export function SignUpAccount({ children }: SignUpAccountProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

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

    const onSubmit = async (data: SignUpAccountValues) => {
        const { keyConfirm, ...freshData } = data;
        const res = await signUpAccount(freshData);

        if (!res.success) {
            return;
        }

        dispatch(setAccessJwtState(res.data));
        console.warn(res.data);

        setOpen(false);
        form.reset();
        
        router.refresh();
        
        setTimeout(() => {
            router.push("/feed");
        }, 100);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                        className="space-y-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
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
                                        <Input placeholder="johndoe123" {...field} />
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
                                        <Input type="tel" placeholder="+1234567890" {...field} />
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
                                disabled={!form.formState.isValid}
                                className="flex-1 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:text-white"
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
