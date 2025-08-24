'use client';

import { useEffect } from 'react';
import useAuthStore from './auth-store';

export default function ClientProviders({ children }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when the app loads
    initialize();
  }, [initialize]);

  return children;
}
