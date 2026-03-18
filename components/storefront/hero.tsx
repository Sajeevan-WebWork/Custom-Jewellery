"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroImg from "@/legacy-src/assets/images/hero.png";

export function HeroSection() {
  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 z-0">
        <img src={HeroImg.src} alt="Luxury Jewellery" className="h-full w-full scale-105 object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.3em] text-accent-gold">Handcrafted Elegance</span>
            <h1 className="mb-8 text-5xl leading-tight text-white md:text-7xl">
              Where Every Jewel <br />
              <span className="italic">Tells a Story</span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-neutral-grey">
              Discover our collection of handcrafted luxury jewellery designed for timeless elegance and unforgettable moments.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link href="/products" className="group flex items-center justify-center bg-accent-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-bg-primary transition-colors hover:bg-white">
                Explore Collection
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
              </Link>
              <Link href="/products?category=Rings" className="flex items-center justify-center border border-accent-gold px-10 py-4 text-sm font-bold uppercase tracking-widest text-accent-gold transition-all hover:bg-accent-gold hover:text-bg-primary">
                View Best Sellers
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')] opacity-10" />
    </section>
  );
}
