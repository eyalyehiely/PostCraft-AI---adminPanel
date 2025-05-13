"use client"
import Link from 'next/link'
import { Home, Globe, History, User } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isSidebarOpen &&
        !target.closest(".sidebar") &&
        !target.closest(".menu-button")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <header className="sticky top-0 z-30 bg-card backdrop-blur-md border-b border-border w-full dark:bg-black">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left side - Page Title */}
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-foreground ml-12">
            PostCraft AI
          </h1>
        </div>
      </div>
    </header>
  );
} 