import type { Metadata } from "next";
import "./globals.css";
import { NavigationProvider } from "src/context/navigation-context";

export const metadata: Metadata = {
  title: "USA Goals",
  description: "The U.S. government's goal tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://use.typekit.net/gmm6bgq.css" />
      </head>
      <body className="antialiased">
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </body>
    </html>
  );
}