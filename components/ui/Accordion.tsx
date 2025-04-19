"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
  titleClassName = "",
  contentClassName = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 text-left font-anton bg-pm-nav-orange text-white hover:opacity-90 transition-opacity ${titleClassName}`}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className={`p-4 bg-pm-blue ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
