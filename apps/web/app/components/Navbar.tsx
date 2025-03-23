"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/ui/components/dialog";
import {SignupSigninForm} from "@/app/components/SignupSigninForm";
import { PaperEffect } from "@/ui/components/paperEffect";
import { InkButton } from "@/ui/components/inkButton";
import { InkLink } from "@/ui/components/inkLink";
import { authState } from "@/app/state/authstate";
import { useAtom } from 'jotai';
import { modalOpenState } from "../state/modalOpenState";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useAtom(authState);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [authType, setAuthType] = useAtom(modalOpenState);
    const router = useRouter();
    
    useEffect(() => {
        if (authType === undefined) {
            setDialogOpen(false);
        }
    }, [authType]);

    const handleLogout = () => {
        // Remove the token when logging out
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        router.push('/');
    };
  
    const openDialog = (type: 'signin' | 'signup' | undefined) => {
      setAuthType(type);
      setDialogOpen(true);
    };

    return (
        <div>
            <header className="font-handwritten text-2xl transform container mx-auto px-4 py-6">
            <PaperEffect intensity={5}>
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-handwritten font-bold">Mind Ink</h1>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <InkLink href="/dashboard" className="hover:text-gray-700">Dashboard</InkLink>
                  <InkLink href="/features" className="hover:text-gray-700">Features</InkLink>
                  <InkLink href="/about-us" className="hover:text-gray-700">About us</InkLink>
                  <InkLink href="/pricing" className="hover:text-gray-700">Pricing</InkLink>
                  <InkLink href="/contact-us" className="hover:text-gray-700">Contact us</InkLink>
                </nav>
                <div className="flex space-x-3">
                 {isAuthenticated ? (
                    <InkButton variant="outline" onClick={handleLogout} className="px-4 py-2 text-sm">Sign Out</InkButton>
                  ) : (
                    <>
                      <InkButton variant="outline" onClick={() => openDialog('signin')} className="px-4 py-2 text-sm">Log in</InkButton>
                      <InkButton onClick={() => openDialog('signup')} className="px-4 py-2 text-sm">Sign Up</InkButton>
                    </>
                  )}
                </div>
              </div>
            </PaperEffect>
          </header>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent className='border-none' >
                    <PaperEffect>
                      <DialogHeader>
                        <DialogTitle>{authType === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
                      </DialogHeader>
                      <div className="p-6 space-y-4">
                       {authType && <SignupSigninForm type={authType} onSuccess={() => setDialogOpen(false)} />}
                      </div>
                    </PaperEffect>
                  </DialogContent>
                </Dialog>
        </div>
    );
}