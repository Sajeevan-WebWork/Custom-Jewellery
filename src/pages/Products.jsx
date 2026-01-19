import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import RingImg from '../assets/images/ring.png';

const ALL_PRODUCTS = [
  { id: 1, name: 'Eternal Diamond Ring', price: 2450, category: 'Rings', image: RingImg, metal: 'Gold', occasion: 'Wedding' },
  { id: 2, name: 'Royal Emerald Necklace', price: 4800, category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', metal: 'Gold', occasion: 'Occasion' },
  { id: 3, name: 'Celestial Gold Earrings', price: 1200, category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', metal: 'Gold', occasion: 'Daily' },
  { id: 4, name: 'Infinite Grace Bracelet', price: 3200, category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', metal: 'Silver', occasion: 'Gift' },
  { id: 5, name: 'Princess Cut Studs', price: 950, category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', metal: 'Silver', occasion: 'Daily' },
  { id: 6, name: 'Solitaire Engagement Ring', price: 5600, category: 'Rings', image: RingImg, metal: 'Platinum', occasion: 'Wedding' },
  { id: 7, name: 'Vintage Pearl Necklace', price: 1800, category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', metal: 'Gold', occasion: 'Occasion' },
  { id: 8, name: 'Modern Cuff Bracelet', price: 1450, category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', metal: 'Rose Gold', occasion: 'Modern' },
];

const Products = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMetal, setSelectedMetal] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];
  const metals = ['All', 'Gold', 'Silver', 'Platinum', 'Rose Gold'];

  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesMetal = selectedMetal === 'All' || p.metal === selectedMetal;
      return matchesSearch && matchesCategory && matchesMetal;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [searchTerm, selectedCategory, selectedMetal, sortBy]);

  return (
    <div className="pt-24 min-h-screen bg-bg-content">
      {/* Header */}
      <div className="bg-bg-primary py-24 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif text-white uppercase tracking-[0.2em] mb-4"
        >
          Our Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-accent-gold uppercase tracking-widest text-sm"
        >
          Discover refined luxury in every detail.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar - Desktop */}
          <aside className={`lg:w-64 space-y-10 transition-all duration-500 ${isFilterOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 w-0 overflow-hidden hidden lg:block'}`}>
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search jewels..." 
                className="w-full bg-transparent border-b border-accent-gold/30 py-2 pl-8 text-text-dark focus:border-accent-gold outline-none transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-0 top-2 text-accent-gold" size={18} />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-text-dark font-bold text-xs uppercase tracking-widest mb-6 pb-2 border-b border-text-dark/10">Categories</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <span className={`w-3 h-3 rounded-full border border-accent-gold transition-all ${selectedCategory === cat ? 'bg-accent-gold' : 'group-hover:bg-accent-gold/20'}`} />
                    <span className={`text-sm uppercase tracking-wider transition-colors ${selectedCategory === cat ? 'text-accent-gold font-bold' : 'text-text-dark/60'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metal Type */}
            <div>
              <h4 className="text-text-dark font-bold text-xs uppercase tracking-widest mb-6 pb-2 border-b border-text-dark/10">Metal Type</h4>
              <div className="space-y-3">
                {metals.map(metal => (
                  <label key={metal} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="metal" 
                      className="hidden"
                      checked={selectedMetal === metal}
                      onChange={() => setSelectedMetal(metal)}
                    />
                    <span className={`w-3 h-3 rounded-full border border-accent-gold transition-all ${selectedMetal === metal ? 'bg-accent-gold' : 'group-hover:bg-accent-gold/20'}`} />
                    <span className={`text-sm uppercase tracking-wider transition-colors ${selectedMetal === metal ? 'text-accent-gold font-bold' : 'text-text-dark/60'}`}>
                      {metal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Sorting & Filter Toggle */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-text-dark/10">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-text-dark uppercase tracking-widest text-xs font-bold hover:text-accent-gold transition-colors"
              >
                <Filter size={16} />
                <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-[10px] uppercase tracking-widest text-text-dark/40 font-bold">Sort By</span>
                <select 
                  className="bg-transparent text-text-dark uppercase tracking-widest text-xs font-bold outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="best">Best Seller</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] bg-white overflow-hidden mb-6 shadow-sm">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                      
                      {/* Quick Add */}
                      <button 
                        onClick={() => addToCart(product)}
                        className="absolute bottom-4 left-4 right-4 bg-bg-primary text-white py-3 px-4 uppercase tracking-widest text-[10px] font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent-gold hover:text-bg-primary flex items-center justify-center space-x-2"
                      >
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-accent-bronze text-[10px] uppercase tracking-[0.2em] mb-2 block">{product.category}</span>
                      <h3 className="text-text-dark font-serif text-lg tracking-wide mb-2 group-hover:text-accent-gold transition-colors">{product.name}</h3>
                      <p className="text-accent-gold font-medium">${product.price.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <h3 className="text-2xl font-serif text-text-dark/40 italic">No pieces found matching your criteria.</h3>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedMetal('All');}}
                    className="mt-6 text-accent-gold uppercase tracking-widest text-xs font-bold border-b border-accent-gold pb-1"
                >
                    Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
