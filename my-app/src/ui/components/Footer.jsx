import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black pt-24 pb-12 relative border-t border-yellow-500/20">
      {/* Scroll Top Button */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="w-14 h-14 rounded-full border border-yellow-500 bg-zinc-900 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          <ArrowUp size={22} />
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-yellow-500 mb-5">
              Sree Raaga
            </h2>

            <p className="text-gray-400 leading-relaxed text-sm">
              Where nature sings, life finds harmony. Experience the pinnacle
              of luxury surrounded by pristine natural beauty.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="uppercase tracking-[3px] text-xs text-white mb-6">
              Quick Links
            </h4>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/rooms"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Rooms
                </Link>
              </li>

              <li>
                <Link
                  to="/events"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Events
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="uppercase tracking-[3px] text-xs text-white mb-6">
              Contact Info
            </h4>

            <div className="space-y-3 text-gray-400 text-sm">
              <p>
                123 Luxury Avenue,
                <br />
                Forest Valley, Kerala
              </p>

              <a
                href="mailto:info@sreeraaga.com"
                className="block hover:text-yellow-500 transition"
              >
                info@sreeraaga.com
              </a>

              <a
                href="tel:+18001234567"
                className="block hover:text-yellow-500 transition"
              >
                +1 800 123 4567
              </a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="uppercase tracking-[3px] text-xs text-white mb-6">
              Newsletter
            </h4>

            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive offers and updates.
            </p>

            <form className="flex border-b border-yellow-500/30 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none text-white placeholder:text-gray-500"
              />

              <button
                type="button"
                className="text-yellow-500 uppercase text-xs tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-gray-500 text-xs tracking-wider">
            © {new Date().getFullYear()} SREE RAAGA RESORTS. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-yellow-500 transition"
            >
              Facebook
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-yellow-500 transition"
            >
              Instagram
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-yellow-500 transition"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;