import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ShoppingCartIcon, 
  MegaphoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const ServicesSection: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      icon: ShieldCheckIcon,
      title: "Website Management & Security",
      description: "Complete peace of mind with our comprehensive website care services",
      color: "from-green-500 to-emerald-600",
      features: [
        { icon: ClockIcon, text: "24/7 website monitoring and maintenance" },
        { icon: LockClosedIcon, text: "Advanced security audits and threat protection" },
        { icon: RocketLaunchIcon, text: "Performance optimization and speed enhancement" },
        { icon: ShieldCheckIcon, text: "Regular automated updates and backups" },
        { icon: CogIcon, text: "Technical support and troubleshooting" },
        { icon: ChartBarIcon, text: "Detailed analytics and reporting" },
        { icon: CheckCircleIcon, text: "SSL certificates and security monitoring" },
        { icon: ArrowRightIcon, text: "SEO optimization and maintenance" }
      ]
    },
    {
      icon: ShoppingCartIcon,
      title: "Shopify Business Acceleration",
      description: "Transform your Shopify store into a profit-generating machine",
      color: "from-blue-500 to-cyan-600",
      features: [
        { icon: AdjustmentsHorizontalIcon, text: "Zero to $10K profit roadmap and strategy" },
        { icon: ChartBarIcon, text: "Winning product research and validation" },
        { icon: MegaphoneIcon, text: "Strategic paid advertising campaigns" },
        { icon: RocketLaunchIcon, text: "Store optimization and conversion rate enhancement" },
        { icon: CogIcon, text: "Complete business setup and guidance" },
        { icon: PresentationChartLineIcon, text: "Inventory management and fulfillment" },
        { icon: CheckCircleIcon, text: "Brand development and positioning" },
        { icon: ArrowRightIcon, text: "Scaling strategies for sustainable growth" }
      ]
    },
    {
      icon: MegaphoneIcon,
      title: "Facebook Ads Mastery",
      description: "Dominate your market with high-converting Facebook advertising",
      color: "from-purple-500 to-pink-600",
      features: [
        { icon: RocketLaunchIcon, text: "10X sales growth strategies and implementation" },
        { icon: AdjustmentsHorizontalIcon, text: "Advanced targeting and audience optimization" },
        { icon: PresentationChartLineIcon, text: "High-converting ad creative development" },
        { icon: ChartBarIcon, text: "Campaign management and strategic scaling" },
        { icon: CogIcon, text: "Performance analytics and optimization" },
        { icon: CheckCircleIcon, text: "A/B testing and conversion tracking" },
        { icon: ArrowRightIcon, text: "Retargeting and funnel optimization" },
        { icon: ClockIcon, text: "24/7 campaign monitoring and adjustments" }
      ]
    }
  ];

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
            Our Comprehensive{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Solutions
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Everything you need to dominate your market and scale your business to new heights
          </motion.p>
        </motion.div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Service Content */}
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className={`bg-gradient-to-r ${service.color} p-3 rounded-2xl mr-4`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{service.title}</h3>
                </div>
                
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: featureIndex * 0.1 }}
                      className="flex items-start group hover:bg-white hover:shadow-lg rounded-lg p-3 transition-all duration-300"
                    >
                      <feature.icon className={`h-5 w-5 mr-3 mt-0.5 bg-gradient-to-r ${service.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`} />
                      <span className="text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Service Visual */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${service.color} rounded-3xl p-8 text-white shadow-2xl`}
                >
                  <div className="text-center">
                    <service.icon className="h-24 w-24 mx-auto mb-6 opacity-80" />
                    <h4 className="text-2xl font-bold mb-4">{service.title}</h4>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                      <div className="text-4xl font-bold mb-2">
                        {index === 0 ? '99.9%' : index === 1 ? '$10K+' : '10X'}
                      </div>
                      <div className="text-lg opacity-90">
                        {index === 0 ? 'Uptime Guarantee' : index === 1 ? 'Average Profit' : 'Sales Growth'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;