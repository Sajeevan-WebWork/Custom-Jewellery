"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RingImg from "@/legacy-src/assets/images/ring.png";

const categories = [
  { name: "Rings", image: RingImg.src, count: "12 Pieces", link: "/products?category=Rings" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800", count: "18 Pieces", link: "/products?category=Necklaces" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", count: "15 Pieces", link: "/products?category=Earrings" },
  { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", count: "10 Pieces", link: "/products?category=Bracelets" },
  { name: "Wedding", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800", count: "24 Pieces", link: "/products?category=Rings" },
  { name: "Signature", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800", count: "8 Pieces", link: "/products?category=Necklaces" },
];

export function CategorySection() {
  return (
    <section className="padding-block bg-bg-content py-24">
      <div className="container mx-auto my-6 px-6">
        <div className="mb-16 text-center">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-3 block text-xs font-bold uppercase tracking-[0.3em] text-accent-bronze">
            Curated Selection
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl text-text-dark md:text-5xl">
            Shop by Category
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={cat.link} className="group relative block aspect-[4/5] overflow-hidden rounded-sm">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
                <div className="absolute bottom-10 left-10">
                  <span className="mb-2 block translate-y-4 text-xs uppercase tracking-widest text-white/70 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {cat.count}
                  </span>
                  <h3 className="text-2xl tracking-wide text-white transition-colors duration-500 group-hover:text-accent-gold">{cat.name}</h3>
                </div>
                <div className="absolute inset-0 border-0 border-accent-gold/30 transition-all duration-500 group-hover:border-2" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
