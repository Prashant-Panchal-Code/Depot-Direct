import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/components/shared/UserProvider";
import { RoleBasedProvider } from "@/contexts/RoleBasedContext";
import { LoaderProvider } from "@/contexts/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";

// AG Grid imports
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import LayoutContent from "./components/LayoutContent";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Depot Direct - Dashboard",
  description: "Fuel delivery management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <LoaderProvider>
          <AppProvider>
            <UserProvider>
              <RoleBasedProvider>
                <LayoutContent>
                  {children}
                </LayoutContent>
                <Toaster />
                <GlobalLoader />
              </RoleBasedProvider>
            </UserProvider>
          </AppProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}