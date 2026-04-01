"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pt-32 px-6 pb-20 flex flex-col items-center">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Let's Talk</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Whether you have a question, feedback on the project, or want to discuss professional opportunities—I'm always open to connect.
        </p>
        
        <div className="bg-violet-50 dark:bg-[#1a1a1a] rounded-3xl p-10 border border-violet-100 dark:border-gray-800 shadow-xl mb-12 flex flex-col items-center gap-6">
          <a href="mailto:umi.dzinovic10@gmail.com" className="flex items-center gap-4 text-2xl font-semibold text-violet-600 dark:text-violet-400 hover:underline">
            <Mail size={32} />
            umi.dzinovic10@gmail.com
          </a>
        </div>

        <div className="flex justify-center mt-12 gap-4">
          <Link href="/">
            <Button variant="outline" className="border-violet-200 dark:border-gray-800 text-violet-700 dark:text-gray-300">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
