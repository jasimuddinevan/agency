import React from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: BuildingOfficeIcon,
      number: '500+',
      label: 'Businesses Transformed',
      description: 'Successfully scaled across industries'
    },
    {
      icon: CurrencyDollarIcon,
      number: '$10M+',
      label: 'Revenue Generated',
      description: 'For our clients worldwide'
    },
    {
      icon: ChartBarIcon,
      number: '250%',
      label: 'Average Growth',
      description: 'Within first 6 months'
    },
    {
      icon: UserGroupIcon,
      number: '98%',
      label: 'Client Satisfaction',
      description: 'Long-term partnerships'
    },
    {
      icon: ClockIcon,
      number: '24/7',
      label: 'Expert Support',
      description: 'Always here when you need us'
    },
    {
      icon: TrophyIcon,
      number: '5+',
      label: 'Years Experience',
      description: 'Proven track record'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Proven Results That{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Speak Volumes
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Numbers don't lie. See the impact we've made for businesses just like yours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 group"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                className="text-4xl lg:text-5xl font-bold text-white mb-2"
              >
                {stat.number}
              </motion.div>
              
              <h3 className="text-xl font-semibold text-blue-200 mb-2">
                {stat.label}
              </h3>
              
              <p className="text-slate-400">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Trusted by Industry Leaders</h3>
            <p className="text-slate-300 mb-6">
              Join hundreds of successful businesses who trust us to drive their growth
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold">E-commerce</div>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="text-lg font-semibold">SaaS</div>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="text-lg font-semibold">Healthcare</div>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="text-lg font-semibold">Finance</div>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="text-lg font-semibold">Education</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;