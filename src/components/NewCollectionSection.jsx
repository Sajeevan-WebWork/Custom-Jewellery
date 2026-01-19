import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NewCollectionSection = () => {
  return (
    <section className="py-24 bg-bg-primary border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-5 relative z-10">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-accent-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
            >
              Limited Edition
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-serif text-white leading-tight mb-8"
            >
              The New <br />
              <span className="italic">Collection</span>
            </motion.h2>
            <p className="text-neutral-grey text-lg mb-10 leading-relaxed max-w-md">
              Inspired by modern elegance and timeless beauty, our latest collection features pieces that celebrate the subtle strength of feminine luxury.
            </p>
            <div className="h-[2px] w-20 bg-accent-gold mb-12" />
            <Link 
              to="/products"
              className="inline-block border border-accent-gold text-accent-gold px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-accent-gold hover:text-bg-primary transition-all"
            >
              Explore New Pieces
            </Link>
          </div>

          {/* Asymmetrical Image Layout */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="pt-20"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-sm relative group">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1679930784583-1b04b4ccb7fd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="New Collection 1" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="pb-20"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-sm relative group">
                <img 
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800" 
                  alt="New Collection 2" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
              </div>
            </motion.div>

            {/* Decorative Gold Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-t border-r border-accent-gold/20 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b border-l border-accent-gold/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCollectionSection;
