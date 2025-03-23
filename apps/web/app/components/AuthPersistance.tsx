// Create a new file: app/state/authPersistence.tsx
'use client'

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { authState } from '@/app/state/authstate';

export function AuthPersistence() {
  const [isAuthenticated, setIsAuthenticated] = useAtom(authState);

  useEffect(() => {
    // Check for auth token on component mount
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  return null; // This component doesn't render anything
}