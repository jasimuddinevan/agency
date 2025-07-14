import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CTASection: React.FC = () => {
  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Call Us Now',
      description: 'Speak with an expert immediately',
      action: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Get detailed answers to your questions',
      action: 'hello@growthpro.com',
      href: 'mailto:hello@growthpro.com',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our team right now',
      action: 'Start Chat',
      href: '#',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Book Consultation',
      description: 'Schedule a free strategy session',
      action: 'Book Now',
      href: '#',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const benefits = [
    'Free initial consultation and strategy session',
    'Custom growth plan tailored to your business',
    '30-day money-back guarantee',
    'Results within 60 days or we work for free',
    '24/7 expert support and monitoring',
    'No long-term contracts required'
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transform
            </span>{' '}
            Your Business?
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-xl lg:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            Join hundreds of successful businesses who trust GrowthPro to drive their growth. 
            Get started today and see results within 30 days.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          >
            <Link
              to="/onboarding"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 inline-flex items-center justify-center"
            >
              Start Your Growth Journey
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center">
              <CalendarDaysIcon className="mr-2 h-5 w-5" />
              Book Free Consultation
            </button>
          </motion.div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group text-center"
            >
              <div className={`bg-gradient-to-r ${method.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
              <p className="text-slate-300 text-sm mb-3">{method.description}</p>
              <div className="text-blue-300 font-medium group-hover:text-white transition-colors duration-300">
                {method.action}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              What You Get When You Choose GrowthPro
            </h3>
            <p className="text-slate-300 text-lg">
              Everything you need to succeed, with no hidden fees or surprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="flex items-start group"
              >
                <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-slate-200 group-hover:text-white transition-colors duration-300">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Urgency Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-center mb-4">
              <ClockIcon className="h-6 w-6 text-orange-400 mr-2" />
              <span className="text-orange-300 font-semibold">Limited Time Offer</span>
            </div>
            
            <h4 className="text-xl font-bold mb-2">
              Get Your First Month 50% Off
            </h4>
            
            <p className="text-slate-300 mb-4">
              New clients only. This offer expires soon - don't miss out on transforming your business.
            </p>
            
            <div className="text-sm text-orange-300">
              ⏰ Offer valid until end of month • 🎯 Limited to first 50 clients • 🚀 Results guaranteed
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 mb-6">
            Still have questions? We're here to help 24/7
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+15551234567"
              className="text-blue-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              +1 (555) 123-4567
            </a>
            
            <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
            
            <a
              href="mailto:hello@growthpro.com"
              className="text-blue-300 hover:text-white transition-colors duration-300 flex items-center"
            >
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              hello@growthpro.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;