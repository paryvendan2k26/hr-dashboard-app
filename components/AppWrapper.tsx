// src/components/AppWrapper.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa'; // For loading indicator

interface AppWrapperProps {
  children: React.ReactNode;
}

const publicPaths = ['/login']; // Paths that don't require authentication

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be known

    const isPublicPath = publicPaths.includes(pathname);

    if (isAuthenticated && isPublicPath) {
      router.replace('/'); // Logged in, trying to go to login -> redirect to dashboard
    } else if (!isAuthenticated && !isPublicPath) {
      router.replace('/login'); // Not logged in, trying to access protected -> redirect to login
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // If auth state is still loading, or we are redirecting, show spinner
  if (isLoading || (!isAuthenticated && !publicPaths.includes(pathname)) || (isAuthenticated && publicPaths.includes(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
        <p className="ml-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  // Otherwise, render the children (your app content)
  return <>{children}</>;
}