import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const bestSellers = [
  {
    id: 'bs-1',
    name: 'Eternal Diamond Ring',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    category: 'Rings'
  },
  {
    id: 'bs-2',
    name: 'Royal Emerald Necklace',
    price: 4800,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    category: 'Necklaces'
  },
  {
    id: 'bs-3',
    name: 'Celestial Gold Earrings',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    category: 'Earrings'
  },
  {
    id: 'bs-4',
    name: 'Infinite Grace Bracelet',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    category: 'Bracelets'
  }
];

const BestSellerSection = () => {
  const { addToCart } = useCart();

  return (
    <section className="py-24 bg-bg-primary">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-accent-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block"
            >
              Exquisite Craftsmanship
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest"
            >
              Our Best Sellers
            </motion.h2>
          </div>
          <Link to="/products" className="text-accent-gold uppercase tracking-widest text-sm border-b border-accent-gold/30 pb-1 hover:border-accent-gold transition-all">
            View All Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[4/5] bg-bg-content overflow-hidden mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Action Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex space-x-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-grow bg-bg-primary text-white py-3 px-4 uppercase tracking-widest text-[10px] font-bold hover:bg-accent-gold hover:text-bg-primary transition-all flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                  </button>
                  <Link 
                    to={`/products/${product.id}`}
                    className="bg-white/90 text-bg-primary p-3 hover:bg-white transition-all"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <span className="text-accent-bronze text-[10px] uppercase tracking-[0.2em] mb-2 block">{product.category}</span>
                <h3 className="text-white font-serif text-lg tracking-wide mb-2 group-hover:text-accent-gold transition-colors">{product.name}</h3>
                <div className="w-8 h-[1px] bg-accent-gold/30 mx-auto mb-2" />
                <p className="text-accent-gold font-medium">${product.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
