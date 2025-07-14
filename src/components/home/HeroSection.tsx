import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ShoppingCartIcon, 
  MegaphoneIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);
  const y3 = useTransform(scrollY, [0, 300], [0, -70]);

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

  // Animation variants for floating elements
  const floatingAnimation = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation2 = {
    animate: {
      y: [20, -20, 20],
      x: [10, -10, 10],
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }
    }
  };

  const floatingAnimation3 = {
    animate: {
      y: [-15, 15, -15],
      x: [-5, 15, -5],
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#2560E5] via-[#1F44B6] to-[#2560E5] text-white overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating circle with parallax */}
        <motion.div
          style={{ y: y1 }}
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#2560E5]/20 to-[#1F44B6]/10 rounded-full blur-3xl"
        />
        
        {/* Medium floating circle with parallax */}
        <motion.div
          style={{ y: y2 }}
          variants={floatingAnimation2}
          animate="animate"
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-[#1F44B6]/15 to-[#2560E5]/10 rounded-full blur-3xl"
        />
        
        {/* Central large blur with parallax */}
        <motion.div
          style={{ y: y3 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#2560E5]/8 to-[#1F44B6]/8 rounded-full blur-3xl"
        />

        {/* Geometric floating shapes */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-white/10 rounded-lg backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(37, 96, 229, 0.1), rgba(31, 68, 182, 0.1))'
          }}
        />
        
        <motion.div
          variants={floatingAnimation2}
          animate="animate"
          className="absolute bottom-1/3 left-1/5 w-16 h-16 border-2 border-white/10 rounded-full backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 68, 182, 0.1), rgba(37, 96, 229, 0.1))'
          }}
        />
        
        <motion.div
          variants={floatingAnimation3}
          animate="animate"
          className="absolute top-2/3 right-1/5 w-12 h-12 border-2 border-white/10 transform rotate-45 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(37, 96, 229, 0.1), rgba(31, 68, 182, 0.1))'
          }}
        />

        {/* Additional subtle floating dots */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/3 left-1/3 w-3 h-3 bg-white/20 rounded-full"
        />
        
        <motion.div
          variants={floatingAnimation2}
          animate="animate"
          className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/30 rounded-full"
        />
        
        <motion.div
          variants={floatingAnimation3}
          animate="animate"
          className="absolute top-1/2 left-1/6 w-4 h-4 bg-white/15 rounded-full"
        />

        {/* Animated gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-transparent via-[#2560E5]/5 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          {/* Main Headline */}
          <motion.div variants={fadeInUp} className="mb-8">
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Kick out hassle in your{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                business
              </motion.span>
            </motion.h1>
            <motion.div 
              className="text-2xl lg:text-3xl font-semibold text-blue-200 mb-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              From Strategy to Success
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto text-slate-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
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
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.2, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">{service.title}</h3>
                <p className="text-slate-300 group-hover:text-blue-100 transition-colors duration-300">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/onboarding"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 inline-flex items-center relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started Now</span>
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              </Link>
            </motion.div>
            
            <motion.button 
              className="group flex items-center text-white hover:text-blue-300 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-3 group-hover:bg-white/30 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <PlayIcon className="h-6 w-6" />
              </motion.div>
              <span className="text-lg font-medium">Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            {[
              { number: '500+', label: 'Businesses Served' },
              { number: '$10M+', label: 'Revenue Generated' },
              { number: '24/7', label: 'Expert Support' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-2xl font-bold text-white mr-2">{stat.number}</div>
                <div>{stat.label}</div>
                {index < 2 && <div className="hidden sm:block w-px h-8 bg-slate-600 ml-8"></div>}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;