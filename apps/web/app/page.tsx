'use client'

import React from 'react';
import Head from 'next/head';
import { PaperEffect } from '@/ui/components/paperEffect';
import {  InkButton } from '@/ui/components/inkButton';
import { InkLink } from '@/ui/components/inkLink';
// import Image from 'next/image';

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Mind Ink - Ink your ideas with ease and style</title>
        <meta name="description" content="A simple yet powerful note-taking app with an artistic touch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <PaperEffect>
              <div className="p-8">
                <h2 className="text-5xl font-handwritten font-bold mb-4">
                  Ink your ideas with ease and style
                </h2>
                <p className="text-lg mb-8">
                  Simplicity at its best, with an artistic touch.
                </p>
                <InkButton className="px-6 py-3 text-lg">
                  Try for free
                </InkButton>
              </div>
            </PaperEffect>
          </div>
          
          <div>
            <PaperEffect>
              <div className="p-6 md:p-12 h-full flex items-center justify-center">
                {/* Placeholder for hero image */}
                <div className=" w-full h-64 flex items-center justify-center rounded-lg">
                  <span><img src={'./Animation.gif'} alt='App Preview' /></span>
                </div>
              </div>
            </PaperEffect>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-handwritten font-bold text-center mb-12">Why choose Mind Ink?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Elegant Simplicity",
                description: "Clean interface that lets you focus on what matters - your ideas."
              },
              {
                title: "Artistic Expression",
                description: "Beautiful paper-like textures and ink effects that inspire creativity."
              },
              {
                title: "Powerful Organization",
                description: "Organize your thoughts with our intuitive tagging and folder system."
              }
            ].map((feature, index) => (
              <PaperEffect key={index}>
                <div className="p-6 h-full">
                  <h3 className="text-xl font-handwritten font-bold mb-3">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </PaperEffect>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <PaperEffect>
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-handwritten font-bold mb-6">Ready to ink your ideas?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of creative minds who've discovered a new way to capture and organize their thoughts.
              </p>
              <InkButton className="px-8 py-4 text-lg">
                Get started now
              </InkButton>
            </div>
          </PaperEffect>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-12">
        <PaperEffect intensity={3}>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-handwritten font-bold text-lg mb-4">Mind Ink</h3>
                <p className="text-sm text-gray-600">
                  Simplicity at its best, with an artistic touch.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><InkLink href="/features" className="text-sm text-gray-600 hover:text-black">Features</InkLink></li>
                  <li><InkLink href="/pricing" className="text-sm text-gray-600 hover:text-black">Pricing</InkLink></li>
                  <li><InkLink href="/roadmap" className="text-sm text-gray-600 hover:text-black">Roadmap</InkLink></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><InkLink href="/about" className="text-sm text-gray-600 hover:text-black">About us</InkLink></li>
                  <li><InkLink href="/blog" className="text-sm text-gray-600 hover:text-black">Blog</InkLink></li>
                  <li><InkLink href="/careers" className="text-sm text-gray-600 hover:text-black">Careers</InkLink></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><InkLink href="/privacy" className="text-sm text-gray-600 hover:text-black">Privacy</InkLink></li>
                  <li><InkLink href="/terms" className="text-sm text-gray-600 hover:text-black">Terms</InkLink></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Mind Ink. All rights reserved.</p>
            </div>
          </div>
        </PaperEffect>
      </footer>
    </div>
  );
}

