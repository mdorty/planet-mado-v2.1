"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';

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

const ChevronDown = ({fill, size, height, width, ...props}: {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
  [key: string]: any;
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar 
      isBordered 
      isMenuOpen={isMenuOpen} 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-[#CB5C0D] text-white shadow-md z-50"
      maxWidth="xl"
    >
      {/* Mobile menu toggle and brand for small screens */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <Image src="/images/planet_mado_logo-smaller.png" alt="Planet Mado" width={150} height={50} style={{ maxWidth: '6rem' }} priority />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop navigation */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link href="/" className="flex items-center">
            <Image src="/images/planet_mado_logo-smaller.png" alt="Planet Mado" width={150} height={50} style={{ maxWidth: '6rem' }} priority />
          </Link>
        </NavbarBrand>
        
        {/* The RPG Dropdown */}
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent font-roboto text-white"
                endContent={<ChevronDown fill="currentColor" size={16} />}
                radius="sm"
                variant="light"
              >
                The RPG
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="RPG features"
            className="w-[240px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {navLinks.map((link) => (
              <DropdownItem key={link.href}>
                <Link 
                  href={link.href} 
                  className="w-full font-roboto"
                >
                  {link.label}
                </Link>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link href="/about" className="font-roboto text-white">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/forums" className="font-roboto text-white">
            Forums
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact" className="font-roboto text-white">
            Contact
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/store" className="font-roboto text-white">
            Store
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Auth buttons */}
      <NavbarContent justify="end">
        {session ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <Link href="/profile" className="font-roboto text-white">
                Profile
              </Link>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Link href="/characters" className="font-roboto text-white">
                Characters
              </Link>
            </NavbarItem>
            {session.user.role === 'admin' && (
              <NavbarItem className="hidden sm:flex">
                <Link href="/admin" className="font-roboto text-white">
                  Staff
                </Link>
              </NavbarItem>
            )}
            <NavbarItem>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                color="default"
                variant="flat"
                className="font-roboto font-medium text-white bg-transparent border border-white"
              >
                Sign Out
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button 
              as={Link} 
              color="default" 
              href="/auth/signin" 
              variant="flat"
              className="font-roboto font-medium text-white bg-transparent border border-white"
            >
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-[#CB5C0D] pt-0 mt-0">
        <NavbarMenuItem>
          <Link 
            href="/" 
            className="w-full font-roboto text-white text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </NavbarMenuItem>
        
        {/* Mobile RPG dropdown items */}
        {navLinks.map((link, index) => (
          <NavbarMenuItem key={`${link.href}-${index}`}>
            <Link 
              href={link.href} 
              className="w-full font-roboto text-white text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
        
        <NavbarMenuItem>
          <Link 
            href="/about" 
            className="w-full font-roboto text-white text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            href="/forums" 
            className="w-full font-roboto text-white text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Forums
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            href="/contact" 
            className="w-full font-roboto text-white text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            href="/store" 
            className="w-full font-roboto text-white text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Store
          </Link>
        </NavbarMenuItem>
        
        {/* Conditional auth menu items */}
        {session ? (
          <>
            <NavbarMenuItem>
              <Link 
                href="/profile" 
                className="w-full font-roboto text-white text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link 
                href="/characters" 
                className="w-full font-roboto text-white text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Characters
              </Link>
            </NavbarMenuItem>
            {session.user?.role === 'admin' && (
              <NavbarMenuItem>
                <Link 
                  href="/admin" 
                  className="w-full font-roboto text-white text-lg py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Staff
                </Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <Link 
                href="#" 
                className="w-full font-roboto text-white text-lg py-2 text-danger"
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setIsMenuOpen(false);
                }}
              >
                Sign Out
              </Link>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Link 
              href="/auth/signin" 
              className="w-full font-roboto text-white text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
