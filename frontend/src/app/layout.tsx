import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "@redux/StoreProvider";
import { Toaster } from 'sonner';
/**
 * Root layout component for the application.
 * Wraps the entire application with theme provider and Redux store.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <StoreProvider>
              <Toaster position="top-center" richColors />
            {children}
            </StoreProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
