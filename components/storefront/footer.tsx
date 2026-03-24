import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-white/10 bg-bg-primary pb-10 pt-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold tracking-widest text-white">
              LUXE<span className="text-accent-gold">JEWELS</span>
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-grey">
              Handcrafted luxury jewellery designed for timeless elegance. Every
              piece tells a story of refined personal style.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-accent-gold transition-colors hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-accent-gold transition-colors hover:text-white"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-accent-gold transition-colors hover:text-white"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm uppercase tracking-wider text-neutral-grey">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-accent-gold"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-accent-gold"
                >
                  Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Customer Care
            </h4>
            <ul className="space-y-4 text-sm uppercase tracking-wider text-neutral-grey">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent-gold"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent-gold"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent-gold"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-accent-gold"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Get In Touch
            </h4>
            <ul className="space-y-4 text-sm text-neutral-grey">
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="mt-1 flex-shrink-0 text-accent-gold"
                />
                <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0 text-accent-gold" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0 text-accent-gold" />
                <span>info@luxejewels.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between space-y-4 border-t border-white/10 pt-8 text-xs tracking-widest text-neutral-grey md:flex-row md:space-y-0">
          <p className="uppercase">
            © 2026 RD Handmade bangles. Crafted with care.
          </p>
          <div>
            Developed by{" "}
            <Link
              href="https://heyitssajeevan.com/"
              className="text-accent-gold transition-colors hover:text-white"
            >
              heyitssajeevan.com
            </Link>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
