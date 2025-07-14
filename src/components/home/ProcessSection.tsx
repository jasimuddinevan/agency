import React from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon,
  ChartBarIcon,
  CogIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ProcessSection: React.FC = () => {
  const processes = [
    {
      step: 1,
      title: 'Discovery & Analysis',
      description: 'We dive deep into your business, analyzing your current situation, market position, and growth opportunities.',
      icon: LightBulbIcon,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Comprehensive business audit',
        'Market research and competitor analysis',
        'Technical website assessment',
        'Growth opportunity identification'
      ]
    },
    {
      step: 2,
      title: 'Strategic Planning',
      description: 'Based on our analysis, we create a customized roadmap tailored to your specific goals and market conditions.',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-pink-500',
      details: [
        'Custom growth strategy development',
        'Timeline and milestone planning',
        'Resource allocation and budgeting',
        'Risk assessment and mitigation'
      ]
    },
    {
      step: 3,
      title: 'Implementation',
      description: 'Our expert team executes the strategy with precision, setting up all necessary systems and campaigns.',
      icon: CogIcon,
      color: 'from-green-500 to-emerald-500',
      details: [
        'Website security and optimization setup',
        'Marketing campaign deployment',
        'System integration and automation',
        'Team training and onboarding'
      ]
    },
    {
      step: 4,
      title: 'Optimization',
      description: 'We continuously monitor performance and optimize based on real data and results to maximize your ROI.',
      icon: RocketLaunchIcon,
      color: 'from-orange-500 to-red-500',
      details: [
        'Performance monitoring and analysis',
        'A/B testing and optimization',
        'Campaign refinement and scaling',
        'Conversion rate optimization'
      ]
    },
    {
      step: 5,
      title: 'Growth & Scaling',
      description: 'Once we achieve consistent results, we scale successful strategies and expand to new opportunities.',
      icon: CheckCircleIcon,
      color: 'from-indigo-500 to-purple-500',
      details: [
        'Successful strategy scaling',
        'New market expansion',
        'Advanced automation implementation',
        'Long-term growth planning'
      ]
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
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
            Our Proven{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Growth Process
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            A systematic 5-step approach that has helped hundreds of businesses achieve remarkable growth
          </motion.p>
        </motion.div>

        {/* Desktop Process Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-5 gap-8">
              {processes.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative"
                >
                  {/* Step Circle */}
                  <div className={`bg-gradient-to-r ${process.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}>
                    <process.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-700 shadow-md z-20">
                    {process.step}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{process.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Process Flow */}
        <div className="lg:hidden space-y-8">
          {processes.map((process, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex items-start"
            >
              {/* Step Circle */}
              <div className={`bg-gradient-to-r ${process.color} w-16 h-16 rounded-full flex items-center justify-center mr-6 flex-shrink-0 relative`}>
                <process.icon className="h-8 w-8 text-white" />
                <div className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-700">
                  {process.step}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{process.title}</h3>
                <p className="text-slate-600 mb-4">{process.description}</p>
                
                <div className="space-y-2">
                  {process.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center text-sm text-slate-500">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Process Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {processes.slice(0, 3).map((process, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <div className={`bg-gradient-to-r ${process.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <process.icon className="h-6 w-6 text-white" />
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-3">{process.title}</h4>
              
              <ul className="space-y-2">
                {process.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start text-sm text-slate-600">
                    <ArrowRightIcon className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Fast-Track Your Success</h3>
          <p className="text-lg mb-6 text-blue-100">
            See measurable results within 30 days or we'll work for free until you do
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">30 Days</div>
              <div className="text-blue-200">First Results</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">90 Days</div>
              <div className="text-blue-200">Significant Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">6 Months</div>
              <div className="text-blue-200">Market Domination</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;