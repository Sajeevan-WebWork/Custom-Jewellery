"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";

export function StorefrontHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useStorefrontCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "glass py-4" : "bg-gray-700 py-2"}`}
    >
      <div className="container mx-auto flex h-12 items-center justify-between px-6">
        <button
          className="text-white lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link
          href="/"
          className="text-2xl font-serif font-bold tracking-widest text-white"
        >
          LUXE<span className="text-accent-gold">JEWELS</span>
        </Link>

        <div className="hidden items-center gap-10 text-sm font-medium uppercase tracking-widest lg:flex">
          <Link href="/" className="transition-colors hover:text-accent-gold">
            Home
          </Link>
          <Link
            href="/products"
            className="transition-colors hover:text-accent-gold"
          >
            Collection
          </Link>
        </div>

        <button
          className="relative text-white transition-colors hover:text-accent-gold"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag size={20} />
          {cartCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-[10px] font-bold text-bg-primary">
              {cartCount}
            </span>
          ) : null}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-full flex w-full flex-col space-y-6 bg-bg-primary p-6 text-center text-sm uppercase tracking-widest lg:hidden"
          >
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
              Collection
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
