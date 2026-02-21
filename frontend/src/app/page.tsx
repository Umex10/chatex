import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle";
import { FeatureCard } from "@/components/feature-card";
import { SignUpAcc } from "@/components/signup-account";
import { SignInAcc } from "@/components/signin-account";

/**
 * Home page component displaying the landing page.
 * Features hero section with sign-up and sign-in options.
 */
export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-[#1a1a1a] dark:via-[#262626] dark:to-[#1a1a1a]">
      {/* Header */}
      <header className="w-full border-b dark:border-gray-700 bg-white/50 backdrop-blur-sm dark:bg-[#262626]/80">
        <div className="container flex justify-between items-center py-3 px-4 mx-auto sm:py-4 sm:px-6">
          <div className="flex gap-2 items-center sm:gap-3">
            <Image
              src="/chatex2.png"
              width="32"
              height="32"
              alt="Chatex Logo"
              className="sm:w-10 sm:h-10"
            />
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Chatex
            </h1>
          </div>
          <nav className="flex gap-2 items-center sm:gap-4">
            <Link
              href="/about"
              className="hidden text-sm text-gray-600 sm:inline dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              href="/features"
              className="hidden text-sm text-gray-600 sm:inline dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Features
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1 justify-center items-center py-8 px-4 sm:py-12 sm:px-6">
        <div className="flex flex-col gap-8 items-center w-full max-w-5xl sm:gap-12">
          {/* Hero Section */}
          <div className="flex flex-col gap-4 items-center text-center sm:gap-6">
            <Image
              src="/chatex2.png"
              width="80"
              height="80"
              alt="Chatex Logo"
              className="sm:w-[120px] sm:h-[120px]"
            />
            <div>
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:mb-4 sm:text-5xl md:text-6xl dark:text-white">
                Chat Everywhere
              </h2>
              <p className="px-4 text-base text-gray-600 sm:text-xl md:text-2xl dark:text-gray-300">
                Connect with friends, share moments, and stay in touch wherever
                you are
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid gap-4 w-full max-w-3xl sm:gap-6 md:grid-cols-2">
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
                <SignUpAcc>
                  <Button
                    className="w-full bg-violet-600 dark:text-white dark:bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-700"
                    size="lg"
                   data-testid="sign-up-button"
                  >
                    Get Started
                  </Button>
                </SignUpAcc>
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
                <SignInAcc>
                  <Button
                    className="w-full text-violet-600 border-violet-600 dark:text-violet-400 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    variant="outline"
                    size="lg"
                    data-testid="sign-in-button"
                  >
                    Start
                  </Button>
                </SignInAcc>
              </CardContent>
            </Card>
          </div>

          {/* Features Highlight */}
          <div className="grid gap-3 mt-4 w-full max-w-3xl text-center sm:gap-4 sm:mt-8 md:grid-cols-3">
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
      <footer className="w-full border-t dark:border-gray-700 bg-white/50 backdrop-blur-sm dark:bg-[#262626]/80">
        <div className="container py-6 px-4 mx-auto sm:py-8 sm:px-6">
          <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
            <div className="text-xs text-center text-gray-600 sm:text-sm md:text-left dark:text-gray-400">
              © 2026 Chatex. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-3 justify-center items-center text-xs sm:gap-6 sm:text-sm">
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Cookies
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
