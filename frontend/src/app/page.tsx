"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { SignUpAcc } from "@/components/auth/signup-account";
import { SignInAcc } from "@/components/auth/signin-account";
import { Button } from "@/components/ui/button";
import { Users, Heart, Share2, Rocket, Code2, ChevronDown } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-violet-300 selection:text-violet-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 backdrop-blur-xl dark:bg-[#121212]/60 transition-all duration-300">
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
            <a
              href="#features"
              onClick={(e) => handleScroll(e, "features")}
              className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#tech-stack"
              onClick={(e) => handleScroll(e, "tech-stack")}
              className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
            >
              Built With
            </a>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, "about")}
              className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignInAcc>
              <Button
                data-testid="sign-in-account"
                variant="ghost"
                className="text-violet-600 border-violet-200 hover:bg-violet-100 dark:text-violet-400 dark:border-violet-800/50 dark:hover:bg-violet-900/30"
              >
                Log in
              </Button>
            </SignInAcc>
          </div>
        </div>
      </header>

      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-screen w-full relative flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden"
        >
          {/* Animated background orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 20, 0], y: [0, 30, 0] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-fuchsia-400/15 dark:bg-fuchsia-600/[0.08] rounded-full blur-3xl -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -15, 0], y: [0, -25, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-600/[0.08] rounded-full blur-3xl -z-10"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto w-full"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold border border-violet-200 dark:border-violet-800/50 mt-10 backdrop-blur-sm"
            >
              <Rocket size={16} />
              <span>Your new Social Media Website!</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tighter"
            >
              A place for your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400 animate-gradient-x bg-[length:200%_auto]">
                Voice & Vision
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with the world. Share your ideas with Shouts, interact
              seamlessly, and build your own unique community on a nice website.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <SignUpAcc>
                <div
                  data-testid="sign-up-account"
                  className="w-full sm:w-auto shrink-0"
                >
                  <Button
                    size="lg"
                    className="w-full text-lg px-8 py-6 bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                  >
                    Register
                  </Button>
                </div>
              </SignUpAcc>
              <SignInAcc>
                <div className="w-full sm:w-auto shrink-0 sm:hidden">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-lg px-8 py-6 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-105 transition-all"
                  >
                    Log in
                  </Button>
                </div>
              </SignInAcc>
              <Button
                onClick={(e) => handleScroll(e as any, "features")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-105 transition-all"
              >
                Browse Features
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-violet-500/10 bg-gray-100 dark:bg-[#1a1a1a] relative flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/10 z-0" />
            <Image
              src="/home.jpg"
              fill
              alt="App Dashboard Preview"
              className="object-cover object-top z-10 transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 mb-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-6 h-6 text-violet-400 dark:text-violet-500" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="min-h-screen w-full flex flex-col justify-center py-24 px-6 bg-white dark:bg-[#161616] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(139,92,246,0.05)_1px,_transparent_0)] bg-[size:40px_40px] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(139,92,246,0.03)_1px,_transparent_0)]" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Everything you need to connect
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chatex isn&apos;t just a messaging app. It&apos;s a full-fledged
                social website designed to show your voice and leave meaningful
                interactions.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-3 items-stretch max-w-6xl mx-auto w-full"
            >
              {/* Feature 1: Like & Comment */}
              <motion.div
                variants={itemVariants}
                className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-white/50 dark:bg-[#1f1f1f]/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 shadow-sm hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Heart size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">
                  Like & Comment
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Engage deeply with the content you love. Leave a like or start
                  a rich discussion in the comments section seamlessly.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-500 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image
                    src="/comment.jpg"
                    alt="Like and Comment Feature"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>

              {/* Feature 2: Reshouts & Quotes */}
              <motion.div
                variants={itemVariants}
                className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-white/50 dark:bg-[#1f1f1f]/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 shadow-sm hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Share2 size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">
                  Reshouts & Quotes
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Found something nice? Show it to your own audience or add your
                  unique spin by re-shoutin&apos; them on your feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-500 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image
                    src="/reshout.jpg"
                    alt="Reshouts and Quotes Feature"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>

              {/* Feature 3: Follow System */}
              <motion.div
                variants={itemVariants}
                className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-white/50 dark:bg-[#1f1f1f]/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 shadow-sm hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Users size={28} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">
                  Follow System
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-6 flex-1">
                  Build your network. Follow your favorite creators, friends,
                  and trending topics to curate your personal feed.
                </p>
                <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-transform duration-500 group-hover:scale-[1.02] bg-white dark:bg-black">
                  <Image
                    src="/followList.jpg"
                    alt="Follow System Image"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section
          id="tech-stack"
          className="min-h-screen w-full flex flex-col justify-center py-24 px-6 relative overflow-hidden bg-gradient-to-tr from-purple-50 to-violet-100 dark:from-[#141414] dark:to-[#1f1a26]"
        >
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center p-3 bg-violet-600 text-white rounded-2xl mb-6 shadow-lg shadow-violet-500/30">
                <Code2 size={32} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                Architecture & Technology
              </h3>
              <p className="text-xl text-violet-600 dark:text-violet-400 font-medium">
                The comprehensive stack powering Chatex
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 dark:bg-[#262626]/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 dark:border-gray-700/50 shadow-[0_20px_50px_rgba(139,92,246,0.1)]"
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto mb-12">
                Chatex is a full-stack social media application engineered
                entirely from scratch over <strong>two dedicated months</strong>.
                My main objective was to create a modern, scalable platform that
                accurately mimics real-world enterprise architectures, proving my
                readiness for professional software engineering securely and
                confidently.
              </p>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Frontend Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gradient-to-b from-white to-blue-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-900/5 group hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">
                    Frontend Ecosystem
                  </h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Next.js 14 & React:&quot;</strong> Fully
                        responsive UI built with Tailwind CSS, Server
                        Components, and polished with Framer Motion.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;State & Data:&quot;</strong> Managed
                        globally utilizing Redux Toolkit (RTK) and heavily
                        optimized using RTK Queries for catching/mutations.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Testing:&quot;</strong> Extensive Unit &
                        Integration testing through Vitest alongside automated
                        End-to-End (E2E) testing via Playwright.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Hosting:&quot;</strong> Seamlessly deployed
                        and delivered on Vercel{"'"}s global edge network.
                      </span>
                    </li>
                  </ul>
                </motion.div>

                {/* Backend Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-b from-white to-green-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-xl shadow-green-900/5 group hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">
                    Backend Architecture
                  </h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Java S-Boot:&quot;</strong> The robust
                        engine powering the RESTful APIs with optimized querying
                        via Spring Data JPA.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Security:&quot;</strong> Protected via a
                        strictly defined Custom Security Filter Chain and
                        stateless JWT-based authentication.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Testing:&quot;</strong> Bulletproof
                        stability ensured through heavy JUnit testing and
                        comprehensive Spring Boot Integration Tests.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Hosting:&quot;</strong> Running
                        continuously in production via Railway deployment.
                      </span>
                    </li>
                  </ul>
                </motion.div>

                {/* DevOps & Database Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-b from-white to-purple-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-xl shadow-purple-900/5 group hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">
                    Database
                  </h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Docker Containerization:&quot;</strong>{" "}
                        Standardized and isolated environments using Docker &
                        Docker Compose for testing/staging.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Database Complexity:&quot;</strong>{" "}
                        Leveraging PostgreSQL to accurately map the complex
                        relational social graph (Follows, Reshouts, Comments).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">{"▹"}</span>
                      <span>
                        <strong>&quot;Engineering Mindset:&quot;</strong> Clean
                        code architecture bridging independent frontend and
                        backend infrastructures realistically.
                      </span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA (About) Section */}
        <section
          id="about"
          className="min-h-screen w-full flex flex-col justify-center items-center py-24 px-6 text-center relative overflow-hidden bg-white dark:bg-[#161616]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto flex flex-col items-center relative z-10"
          >
            <h3 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
              Start connecting with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
                nice people
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-12 text-xl leading-relaxed">
              Create your account today and live the next era of social media.
              It{"'"}s fast, free, and built for you.
            </p>
            <SignUpAcc>
              <div className="shrink-0 w-full flex justify-center">
                <Button
                  size="lg"
                  className="text-lg px-12 py-8 bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300 rounded-full flex items-center gap-3 w-auto"
                >
                  Sign Up Now
                  <Rocket size={22} />
                </Button>
              </div>
            </SignUpAcc>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container py-12 px-6 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/chatex4.png"
                width={32}
                height={32}
                alt="Logo"
                className="grayscale opacity-70"
              />
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Chatex
              </span>
            </div>
            <div className="text-sm font-medium italic text-gray-500 dark:text-gray-400">
              Code is code. Communication is art.
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} Chatex. Crafted with ambition and
            care.
          </div>
        </div>
      </footer>
    </div>
  );
}
