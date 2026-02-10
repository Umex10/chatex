import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { FeatureCard } from "@/components/feature-card";
import { SignUpAccount } from "@/components/signup-account";
import { SignInAccount } from "@/components/signin-account";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-[#1a1a1a] dark:via-[#262626] dark:to-[#1a1a1a]">
      {/* Header */}
      <header className="w-full border-b bg-white/50 backdrop-blur-sm dark:bg-[#262626]/80 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/chatex2.png"
              width="32"
              height="32"
              alt="Chatex Logo"
              className="sm:w-10 sm:h-10"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Chatex
            </h1>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/about"
              className="hidden text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white sm:inline"
            >
              About
            </Link>
            <Link
              href="/features"
              className="hidden text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white sm:inline"
            >
              Features
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
            <Image
              src="/chatex2.png"
              width="80"
              height="80"
              alt="Chatex Logo"
              className="sm:w-[120px] sm:h-[120px]"
            />
            <div>
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-4 sm:text-5xl md:text-6xl">
                Chat Everywhere
              </h2>
              <p className="px-4 text-base text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl">
                Connect with friends, share moments, and stay in touch wherever
                you are
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid w-full max-w-3xl gap-4 sm:gap-6 md:grid-cols-2">
            {/* Sign Up Card */}
            <Card className="border-2 transition-all hover:border-violet-500 hover:shadow-xl dark:bg-[#262626] dark:border-violet-900/50 dark:hover:border-violet-500">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Sign up
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Join our community and start chatting today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpAccount>
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700
                  dark:text-white"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </SignUpAccount>
              </CardContent>
            </Card>

            {/* Sign In Card */}
            <Card className="border-2 transition-all hover:border-purple-500 hover:shadow-xl dark:bg-[#262626] dark:border-purple-900/50 dark:hover:border-purple-500">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Sign In</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Welcome back! Continue your conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignInAccount>
                  <Button
                    className="w-full border-violet-600 text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-950/30"
                    variant="outline"
                    size="lg"
                  >
                    Start
                  </Button>
                </SignInAccount>
              </CardContent>
            </Card>
          </div>

          {/* Features Highlight */}
          <div className="mt-4 grid w-full max-w-3xl gap-3 text-center sm:mt-8 sm:gap-4 md:grid-cols-3">
            <FeatureCard
              title="Instant Messaging"
              description="Chat with anyone, anywhere"
            />
            <FeatureCard
              title="Secure"
              description="Your conversations are encrypted"
            />
            <FeatureCard
              title="Cross-App"
              description="Access from any device, anytime"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white/50 backdrop-blur-sm dark:bg-[#262626]/80 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center text-xs text-gray-600 dark:text-gray-400 sm:text-sm md:text-left">
              © 2026 Chatex. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-6 sm:text-sm">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cookies
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
