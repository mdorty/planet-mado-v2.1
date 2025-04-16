"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from '@heroui/react';

const navLinks = [
  { href: '/how-to-play', label: 'How to Play' },
  { href: '/races', label: 'Races' },
  { href: '/planets', label: 'Planets' },
  { href: '/items', label: 'Items' },
  { href: '/basic-techniques', label: 'Basic Techniques' },
  { href: '/members', label: 'Members' },
  { href: '/join', label: 'Join the RPG' },
  { href: '/rule-book', label: 'Rule Book' },
];

export function Navigation() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rpgDropdownOpen, setRpgDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleRpgDropdown = () => {
    setRpgDropdownOpen(!rpgDropdownOpen);
  };

  return (
    <Navbar className="p-4 shadow-md z-50" maxWidth="xl">
      <NavbarContent>
        <NavbarMenuToggle onClick={toggleMenu} className="md:hidden" />
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <Image src="/images/planet_mado_logo-smaller.png" alt="Planet Mado" width={150} height={50} style={{ maxWidth: '6rem' }} priority />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden md:flex justify-center" justify="center">
          <NavbarItem>
            <div className="relative group">
              <button className="flex items-center font-roboto">
                The RPG
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
              <div className="absolute top-10 left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 hidden group-hover:block md:w-48 w-full opacity-100">
                <Link href="/how-to-play" className="block px-4 py-2 hover:bg-gray-100 font-roboto">How to Play</Link>
                <Link href="/races" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Races</Link>
                <Link href="/planets" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Planets</Link>
                <Link href="/items" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Items</Link>
                <Link href="/basic-techniques" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Basic Techniques</Link>
                <Link href="/members" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Members</Link>
                <Link href="/join" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Join the RPG</Link>
                <Link href="/rule-book" className="block px-4 py-2 hover:bg-gray-100 font-roboto">Rule Book</Link>
              </div>
            </div>
          </NavbarItem>
          <NavbarItem>
            <Link href="/about" className="font-roboto transition-colors duration-200">About</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/forums" className="font-roboto transition-colors duration-200">Forums</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/contact" className="font-roboto transition-colors duration-200">Contact</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/store" className="font-roboto transition-colors duration-200">Store</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          {session ? (
            <>
              <NavbarItem className="hidden md:block">
                <Link href="/profile" className="font-roboto transition-colors duration-200">Profile</Link>
              </NavbarItem>
              <NavbarItem className="hidden md:block">
                <Link href="/characters" className="font-roboto transition-colors duration-200">Characters</Link>
              </NavbarItem>
              {session.user.role === 'admin' && (
                <NavbarItem className="hidden md:block">
                  <Link href="/admin" className="font-roboto transition-colors duration-200">Staff</Link>
                </NavbarItem>
              )}
              <NavbarItem>
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="solid"
                  className="hover:bg-gray-100 font-roboto font-medium"
                >
                  Sign Out
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem>
              <Link href="/auth/signin">
                <Button variant="solid" className="hover:bg-gray-100 font-roboto font-medium">
                  Sign In
                </Button>
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </NavbarContent>
      <NavbarMenu className="bg-[#CB5C0D] text-white pt-4 h-full w-full md:w-auto md:h-auto overflow-y-auto md:overflow-visible z-50">
        <NavbarMenuItem>
          <Link href="/" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <div className="relative group w-full">
            <button className="flex items-center justify-between w-full text-left font-roboto py-2 border-b border-gray-200" onClick={toggleRpgDropdown}>
              The RPG
              <svg className={`ml-1 w-5 h-5 transform ${rpgDropdownOpen ? 'rotate-180' : ''} transition-transform`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            <div className={`absolute left-0 mt-2 w-full bg-[#CB5C0D] shadow-lg rounded-lg ${rpgDropdownOpen ? 'opacity-100 block' : 'opacity-0 hidden'} transition-opacity duration-300 z-50 md:w-48 md:left-full md:top-0 md:mt-0 md:group-hover:block md:${rpgDropdownOpen ? 'block' : 'hidden'} `}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm font-roboto hover:bg-orange-700 rounded-t-lg" onClick={() => { setMenuOpen(false); setRpgDropdownOpen(false); }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/about" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/forums" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Forums
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/join" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Join
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/members" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Members
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/contact" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/store" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
            Store
          </Link>
        </NavbarMenuItem>
        {session ? (
          <>
            <NavbarMenuItem>
              <Link href="/profile" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/characters" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
                Characters
              </Link>
            </NavbarMenuItem>
            {session.user?.role === 'admin' && (
              <NavbarMenuItem>
                <Link href="/admin" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
                  Staff
                </Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMenuOpen(false);
                }}
                className="text-left font-roboto py-2 border-b border-gray-200 w-full"
              >
                Sign Out
              </button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Link href="/auth/signin" className="font-roboto py-2 border-b border-gray-200 w-full inline-block" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
