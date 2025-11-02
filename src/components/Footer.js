import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Browse Products', path: '/products' },
      { name: 'Become a Vendor', path: '/register' },
      { name: 'How It Works', path: '#' },
      { name: 'Pricing', path: '#' },
    ],
    support: [
      { name: 'Help Center', path: '#' },
      { name: 'Safety Tips', path: '#' },
      { name: 'Contact Us', path: '#' },
      { name: 'FAQs', path: '#' },
    ],
    company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Press', path: '#' },
      { name: 'Blog', path: '#' },
    ],
    legal: [
      { name: 'Terms of Service', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Cookie Policy', path: '#' },
      { name: 'Disclaimer', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-primary-500 to-lightGreen-500 p-2 rounded-lg"
              >
                <FiShoppingBag className="text-white text-xl" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-lightGreen-600 bg-clip-text text-transparent">
                MUBAEXPRESS
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Nigeria's #1 student marketplace. Buy and sell textbooks, electronics, furniture, and more within your university community.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FiMail className="text-primary-600 dark:text-primary-400" />
                <span>support@studentmart.ng</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="text-primary-600 dark:text-primary-400" />
                <span>+234 800 STUDENT</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-primary-600 dark:text-primary-400" />
                <span>kaduna, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-50 to-lightGreen-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get the latest deals and campus marketplace news
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
              <span>© {currentYear} MUBAEXPRESS. Made with</span>
              <FiHeart className="text-red-500 fill-current" />
              <span>for Nigerian Students</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Secure payments via:</span>
            <img src="https://paystack.com/assets/img/logo/paystack-badge-cards-ngn.png" alt="Paystack" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;