"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function NewCollectionSection() {
  return (
    <section className="overflow-hidden border-t border-white/5 bg-bg-primary py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-5">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-accent-gold">
              Limited Edition
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8 text-5xl leading-tight text-white md:text-6xl">
              The New <br />
              <span className="italic">Collection</span>
            </motion.h2>
            <p className="mb-10 max-w-md text-lg leading-relaxed text-neutral-grey">
              Inspired by modern elegance and timeless beauty, our latest collection features pieces that celebrate the subtle strength of feminine luxury.
            </p>
            <div className="mb-12 h-[2px] w-20 bg-accent-gold" />
            <Link href="/products" className="inline-block border border-accent-gold px-12 py-5 text-sm font-bold uppercase tracking-widest text-accent-gold transition-all hover:bg-accent-gold hover:text-bg-primary">
              Explore New Pieces
            </Link>
          </div>

          <div className="relative grid grid-cols-2 gap-6 lg:col-span-7">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="pt-20">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-sm">
                <img src="https://plus.unsplash.com/premium_photo-1679930784583-1b04b4ccb7fd?q=80&w=880&auto=format&fit=crop" alt="New Collection 1" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/0" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="pb-20">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-sm">
                <img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800" alt="New Collection 2" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/0" />
              </div>
            </motion.div>

            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 border-r border-t border-accent-gold/20" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 border-b border-l border-accent-gold/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
