"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signInAccount} from "@/actions/auth"

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

export type SignInAccountValues = z.infer<typeof signInAccountSchema>;

interface SignInAccountProps {
    children: React.ReactNode;
}

export function SignInAccount({children}: SignInAccountProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<SignInAccountValues>({
        resolver: zodResolver(signInAccountSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            key: "",
        },
    });

    const onSubmit = (data: SignInAccountFormValues) => {
        // Handle sign in logic here
        console.log("Sign in data:", data);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                        className="space-y-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe123" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="key"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your key"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
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
                                Sign In
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

