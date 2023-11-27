import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiteClub",
  description: "A lite version of the most popular cypher portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-100">{children}</body>
    </html>
  );
}
