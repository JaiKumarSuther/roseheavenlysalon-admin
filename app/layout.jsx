import './globals.css';
import Toaster from '../components/Toaster.jsx';
import ClientProviders from '../lib/client-providers.jsx';

export const metadata = {
  title: 'Rose Heavenly Salon - Admin Portal',
  description: 'Admin portal for managing salon bookings and customers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-hero min-h-screen">
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
