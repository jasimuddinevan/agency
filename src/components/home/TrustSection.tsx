import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  TrophyIcon,
  CheckBadgeIcon,
  StarIcon,
  LockClosedIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TrustSection: React.FC = () => {
  const certifications = [
    {
      icon: ShieldCheckIcon,
      title: 'Google Partner',
      description: 'Certified Google Ads and Analytics expert',
      badge: 'Verified'
    },
    {
      icon: TrophyIcon,
      title: 'Facebook Marketing Partner',
      description: 'Official Facebook advertising partner',
      badge: 'Elite'
    },
    {
      icon: CheckBadgeIcon,
      title: 'Shopify Plus Partner',
      description: 'Authorized Shopify development partner',
      badge: 'Premium'
    },
    {
      icon: LockClosedIcon,
      title: 'SSL & Security Certified',
      description: 'Advanced cybersecurity certifications',
      badge: 'Secure'
    },
    {
      icon: StarIcon,
      title: 'ISO 27001 Compliant',
      description: 'International security standards',
      badge: 'Certified'
    },
    {
      icon: ClockIcon,
      title: '24/7 Support Guarantee',
      description: 'Round-the-clock expert assistance',
      badge: 'Always On'
    }
  ];

  const guarantees = [
    {
      title: '30-Day Money Back',
      description: 'Not satisfied? Get your money back, no questions asked.',
      icon: '💰'
    },
    {
      title: '99.9% Uptime SLA',
      description: 'Your website will be online when your customers need it.',
      icon: '⚡'
    },
    {
      title: 'Results Guarantee',
      description: 'See measurable growth within 60 days or we work for free.',
      icon: '📈'
    },
    {
      title: 'Data Security',
      description: 'Bank-level encryption and security for all your data.',
      icon: '🔒'
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
          <motion.h2
            variants={fadeInUp}
            className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Trusted by Industry{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leaders
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Our certifications, partnerships, and guarantees ensure you're working with the best in the business
          </motion.p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <cert.icon className="h-6 w-6 text-white" />
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {cert.badge}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cert.title}</h3>
              <p className="text-slate-600 text-sm">{cert.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Guarantees Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 lg:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Our Ironclad Guarantees</h3>
            <p className="text-xl text-blue-200">
              We stand behind our work with industry-leading guarantees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {guarantee.icon}
                </div>
                <h4 className="text-lg font-bold mb-2">{guarantee.title}</h4>
                <p className="text-blue-200 text-sm">{guarantee.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">5+ Years</div>
                <div className="text-blue-200">Industry Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-blue-200">Successful Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-blue-200">Expert Support</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200"
        >
          <div className="text-center">
            <ShieldCheckIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Enterprise-Grade Security</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Your data and your customers' data are protected with the same security standards used by Fortune 500 companies.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <LockClosedIcon className="h-4 w-4 mr-2" />
                256-bit SSL Encryption
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <CheckBadgeIcon className="h-4 w-4 mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 mr-2" />
                PCI DSS Level 1
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;