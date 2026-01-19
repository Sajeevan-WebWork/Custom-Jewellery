import React from 'react';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-bg-primary border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold tracking-widest text-white">
              LUXE<span className="text-accent-gold">JEWELS</span>
            </h3>
            <p className="text-neutral-grey text-sm leading-relaxed max-w-xs">
              Handcrafted luxury jewellery designed for timeless elegance. Every piece tells a story of refined personal style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-accent-gold hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-accent-gold hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-accent-gold hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4 text-neutral-grey text-sm uppercase tracking-wider">
              <li><Link to="/" className="hover:text-accent-gold transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-accent-gold transition-colors">Collection</Link></li>
              {/* <li><Link to="/about" className="hover:text-accent-gold transition-colors">About Us</Link></li> */}
              {/* <li><Link to="/contact" className="hover:text-accent-gold transition-colors">Contact</Link></li> */}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Customer Care</h4>
            <ul className="space-y-4 text-neutral-grey text-sm uppercase tracking-wider">
              <li><a href="#" className="hover:text-accent-gold transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-accent-gold transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-accent-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent-gold transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Get In Touch</h4>
            <ul className="space-y-4 text-neutral-grey text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent-gold mt-1 flex-shrink-0" />
                <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent-gold flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent-gold flex-shrink-0" />
                <span>info@luxejewels.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-grey uppercase tracking-widest space-y-4 md:space-y-0">
          <p>© 2026 Luxury Jewellery. Crafted with care.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
