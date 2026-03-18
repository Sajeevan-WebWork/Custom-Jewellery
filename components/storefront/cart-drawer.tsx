"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStorefrontCart } from "@/context/StorefrontCartContext";
import { formatWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { saveOrderAction } from "@/app/actions/save-order";

const BUSINESS_PHONE = "8220512105";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useStorefrontCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOrdering(true);
    setOrderError("");

    try {
      // Save order to Supabase using server action
      const result = await saveOrderAction(formData, cartItems, cartTotal);

      if (!result.success) {
        setOrderError(result.error || "Failed to save order");
        setIsOrdering(false);
        return;
      }

      // Format and send WhatsApp message
      const encodedMessage = formatWhatsAppMessage(
        formData,
        cartItems,
        cartTotal,
      );
      const whatsappUrl = getWhatsAppUrl(BUSINESS_PHONE, encodedMessage);

      window.setTimeout(() => {
        window.open(whatsappUrl, "_blank");

        // Clear cart and reset form after opening WhatsApp
        clearCart();
        setFormData({ name: "", phone: "", address: "", notes: "" });
        setStep("cart");
        setIsCartOpen(false);
        setIsOrdering(false);
      }, 800);
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Error placing order",
      );
      setIsOrdering(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center text-xl font-serif uppercase tracking-widest text-bg-primary">
                {step === "cart" ? (
                  <>
                    <ShoppingBag size={20} className="mr-3 text-accent-gold" />
                    Your Collection
                  </>
                ) : (
                  <>
                    <ArrowLeft
                      size={20}
                      className="mr-3 cursor-pointer text-accent-gold"
                      onClick={() => setStep("cart")}
                    />
                    Order Details
                  </>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-bg-primary transition-colors hover:text-accent-gold"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {step === "cart" ? (
                cartItems.length > 0 ? (
                  <div className="space-y-8">
                    {cartItems.map((item) => (
                      <div key={item.id} className="group flex space-x-4">
                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="mb-1 flex items-start justify-between">
                            <h3 className="font-serif text-sm uppercase tracking-wide text-bg-primary">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-300 transition-colors hover:text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="mb-4 text-xs uppercase tracking-widest text-accent-bronze">
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-sm border border-gray-100">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-1 px-2 text-bg-primary hover:bg-gray-50"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-bold text-bg-primary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-1 px-2 text-bg-primary hover:bg-gray-50"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-accent-gold">
                              ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                      <ShoppingBag size={32} className="text-gray-200" />
                    </div>
                    <h3 className="mb-2 text-xl font-serif text-bg-primary">
                      Your cart is empty
                    </h3>
                    <p className="mb-8 text-sm text-gray-400">
                      Discover our collection and start your story.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="border-b-2 border-accent-gold pb-1 text-xs font-bold uppercase tracking-widest text-accent-gold"
                    >
                      Browse Collection
                    </button>
                  </div>
                )
              ) : (
                <form
                  id="order-form"
                  onSubmit={handlePlaceOrder}
                  className="space-y-6"
                >
                  {orderError && (
                    <div className="rounded bg-red-50 p-3 text-sm text-red-600">
                      {orderError}
                    </div>
                  )}

                  {[
                    {
                      name: "name",
                      label: "Full Name",
                      type: "text",
                      placeholder: "Enter your name",
                    },
                    {
                      name: "phone",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "e.g. +1 234 567 890",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-bg-primary/40">
                        {field.label}
                      </label>
                      <input
                        required
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as "name" | "phone"]}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            [field.name]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        className="w-full border-b border-gray-100 bg-gray-50 px-4 py-3 text-bg-primary outline-none transition-colors focus:border-accent-gold"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-bg-primary/40">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          address: event.target.value,
                        }))
                      }
                      placeholder="Street, City, Country"
                      className="w-full resize-none border-b border-gray-100 bg-gray-50 px-4 py-3 text-bg-primary outline-none transition-colors focus:border-accent-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-bg-primary/40">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Special requests or gift messages"
                      className="w-full resize-none border-b border-gray-100 bg-gray-50 px-4 py-3 text-bg-primary outline-none transition-colors focus:border-accent-gold"
                    />
                  </div>
                </form>
              )}
            </div>

            {cartItems.length > 0 ? (
              <div className="space-y-4 border-t border-gray-100 p-6">
                <div className="flex items-center justify-between text-bg-primary">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>

                {step === "cart" ? (
                  <button
                    onClick={() => setStep("checkout")}
                    className="flex w-full items-center justify-center bg-bg-primary py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-accent-gold hover:text-bg-primary"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="order-form"
                    disabled={isOrdering}
                    className="flex w-full items-center justify-center bg-accent-gold py-4 text-xs font-bold uppercase tracking-[0.2em] text-bg-primary transition-all hover:bg-bg-primary hover:text-white disabled:opacity-50"
                  >
                    {isOrdering ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="h-5 w-5 rounded-full border-2 border-bg-primary border-t-transparent"
                      />
                    ) : (
                      <>
                        Place Order via WhatsApp
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </button>
                )}

                <p className="text-center text-[10px] uppercase tracking-widest text-gray-400">
                  {step === "cart"
                    ? "Shipping and taxes calculated at checkout"
                    : "Finalize your order on WhatsApp"}
                </p>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
