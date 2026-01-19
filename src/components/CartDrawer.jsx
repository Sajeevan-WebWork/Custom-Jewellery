import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp';

const BUSINESS_PHONE = '8220512105'; // Replace with actual business phone

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState('cart'); // 'cart' or 'checkout'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isOrdering, setIsOrdering] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsOrdering(true);
    
    const encodedMessage = formatWhatsAppMessage(formData, cartItems, cartTotal);
    const whatsappUrl = getWhatsAppUrl(BUSINESS_PHONE, encodedMessage);
    
    // Small delay for luxury feel before redirect
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsOrdering(false);
      // Optional: clearCart(); or wait for user to come back
    }, 800);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-serif text-bg-primary uppercase tracking-widest flex items-center">
                {step === 'cart' ? (
                  <>
                    <ShoppingBag size={20} className="mr-3 text-accent-gold" />
                    Your Collection
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} className="mr-3 text-accent-gold cursor-pointer" onClick={() => setStep('cart')} />
                    Order Details
                  </>
                )}
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-bg-primary hover:text-accent-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6">
              {step === 'cart' ? (
                /* Cart Items List */
                cartItems.length > 0 ? (
                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex space-x-4 group">
                        <div className="w-24 h-32 bg-gray-50 overflow-hidden rounded-sm flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-serif text-bg-primary tracking-wide text-sm uppercase">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-accent-bronze text-xs uppercase tracking-widest mb-4">{item.category}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-gray-100 rounded-sm">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 px-2 hover:bg-gray-50 text-bg-primary"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-bold text-bg-primary">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 px-2 hover:bg-gray-50 text-bg-primary"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-accent-gold font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-serif text-bg-primary mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 text-sm mb-8">Discover our collection and start your story.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-accent-gold uppercase tracking-widest text-xs font-bold border-b-2 border-accent-gold pb-1"
                    >
                      Browse Collection
                    </button>
                  </div>
                )
              ) : (
                /* User Information Form */
                <form id="order-form" onSubmit={handlePlaceOrder} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-bg-primary/40 mb-2">Full Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full bg-gray-50 border-b border-gray-100 py-3 px-4 outline-none focus:border-accent-gold transition-colors text-bg-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-bg-primary/40 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 234 567 890"
                      className="w-full bg-gray-50 border-b border-gray-100 py-3 px-4 outline-none focus:border-accent-gold transition-colors text-bg-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-bg-primary/40 mb-2">Shipping Address</label>
                    <textarea 
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Street, City, Country"
                      className="w-full bg-gray-50 border-b border-gray-100 py-3 px-4 outline-none focus:border-accent-gold transition-colors text-bg-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-bg-primary/40 mb-2">Additional Notes (Optional)</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Special requests or gift messages"
                      className="w-full bg-gray-50 border-b border-gray-100 py-3 px-4 outline-none focus:border-accent-gold transition-colors text-bg-primary resize-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-bg-primary">
                  <span className="uppercase tracking-widest text-[10px] font-bold opacity-50">Subtotal</span>
                  <span className="font-serif text-xl">${cartTotal.toLocaleString()}</span>
                </div>
                
                {step === 'cart' ? (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="w-full bg-bg-primary text-white py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent-gold hover:text-bg-primary transition-all flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button 
                    type="submit"
                    form="order-form"
                    disabled={isOrdering}
                    className="w-full bg-accent-gold text-bg-primary py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-bg-primary hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isOrdering ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Place Order via WhatsApp
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                  {step === 'cart' ? 'Shipping and taxes calculated at checkout' : 'Finalize your order on WhatsApp'}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
