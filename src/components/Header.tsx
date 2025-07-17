import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ArrowTrendingUpIcon, SparklesIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', id: 'home' },
    { 
      name: 'Services', 
      href: '/#services', 
      id: 'services',
      dropdown: true,
      items: [
        { name: 'Website Management', href: '/services/website-management', id: 'website-management' },
        { name: 'Facebook Ads', href: '/#facebook-ads', id: 'facebook-ads' },
        { name: 'Shopify Growth', href: '/#shopify', id: 'shopify' }
      ]
    },
    { name: 'Success Stories', href: '/#testimonials', id: 'testimonials' },
    { name: 'Trial', href: '/onboarding', id: 'trial', special: true },
    { name: 'Contact', href: '/#contact', id: 'contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string, id: string) => {
    if (href === '/') return location.pathname === '/';
    if (href === '/onboarding') return location.pathname === '/onboarding';
    if (href === '/services/website-management') return location.pathname === '/services/website-management';
    
    // For hash links, check if we're on the home page and the hash matches
    if (href.startsWith('/#')) {
      return location.pathname === '/' && window.location.hash === href.substring(1);
    }
    
    return false;
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (href.startsWith('/#')) {
      // Handle hash navigation
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50'
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                GrowthPro
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {item.special ? (
                  <Link
                    to={item.href}
                    className="group relative px-4 py-2 mx-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center"
                  >
                    <SparklesIcon className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                    {item.name}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith('/#')) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                    }}
                    className={`group relative px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive(item.href, item.id)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive(item.href, item.id) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Bottom border for active state */}
                    {isActive(item.href, item.id) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to="/onboarding"
                className="group bg-gradient-to-r from-slate-900 to-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:from-slate-800 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center"
              >
                Get Started
                <ArrowTrendingUpIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all duration-300"
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {item.special ? (
                      <Link
                        to={item.href}
                        className="flex items-center px-4 py-3 mx-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <SparklesIcon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith('/#')) {
                            e.preventDefault();
                            handleNavClick(item.href);
                          } else {
                            setIsMenuOpen(false);
                          }
                        }}
                        className={`block px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive(item.href, item.id)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.name}
                      </a>
                    )}
                  </motion.div>
                ))}
                
                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigation.length * 0.1, duration: 0.3 }}
                  className="pt-4 border-t border-slate-200/50 mx-2"
                >
                  <Link
                    to="/onboarding"
                    className="flex items-center justify-center bg-gradient-to-r from-slate-900 to-blue-900 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-slate-800 hover:to-blue-800 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                    <ArrowTrendingUpIcon className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;