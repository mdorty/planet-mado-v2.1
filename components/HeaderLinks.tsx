'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export function HeaderLinks() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-to-play', label: 'How to Play' },
    { href: '/races', label: 'Races' },
    { href: '/planets', label: 'Planets' },
    { href: '/items', label: 'Items' },
    { href: '/basic-techniques', label: 'Basic Techniques' },
    { href: '/rule-book', label: 'Rule Book' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/join-the-rpg', label: 'Join the RPG' },
    { href: '/members', label: 'Members' },
    ...(session?.user?.role === 'admin' ? [{ href: '/staff', label: 'Staff' }] : []),
    ...(session?.user ? [{ href: '/profile', label: 'Profile' }] : []),
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <button
        className="md:hidden text-pm-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>
      <nav
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:flex md:items-center md:space-x-4 absolute md:static top-16 left-0 right-0 bg-pm-nav-orange md:bg-transparent p-4 md:p-0 z-10`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${
              pathname === link.href
                ? 'text-pm-white font-bold'
                : 'text-pm-white hover:text-gray-200'
            } transition-colors duration-200 block md:inline-block py-2 md:py-0`}
          >
            {link.label}
          </Link>
        ))}
        {session ? (
          <Link
            href="/api/auth/signout"
            className={`text-pm-white hover:text-gray-200 transition-colors duration-200 block md:inline-block py-2 md:py-0`}
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Out
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className={`text-pm-white hover:text-gray-200 transition-colors duration-200 block md:inline-block py-2 md:py-0`}
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
        )}
      </nav>
    </>
  );
}