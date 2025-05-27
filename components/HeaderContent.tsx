// src/components/HeaderContent.tsx
'use client';

import Link from 'next/link';
import { FaBuilding, FaHome, FaBookmark, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { usePathname } from 'next/navigation'; // To highlight active link

export function HeaderContent() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: FaHome },
    { href: '/bookmarks', label: 'Bookmarks', icon: FaBookmark },
    { href: '/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  return (
    <header className="bg-gray-900 text-white py-5 shadow-xl">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <Link
          href="/"
          className="text-3xl font-extrabold mb-3 sm:mb-0 hover:text-gray-200 transition-colors duration-200 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-1"
        >
          <FaBuilding className="text-indigo-400 text-2xl" />
          HR Dashboard
        </Link>

        {isAuthenticated && ( // Only show navigation if authenticated
          <nav className="flex items-center gap-4 mt-3 sm:mt-0">
            <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        flex items-center px-4 py-2 rounded-md transition-colors duration-200
                        font-medium text-lg
                        ${isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent className="mr-2" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Logout Button */}
            <button
              onClick={logout}
              className="ml-4 flex items-center px-4 py-2 rounded-full text-sm font-medium
                         bg-red-600 hover:bg-red-700 text-white shadow-md
                         transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}