import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RingImg from '../assets/images/ring.png';

const categories = [
  { name: 'Rings', image: RingImg, count: '12 Pieces', link: '/products?category=rings' },
  { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', count: '18 Pieces', link: '/products?category=necklaces' },
  { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', count: '15 Pieces', link: '/products?category=earrings' },
  { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', count: '10 Pieces', link: '/products?category=bracelets' },
  { name: 'Wedding', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800', count: '24 Pieces', link: '/products?category=wedding' },
  { name: 'Signature', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800', count: '8 Pieces', link: '/products?category=signature' },
];

const CategorySection = () => {
  return (
    <section className="py-24 bg-bg-content padding-block">
      <div className="container mx-auto px-6 my-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent-bronze uppercase tracking-[0.3em] text-xs font-bold mb-3 block"
          >
            Curated Selection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-text-dark"
          >
            Shop by Category
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={cat.link} className="group relative block aspect-[4/5] overflow-hidden rounded-sm">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                
                <div className="absolute bottom-10 left-10">
                  <span className="text-white/70 text-xs uppercase tracking-widest mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {cat.count}
                  </span>
                  <h3 className="text-2xl text-white font-serif tracking-wide group-hover:text-accent-gold transition-colors duration-500">
                    {cat.name}
                  </h3>
                </div>
                
                {/* Gold Border Glow Hover Effect */}
                <div className="absolute inset-0 border-0 group-hover:border-2 border-accent-gold/30 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
