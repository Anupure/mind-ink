'use client'
import "./globals.css";
import { Indie_Flower } from 'next/font/google';
import { Inter } from 'next/font/google';
import Navbar from "./components/Navbar";
import {Provider} from 'jotai'
import { AuthPersistence } from "./components/AuthPersistance";

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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${inter.variable} ${indieFlower.variable} bg-gray-100`}>
          <Provider>
            <AuthPersistence />
            <Navbar />          
            {children}
          </Provider>
          </body>
    </html>
  );
}