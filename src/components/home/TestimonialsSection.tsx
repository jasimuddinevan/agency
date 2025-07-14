import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon, TrophyIcon } from '@heroicons/react/24/outline';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Eco Beauty Store',
      role: 'Founder & CEO',
      result: '300% increase in revenue',
      rating: 5,
      testimonial: 'GrowthPro completely transformed our Shopify store. Their team handled everything from security to marketing, and our sales tripled within 6 months. The 24/7 support gives us complete peace of mind.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      metrics: {
        revenue: '+300%',
        conversion: '+150%',
        traffic: '+200%'
      }
    },
    {
      name: 'Michael Chen',
      company: 'Tech Gadgets Pro',
      role: 'Marketing Director',
      result: '150% ROI on Facebook ads',
      rating: 5,
      testimonial: 'Their Facebook ad strategies are incredible. We went from struggling with ad spend to seeing consistent 150% ROI every month. The targeting and creative optimization is next level.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      metrics: {
        roi: '+150%',
        cpa: '-60%',
        reach: '+400%'
      }
    },
    {
      name: 'Emma Rodriguez',
      company: 'Fashion Forward',
      role: 'Business Owner',
      result: '500% growth in 12 months',
      rating: 5,
      testimonial: 'From a small startup to a thriving business generating $50K monthly. GrowthPro\'s comprehensive approach to website management and marketing made it all possible. Best investment ever!',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      metrics: {
        growth: '+500%',
        sales: '$50K/mo',
        customers: '+800%'
      }
    },
    {
      name: 'David Park',
      company: 'Wellness Hub',
      role: 'Co-Founder',
      result: 'Zero downtime in 2 years',
      rating: 5,
      testimonial: 'Website security and performance were our biggest concerns. GrowthPro\'s 24/7 monitoring and maintenance gave us 100% uptime for 2 years straight. Their proactive approach is unmatched.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      metrics: {
        uptime: '99.9%',
        speed: '+180%',
        security: '100%'
      }
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <motion.div variants={fadeInUp} className="flex items-center justify-center mb-6">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <span className="text-lg font-semibold text-slate-600">Client Success Stories</span>
          </motion.div>
          
          <motion.h2
            variants={fadeInUp}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Real Results from{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real Businesses
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Don't just take our word for it. See how we've helped businesses achieve remarkable growth and success.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-slate-600">5.0</span>
              </div>

              {/* Testimonial */}
              <blockquote className="text-slate-700 mb-6 text-lg leading-relaxed relative z-10">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/50 rounded-2xl">
                {Object.entries(testimonial.metrics).map(([key, value], metricIndex) => (
                  <div key={metricIndex} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{value}</div>
                    <div className="text-xs text-slate-500 capitalize">{key}</div>
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-blue-200"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                  <p className="text-sm font-medium text-blue-600">{testimonial.company}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{testimonial.result}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Certified & Trusted</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-lg p-2 mr-3">
                <TrophyIcon className="h-6 w-6" />
              </div>
              <span>Google Partner</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-lg p-2 mr-3">
                <TrophyIcon className="h-6 w-6" />
              </div>
              <span>Facebook Marketing Partner</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-lg p-2 mr-3">
                <TrophyIcon className="h-6 w-6" />
              </div>
              <span>Shopify Plus Partner</span>
            </div>
          </div>
          <p className="text-blue-200">
            Officially recognized by industry leaders for our expertise and results
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;