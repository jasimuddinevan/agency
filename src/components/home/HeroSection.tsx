import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ShoppingCartIcon, 
  MegaphoneIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const services = [
    {
      icon: ShieldCheckIcon,
      title: "Website Management",
      description: "24/7 monitoring & security"
    },
    {
      icon: ShoppingCartIcon,
      title: "Shopify Acceleration",
      description: "Zero to $10K profit roadmap"
    },
    {
      icon: MegaphoneIcon,
      title: "Facebook Ads Mastery",
      description: "10X sales growth strategies"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#2560E5] via-[#1F44B6] to-[#2560E5] text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2560E5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1F44B6]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#2560E5]/5 to-[#1F44B6]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          {/* Main Headline */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Kick out hassle in your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                business
              </span>
            </h1>
            <div className="text-2xl lg:text-3xl font-semibold text-blue-200 mb-4">
              From Strategy to Success
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-slate-300 leading-relaxed"
          >
            Stop worrying about website security, performance, and marketing. Our expert team handles everything 24/7 while you focus on growing your business.
          </motion.p>

          {/* Animated Services */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
              >
                <service.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-slate-300">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              to="/onboarding"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 inline-flex items-center"
            >
              Get Started Now
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button className="group flex items-center text-white hover:text-blue-300 transition-colors duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3 group-hover:bg-white/30 transition-all duration-300">
                <PlayIcon className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">Watch Demo</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400"
          >
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white mr-2">500+</div>
              <div>Businesses Served</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white mr-2">$10M+</div>
              <div>Revenue Generated</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white mr-2">24/7</div>
              <div>Expert Support</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;