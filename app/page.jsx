'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../lib/auth-store';

export default function HomePage() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Only redirect after initialization is complete
    if (isInitialized) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

