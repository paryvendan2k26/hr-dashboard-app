// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BookmarkProvider } from '../../context/BookmarkContext';
import { AuthProvider } from '../../context/AuthContext'; // Import AuthProvider
import AppWrapper from '../../components/AppWrapper'; // Import AppWrapper
import { HeaderContent } from '../../components/HeaderContent'; // Import HeaderContent

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HR Dashboard',
  description: 'A mini HR performance dashboard built with Next.js, React, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          <AppWrapper> {/* This component handles auth redirects and conditional rendering */}
            <HeaderContent /> {/* Your header, now a client component */}

            <main className="p-4 container mx-auto bg-white rounded-lg shadow-xl my-6 min-h-[calc(100vh-140px)]">
              <BookmarkProvider>
                {children}
              </BookmarkProvider>
            </main>
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}