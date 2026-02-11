import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "@redux/StoreProvider";

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
            {children}
            </StoreProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
