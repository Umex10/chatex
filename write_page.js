const fs = require('fs');

const content = `"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { SignUpAcc } from "@/components/auth/signup-account";
import { SignInAcc } from "@/components/auth/signin-account";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Heart, Share2, Quote, Rocket, Code2 } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#121212] text-gray-900 dark:text-gray-100 font-sans selection:bg-violet-300 selection:text-violet-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b dark:border-gray-800 bg-white/70 backdrop-blur-md dark:bg-[#1a1a1a]/80 transition-colors duration-300">
        <div className="container flex justify-between items-center py-4 px-6 mx-auto">
          <div className="flex gap-3 items-center">
            <Image
              src="/chatex4.png"
              width={40}
              height={40}
              alt="Chatex Logo"
              className="rounded-xl shadow-sm dark:shadow-violet-900/20"
            />
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
              Chatex
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 items-center font-medium">
            <a href="#features" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#tech-stack" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Built With</a>
            <a href="#about" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden sm:flex gap-2">
              <SignInAcc>
                <Button variant="ghost" className="text-violet-600 border-violet-200 hover:bg-violet-100 dark:text-violet-400 dark:border-violet-800/50 dark:hover:bg-violet-900/30">
                  Log in
                </Button>
              </SignInAcc>
              <SignUpAcc>
                <Button className="bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-violet-500/25 transition-all">
                  Sign up
                </Button>
              </SignUpAcc>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 lg:pt-32 lg:pb-40 overflow-hidden flex flex-col items-center text-center">
          {/* Background decorative blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold border border-violet-200 dark:border-violet-800/50">
              <Rocket size={16} />
              <span>The Next Generation Social Network</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              A place for your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                Voice & Vision
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with people globally. Share your thoughts through Shouts, interact seamlessly, and build your own unique community on an open, modern platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpAcc>
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/30 hover:scale-105 transition-all">
                  Join the Community
                </Button>
              </SignUpAcc>
              <a href="#features" className="w-full sm:w-auto block">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-105 transition-all">
                  Explore Features
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Hero App Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-gray-100 dark:bg-[#1a1a1a] relative flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/10 z-0"></div>
            <span className="z-10 text-gray-400 dark:text-gray-600 text-lg font-medium flex flex-col items-center gap-3">
              <Image src="/chatex4.png" width={60} height={60} alt="App Preview" className="opacity-50 grayscale" />
              [ App Dashboard Screenshot Placeholder ]
            </span>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-white dark:bg-[#161616]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Everything you need to connect
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chatex isn't just a messaging app. It's a full-fledged social platform designed to amplify your voice and spark meaningful interactions.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="group p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white">Make a Shout</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Share your thoughts, daily updates, or creative ideas instantly with the world through Shouts. 
                </p>
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Shout Form Image ]
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="group p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white">Like & Comment</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Engage deeply with the content you love. Drop a like or start a rich discussion in the comments section.
                </p>
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Comments Thread Image ]
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="group p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Share2 size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white">Reshouts</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Found something awesome? Amplify it to your own audience with a single click using the Reshout button.
                </p>
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Reshout Action Image ]
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={itemVariants} className="group p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Quote size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white">Quote System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Add your own unique spin to someone else's Shout by quoting them directly on your feed.
                </p>
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Quoted Shout Image ]
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div variants={itemVariants} className="group p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5 md:col-span-2 lg:col-span-2">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white">Follow System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Build your network. Follow your favorite creators, friends, and trending topics to curate your personal feed.
                </p>
                <div className="w-full h-40 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ User Profile / Follow Following Image ]
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack / About Section */}
        <section id="tech-stack" className="py-24 px-6 relative overflow-hidden bg-gradient-to-tr from-purple-50 to-violet-100 dark:from-[#141414] dark:to-[#1f1a26]">
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/60 dark:bg-[#262626]/80 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-white/50 dark:border-gray-700/50 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-500/30">
                  <Code2 size={32} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold dark:text-white tracking-tight">Handcrafted with passion</h3>
                  <p className="text-violet-600 dark:text-violet-400 font-medium mt-1">The architecture behind Chatex</p>
                </div>
              </div>
              
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Chatex is a full-stack social media application I developed entirely from scratch over the course of <strong>two dedicated months</strong>. My goal was to create a modern, performant, and scalable platform that mirrors the complexity of real-world enterprise applications.
                </p>
                
                <div className="py-6 my-8 border-y border-violet-200 dark:border-gray-700 grid md:grid-cols-2 gap-8">
                  <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-6 rounded-2xl border border-violet-100 dark:border-gray-700">
                    <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span> Frontend
                    </h4>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      Powered by <strong>Next.js 14</strong> and React. Designed with Tailwind CSS for high responsiveness and polished with Framer Motion for buttery-smooth animations. Features optimistic UI updates and rich interactivity.
                    </p>
                  </div>
                  <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-6 rounded-2xl border border-violet-100 dark:border-gray-700">
                    <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span> Backend
                    </h4>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      A robust REST API built strictly with <strong>Java Spring Boot</strong>. Incorporates JWT authentication, complex relational mapping for the social graph (follows, quotes, reshouts), and optimized database queries.
                    </p>
                  </div>
                </div>

                <div className="bg-violet-100/50 dark:bg-violet-900/20 p-6 rounded-2xl border-l-4 border-violet-600 dark:border-violet-500">
                  <p className="italic text-base md:text-lg">
                    "I built this project not just as a playground for clean architecture, but as a strong technical portfolio piece. It represents my engineering journey, problem-solving skills, and readiness for professional backend and full-stack software engineering roles."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Bottom */}
        <section className="py-24 px-6 text-center bg-white dark:bg-[#161616]">
          <h3 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">Ready to join?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg">
            Create your account today and start connecting with amazing people around the globe.
          </p>
          <div className="flex justify-center">
            <SignUpAcc>
              <Button size="lg" className="text-lg px-12 py-7 bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-500/30 hover:scale-105 transition-transform rounded-full flex items-center gap-2">
                Sign Up Now - It's Free
                <Rocket size={20} />
              </Button>
            </SignUpAcc>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="w-full border-t dark:border-gray-800 bg-gray-50 dark:bg-[#121212]">
        <div className="container py-12 px-6 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/chatex4.png" width={32} height={32} alt="Logo" className="grayscale opacity-70" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Chatex</span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium">
              <Link href="/terms" className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Privacy</Link>
              <Link href="/contact" className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Chatex. Crafted with ambition and care.
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('/home/umejr/IdeaProjects/chatex/frontend/src/app/page.tsx', content);
