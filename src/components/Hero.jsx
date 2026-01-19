import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroImg from '../assets/images/hero.png';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-bg-primary">
      {/* Background with soft vignette */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HeroImg} 
          alt="Luxury Jewellery" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-accent-gold uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
              Handcrafted Elegance
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
              Where Every Jewel <br />
              <span className="italic">Tells a Story</span>
            </h1>
            <p className="text-neutral-grey text-lg mb-10 max-w-lg leading-relaxed">
              Discover our collection of handcrafted luxury jewellery designed for timeless elegance and unforgettable moments.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/products"
                className="bg-accent-gold text-bg-primary px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors flex items-center justify-center group"
              >
                Explore Collection
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link 
                to="/products?filter=best-seller"
                className="border border-accent-gold text-accent-gold px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-accent-gold hover:text-bg-primary transition-all flex items-center justify-center"
              >
                View Best Sellers
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]" />
    </section>
  );
};

export default Hero;
