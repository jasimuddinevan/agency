import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Process', href: '/#process' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Get Started', href: '/onboarding' },
  ];

  const services = [
    { name: 'Shopify Growth', href: '/#shopify' },
    { name: 'Facebook Ads', href: '/#facebook-ads' },
    { name: 'Website Design', href: '/#website-design' },
    { name: 'Business Strategy', href: '/#strategy' },
  ];

  return (
    <footer className="bg-gray-900 text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">GrowthPro</span>
            </Link>
            <p className="text-gray-400">
              Helping businesses grow through strategic digital solutions and proven marketing strategies.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                <span className="font-medium">Email:</span> hello@growthpro.com
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-medium">Address:</span> 123 Business Ave, Growth City, GC 12345
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest growth tips and strategies.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 GrowthPro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <p className="text-gray-400 text-sm">
              Developed by{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Your Developer
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;