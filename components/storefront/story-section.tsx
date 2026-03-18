"use client";

import { motion } from "framer-motion";

export function StorySection() {
  return (
    <section className="overflow-hidden bg-bg-content py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 flex items-center justify-center bg-bg-content p-12 lg:order-1 lg:p-24">
          <div className="max-w-md">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-6 block text-xs font-bold uppercase tracking-[0.3em] text-accent-bronze">
              Our Philosophy
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8 text-4xl leading-snug text-text-dark md:text-5xl">
              Jewellery That <br />
              <span className="italic">Tells Your Story</span>
            </motion.h2>
            <div className="mb-8 h-[1px] w-16 bg-accent-gold" />
            <p className="mb-10 font-italic text-lg italic leading-relaxed text-text-dark/80">
              "Every piece is designed to celebrate your moments — love, milestones, and memories. We believe in jewellery that reflects the unique beauty within every woman."
            </p>
            <p className="mb-12 text-sm uppercase tracking-widest text-text-dark/70">refined, personal, unforgettable.</p>
            <button className="border-b-2 border-accent-gold pb-2 text-xs font-bold uppercase tracking-widest text-accent-bronze transition-all hover:border-text-dark hover:text-text-dark">
              Discover Our Process
            </button>
          </div>
        </div>

        <div className="relative order-1 h-[60vh] overflow-hidden lg:order-2 lg:h-auto">
          <motion.img
            src="https://images.unsplash.com/photo-1739194806935-3b4c66aee282?q=80&w=715&auto=format&fit=crop"
            alt="Jewellery Lifestyle"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-accent-gold/5" />
        </div>
      </div>
    </section>
  );
}
