"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-violet-50 dark:bg-[#121212] pt-32 px-6 pb-24 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">The Vision & Roadmap</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Chatex is already a robust application, but the journey doesn't stop here. Here is a sneak peek into the future features planned.
          </p>
        </div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-6 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg"
          >
            <div className="mt-1 text-violet-500"><Zap size={28} /></div>
            <div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">Real-Time WebSocket Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Direct Messaging (DM) features using Spring Boot WebSockets and STOMP to enable instantaneous private conversations between mutual followers.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg"
          >
            <div className="mt-1 text-blue-500"><Shield size={28} /></div>
            <div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">Advanced Moderation UI</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Empowering administrators with a dedicated dashboard to handle reports, block spammers, and ensure the community remains a safe space.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-6 bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg"
          >
            <div className="mt-1 text-green-500"><Globe size={28} /></div>
            <div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">Algorithmic Feed Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                An intelligent feed switch that alternates between "Following Only" and "Discover," pushing relevant, trending Reshouts and Quotes to your timeline.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/">
            <Button size="lg" className="bg-violet-600 text-white rounded-full px-8 hover:scale-105 transition-transform shadow-lg shadow-violet-500/30">
              Return to Landing Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
