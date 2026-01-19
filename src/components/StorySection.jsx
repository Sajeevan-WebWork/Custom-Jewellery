import React from 'react';
import { motion } from 'framer-motion';

const StorySection = () => {
  return (
    <section className="py-0 overflow-hidden bg-bg-content">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Text Content */}
        <div className="flex items-center justify-center p-12 lg:p-24 bg-bg-content order-2 lg:order-1">
          <div className="max-w-md">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-accent-bronze uppercase tracking-[0.3em] text-xs font-bold mb-6 block"
            >
              Our Philosophy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-text-dark leading-snug mb-8"
            >
              Jewellery That <br />
              <span className="italic">Tells Your Story</span>
            </motion.h2>
            <div className="w-16 h-[1px] bg-accent-gold mb-8" />
            <p className="text-text-dark/80 text-lg leading-relaxed mb-10 italic font-italic">
              "Every piece is designed to celebrate your moments — love, milestones, and memories. We believe in jewellery that reflects the unique beauty within every woman."
            </p>
            <p className="text-text-dark/70 text-sm leading-relaxed mb-12 uppercase tracking-widest">
              refined, personal, unforgettable.
            </p>
            <button className="text-accent-bronze uppercase tracking-widest text-xs font-bold border-b-2 border-accent-gold pb-2 hover:text-text-dark hover:border-text-dark transition-all">
              Discover Our Process
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div className="h-[60vh] lg:h-auto overflow-hidden relative order-1 lg:order-2">
          <motion.img 
            src="https://images.unsplash.com/photo-1739194806935-3b4c66aee282?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Jewellery Lifestyle" 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-accent-gold/5" />
        </div>
      </div>
    </section>
  );
};

export default StorySection;
