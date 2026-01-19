import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-gray-700 py-2'}`}>
      <div className="container mx-auto  px-6 flex h-20 justify-between items-center">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-white">
          LUXE<span className="text-accent-gold">JEWELS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10 gap-10 text-sm uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <Link to="/products" className="hover:text-accent-gold transition-colors">Collection</Link>
          {/* <Link to="/about" className="hover:text-accent-gold transition-colors">Our Story</Link> */}
          {/* <Link to="/contact" className="hover:text-accent-gold transition-colors">Contact</Link> */}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <button className="text-white hover:text-accent-gold transition-colors hidden sm:block">
            {/* <Search size={20} /> */}
          </button>
          <button 
            className="text-white hover:text-accent-gold transition-colors relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-bg-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-bg-primary border-t border-white/10 p-6 flex flex-col space-y-6 text-center uppercase tracking-widest text-sm"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
