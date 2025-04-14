"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-pm-nav-orange text-pm-white p-4 shadow-md z-20">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/planet_mado_logo-smaller.png" alt="Planet Mado" width={150} height={50} style={{ maxWidth: '6rem' }} priority />
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative group">
            <button className="text-white hover:text-gray-300 transition-colors duration-200 flex items-center">
              The RPG
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            <div className="absolute z-10 hidden bg-pm-white border border-gray-200 rounded-lg shadow-lg group-hover:block w-48 left-0 top-full hover:block">
              <Link href="/how-to-play" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">How to Play</Link>
              <Link href="/races" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Races</Link>
              <Link href="/planets" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Planets</Link>
              <Link href="/items" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Items</Link>
              <Link href="/basic-techniques" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Basic Techniques</Link>
              <Link href="/members" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Members</Link>
              <Link href="/join" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Join the RPG</Link>
              <Link href="/rule-book" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100">Rule Book</Link>
            </div>
          </div>
          <Link href="/about" className="text-white hover:text-gray-300 transition-colors duration-200">About</Link>
          <Link href="/forums" className="text-white hover:text-gray-300 transition-colors duration-200">Forums</Link>
          <Link href="/contact" className="text-white hover:text-gray-300 transition-colors duration-200">Contact</Link>
          {session ? (
            <>
              <Link href="/profile" className="text-white hover:text-gray-300 transition-colors duration-200">Profile</Link>
              <Link href="/characters" className="text-white hover:text-gray-300 transition-colors duration-200">Dashboard</Link>
              {session.user && session.user.email === 'admin@dbz.com' && (
                <Link href="/admin" className="text-white hover:text-gray-300 transition-colors duration-200">Admin</Link>
              )}
              <button onClick={() => signOut()} className="text-white hover:text-gray-300 transition-colors duration-200">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-white hover:text-gray-300 transition-colors duration-200">Log In</Link>
          )}
        </div>
        <button className="md:hidden text-pm-text-dark" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        {menuOpen && (
          <div className="md:hidden absolute inset-0 bg-pm-nav-orange z-50 flex flex-col items-center justify-center space-y-4 text-xl">
            <button className="absolute top-4 right-4 text-pm-text-dark" onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="relative group inline-block">
              <button className="text-white hover:text-gray-300 transition-colors duration-200 flex items-center">
                The RPG
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
              <div className="absolute z-10 hidden bg-pm-white border border-gray-200 rounded-lg shadow-lg group-hover:block w-48 left-0 top-full hover:block">
                <Link href="/how-to-play" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>How to Play</Link>
                <Link href="/races" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Races</Link>
                <Link href="/planets" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Planets</Link>
                <Link href="/items" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Items</Link>
                <Link href="/basic-techniques" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Basic Techniques</Link>
                <Link href="/members" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Members</Link>
                <Link href="/join" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Join the RPG</Link>
                <Link href="/rule-book" className="block px-4 py-2 text-pm-text-dark hover:bg-gray-100" onClick={toggleMenu}>Rule Book</Link>
              </div>
            </div>
            <Link href="/about" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>About</Link>
            <Link href="/forums" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Forums</Link>
            <Link href="/contact" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Contact</Link>
            {session ? (
              <>
                <Link href="/profile" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Profile</Link>
                <Link href="/characters" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Dashboard</Link>
                {session.user && session.user.email === 'admin@dbz.com' && (
                  <Link href="/admin" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Admin</Link>
                )}
                <button onClick={() => { signOut(); toggleMenu(); }} className="text-white hover:text-gray-300 transition-colors duration-200">Sign Out</button>
              </>
            ) : (
              <Link href="/auth/signin" className="text-white hover:text-gray-300 transition-colors duration-200" onClick={toggleMenu}>Log In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
