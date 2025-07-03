import type { Metadata } from "next";

import "./globals.css";
import ThreeBackground from "./components/3DBackgound/ThreeBackground";
import { Lacquer, Bangers } from "next/font/google";
import Link from "next/link";

const lacquer = Bangers({
  subsets: ["latin"],
  variable: "--font-lacquer",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sebkah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lacquer.variable} h-dvh w-full grid grid-rows-[min-content_1fr] text-white antialiased`}
      >
        {/*         <nav className="w-full h-dvh pointer-events-none z-1000 flex items-center justify-center content-center ">
          <div className="z-100  p-4 text-white text-[100px] font-lacquer">
            <ul className="flex gap-40">
              <li>
                <Link href="/portfolio">Portfolio </Link>
              </li>
              <li>
                <Link href="/about">CV</Link>
              </li>
            </ul>
          </div>
        </nav> */}
        <div className="pointer-events-none  w-full h-full">{children}</div>
        <ThreeBackground />
      </body>
    </html>
  );
}
