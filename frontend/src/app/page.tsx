"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { SignUpAcc } from "@/components/auth/signup-account";
import { SignInAcc } from "@/components/auth/signin-account";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Heart, Share2, Quote, Rocket, Code2 } from "lucide-react";

/**
 * Primary Landing Page (Home) component for Chatex.
 * Showcases the app's features, architecture, and provides auth entry points.
 * 
 * @returns {JSX.Element} Rendered landing page 
 */
export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5 },
    },
  };

  /**
   * Smoothly scrolls to the specified section anchor.
   *
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The click event
   * @param {string} targetId - The DOM ID of the target section
   */
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#121212] text-gray-900 dark:text-gray-100 font-sans selection:bg-violet-300 selection:text-violet-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b dark:border-gray-800 bg-white/70 backdrop-blur-md dark:bg-[#1a1a1a]/80 transition-colors duration-300">
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
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#tech-stack" onClick={(e) => handleScroll(e, 'tech-stack')} className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">Built With</a>
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">About</a>
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

      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen w-full relative flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold border border-violet-200 dark:border-violet-800/50 mt-10">
              <Rocket size={16} />
              <span>Your new Social Media Website! (X Clone)</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
              A place for your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                Voice & Vision
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with people globally. Share your thoughts through Shouts, 
              interact seamlessly, and build your own unique community on an nice website.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <SignUpAcc>
                <div className="w-full sm:w-auto shrink-0">
                  <Button size="lg" className="w-full text-lg px-8 py-6 bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/30 hover:scale-105 transition-all">
                    Join the Community
                  </Button>
                </div>
              </SignUpAcc>
              <Button onClick={(e) => handleScroll(e as any, 'features')} size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-105 transition-all">
                Browse Features
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-gray-100 dark:bg-[#1a1a1a] relative flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/10 z-0"></div>
            <span className="z-10 text-gray-400 dark:text-gray-600 text-lg font-medium flex flex-col items-center gap-3">
              <Image src="/chatex4.png" width={60} height={60} alt="App Preview" className="opacity-50 grayscale" />
              [ App Dashboard Screenshot Placeholder ]
            </span>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen w-full flex flex-col justify-center py-20 px-6 bg-white dark:bg-[#161616]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Everything you need to connect
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Chatex isn{"'"}t just a messaging app. It{"'"}s a full-fledged social platform designed to amplify your voice and spark meaningful interactions.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
            >
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Make a Shout</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Share your thoughts, daily updates, or creative ideas instantly with the world through Shouts. 
                </p>
                <div className="w-full h-24 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Shout Form Image ]
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Like & Comment</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Engage deeply with the content you love. Drop a like or start a rich discussion in the comments section.
                </p>
                <div className="w-full h-24 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Comments Thread Image ]
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Share2 size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Reshouts</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Found something awesome? Amplify it to your own audience with a single click using the Reshout button.
                </p>
                <div className="w-full h-24 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Reshout Action Image ]
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Quote size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Quote System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Add your own unique spin to someone else{"'"}s Shout by quoting them directly on your feed.
                </p>
                <div className="w-full h-24 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ Quoted Shout Image ]
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div variants={itemVariants} className="group flex flex-col p-6 lg:p-8 rounded-3xl bg-violet-50/50 dark:bg-[#1f1f1f] border border-violet-100 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all hover:shadow-xl hover:shadow-violet-500/5 md:col-span-2 lg:col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2 dark:text-white">Follow System</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                  Build your network. Follow your favorite creators, friends, and trending topics to curate your personal feed.
                </p>
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-[#1a1a1a] flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 font-medium">
                  [ User Profile / Follow Following Image ]
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="min-h-screen w-full flex flex-col justify-center py-20 px-6 relative overflow-hidden bg-gradient-to-tr from-purple-50 to-violet-100 dark:from-[#141414] dark:to-[#1f1a26]">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-violet-600 text-white rounded-2xl mb-6 shadow-lg shadow-violet-500/30">
                <Code2 size={32} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Architecture & Technology</h3>
              <p className="text-xl text-violet-600 dark:text-violet-400 font-medium">The comprehensive stack powering Chatex</p>
            </div>
              
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 dark:bg-[#262626]/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 dark:border-gray-700/50 shadow-[0_20px_50px_rgba(139,92,246,0.1)]"
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto mb-12">
                Chatex is a full-stack social media application engineered entirely from scratch over <strong>two dedicated months</strong>. 
                My main objective was to create a modern, scalable platform that accurately mimics real-world enterprise architectures, proving my readiness for professional software engineering securely and confidently.
              </p>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Frontend Card */}
                <div className="bg-gradient-to-b from-white to-blue-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-900/5 group hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">Frontend Ecosystem</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Next.js 14 & React:</strong> Fully responsive UI built with Tailwind CSS, Server Components, and polished with Framer Motion.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>State & Data:</strong> Managed globally utilizing Redux Toolkit (RTK) and heavily optimized using RTK Queries for catching/mutations.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Testing:</strong> Extensive Unit & Integration testing through Vitest alongside automated End-to-End (E2E) testing via Playwright.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">▹</span>
                      <span><strong>Hosting:</strong> Seamlessly deployed and delivered on Vercel{"'"}s global edge network.</span>
                    </li>
                  </ul>
                </div>

                {/* Backend Card */}
                <div className="bg-gradient-to-b from-white to-green-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-xl shadow-green-900/5 group hover:border-green-400 dark:hover:border-green-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">Backend Architecture</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Java Spring Boot:</strong> The robust engine powering the RESTful APIs with optimized querying via Spring Data JPA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Security:</strong> Protected via a strictly defined Custom Security Filter Chain and stateless JWT-based authentication.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Testing:</strong> Bulletproof stability ensured through heavy JUnit testing and comprehensive Spring Boot Integration Tests.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▹</span>
                      <span><strong>Hosting:</strong> Running continuously in production via Railway deployment.</span>
                    </li>
                  </ul>
                </div>

                {/* DevOps & Flow Card */}
                <div className="bg-gradient-to-b from-white to-purple-50/30 dark:from-[#1f1f1f] dark:to-[#1f1f1f]/80 p-8 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-xl shadow-purple-900/5 group hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-[#1f1f1f] shadow-inner">
                    <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></span>
                  </div>
                  <h4 className="font-extrabold text-2xl mb-6 text-gray-900 dark:text-white">DevOps & Database</h4>
                  <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Docker Containerization:</strong> Standardized and isolated environments using Docker & Docker Compose for testing/staging.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Database Complexity:</strong> Leveraging PostgreSQL to accurately map the complex relational social graph (Follows, Reshouts, Comments).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">▹</span>
                      <span><strong>Engineering Mindset:</strong> Clean code architecture bridging independent frontend and backend infrastructures realistically.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA (About) Section */}
        <section id="about" className="min-h-screen w-full flex flex-col justify-center items-center py-20 px-6 text-center bg-white dark:bg-[#161616]">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <h3 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
              Start connecting with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">nice people</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-12 text-xl lead-relaxed">
              Create your account today and experience the next era of social networking. It{"'"}s fast, free, and built for you.
            </p>
            <SignUpAcc>
              <div className="shrink-0 w-full flex justify-center">
                <Button size="lg" className="text-lg px-12 py-8 bg-violet-600 text-white hover:bg-violet-700 shadow-xl shadow-violet-500/30 hover:scale-105 transition-transform rounded-full flex items-center gap-3 w-auto">
                  Sign Up Now
                  <Rocket size={22} />
                </Button>
              </div>
            </SignUpAcc>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t dark:border-gray-800 bg-gray-50 dark:bg-[#121212]">
        <div className="container py-12 px-6 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/chatex4.png" width={32} height={32} alt="Logo" className="grayscale opacity-70" />
              <span className="font-bold text-gray-600 dark:text-gray-400">Chatex</span>
            </div>
            
            <div className="text-sm font-medium italic text-gray-500 dark:text-gray-400">
              Code is code. Communication is art.
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
