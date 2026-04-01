const fs = require('fs');

fs.writeFileSync('/home/umejr/IdeaProjects/chatex/frontend/src/app/terms/page.tsx', `"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#121212] pt-20 px-6 pb-20">
      <div className="max-w-3xl mx-auto mt-24">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Terms of Code & Usage</h1>
        <div className="text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
          <p className="mb-6">
            Chatex is an ambitious full-stack project built over two months. 
            Because it is designed as a portfolio piece showing my engineering skills in React, Next.js, and Java Spring Boot, 
            <strong> you are completely free to fork, expand, or build upon this code.</strong>
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">Open Source Spirit</h3>
          <p className="mb-6">
            I strongly believe in the open-source community. If you find a component you like, or want to use the architecture 
            for your own ideas, feel free to use it. Just don't forget to star the repository and maybe leave a shoutout!
          </p>
          <div className="mt-12">
            <Link href="/">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`);
