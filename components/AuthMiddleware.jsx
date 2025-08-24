'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../lib/auth-store';

export default function AuthMiddleware({ children }) {
  const { isAuthenticated, isLoading, isInitialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Only redirect after initialization is complete
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  // Show loading while initializing or loading
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return children;
}

