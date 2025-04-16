"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const HeroUIProvider = dynamic(() => import('@heroui/react').then(mod => mod.HeroUIProvider), { ssr: false });

interface HeroUIWrapperProps {
  children: React.ReactNode;
}

export function HeroUIWrapper({ children }: HeroUIWrapperProps) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}
