"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from '@heroui/react';

export function Navigation() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Navbar className="p-4 shadow-md z-20" maxWidth="xl">
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
              <div className="absolute z-30 border border-gray-200 rounded-lg shadow-lg hidden group-hover:block w-48 left-0 top-full opacity-100">
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
      <NavbarMenu className={`md:hidden pt-4 pb-8 px-6 space-y-6 overflow-auto z-10 ${menuOpen ? 'block' : 'hidden'}`}> 
        <NavbarMenuItem>
          <div className="relative group w-full">
            <button className="flex items-center justify-between w-full text-left font-roboto py-2 border-b border-gray-200">
              The RPG
              <svg className="ml-1 w-5 h-5 transform group-hover:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            <div className="bg-white w-full left-0 top-full opacity-100 group-hover:block space-y-1 pt-2 pb-4 px-2">
              <Link href="/how-to-play" className="block py-2 hover:bg-gray-100 font-roboto">How to Play</Link>
              <Link href="/races" className="block py-2 hover:bg-gray-100 font-roboto">Races</Link>
              <Link href="/planets" className="block py-2 hover:bg-gray-100 font-roboto">Planets</Link>
              <Link href="/items" className="block py-2 hover:bg-gray-100 font-roboto">Items</Link>
              <Link href="/basic-techniques" className="block py-2 hover:bg-gray-100 font-roboto">Basic Techniques</Link>
              <Link href="/members" className="block py-2 hover:bg-gray-100 font-roboto">Members</Link>
              <Link href="/join" className="block py-2 hover:bg-gray-100 font-roboto">Join the RPG</Link>
              <Link href="/rule-book" className="block py-2 hover:bg-gray-100 font-roboto">Rule Book</Link>
            </div>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/about" className="block py-2 border-b border-white/30 text-white font-roboto">About</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/forums" className="block py-2 border-b border-white/30 text-white font-roboto">Forums</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/contact" className="block py-2 border-b border-white/30 text-white font-roboto">Contact</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/store" className="block py-2 border-b border-white/30 text-white font-roboto">Store</Link>
        </NavbarMenuItem>
        {session ? (
          <>
            <NavbarMenuItem>
              <Link href="/profile" className="block py-2 border-b border-white/30 text-white font-roboto">Profile</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/characters" className="block py-2 border-b border-white/30 text-white font-roboto">Characters</Link>
            </NavbarMenuItem>
            {session.user.role === 'admin' && (
              <NavbarMenuItem>
                <Link href="/admin" className="block py-2 border-b border-white/30 text-white font-roboto">Staff</Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="solid"
                className="hover:bg-gray-100 font-roboto font-medium w-full text-left justify-start py-2"
              >
                Sign Out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Link href="/auth/signin">
              <Button variant="solid" className="hover:bg-gray-100 font-roboto font-medium w-full text-left justify-start py-2">
                Sign In
              </Button>
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
