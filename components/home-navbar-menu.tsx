"use client";

import Link from "next/link";
import { LogoButton } from "./ui/logo-button";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";

export function HomeNavbarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <LogoButton />
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="cursor-pointer">
                Home
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="ghost" className="cursor-pointer">
                Compare Cities
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="cursor-pointer">
                About
              </Button>
            </Link>
          </nav>
          <div className="md:hidden relative" ref={menuRef}>
            <button className="p-2" onClick={() => setIsOpen((prev) => !prev)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isOpen && (
              <nav
                className="absolute mt-2 flex flex-col gap-2 bg-white"
                style={{ left: "-80px" }}
              >
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                  >
                    Home
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                  >
                    Compare Cities
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                  >
                    About
                  </Button>
                </Link>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
