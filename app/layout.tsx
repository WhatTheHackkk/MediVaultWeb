import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "MediVault | Secure Pharmacy Operations", description: "Secure pharmacy inventory and patient operations dashboard." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
