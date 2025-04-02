'use client'
import "./globals.css";
import { Indie_Flower } from 'next/font/google';
import { Inter } from 'next/font/google';
import Navbar from "./components/Navbar";
import {Provider} from 'jotai'
import { AuthPersistence } from "./components/AuthPersistance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const indieFlower = Indie_Flower({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-handwritten',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  const params = useParams();
  const isRoomPage = params?.slug !== undefined;
  
  // Use this to handle client-only rendering for parts that might cause hydration issues
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This will only run on the client after hydration
    setIsClient(true);
  }, []);
  
  console.log("isRoomPage: ", isRoomPage);
  
  return (
    <html lang="en">
        <body className={`${inter.variable} ${indieFlower.variable} bg-gray-100 text-gray-900`} suppressHydrationWarning={true}>
          <Provider>
            <AuthPersistence />
            {(!isRoomPage && isClient) && <Navbar />}
            {children}
          </Provider>
        </body>
    </html>
  );
}