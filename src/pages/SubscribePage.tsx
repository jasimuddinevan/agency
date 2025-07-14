import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SubscribePage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: 'web-management',
      name: 'Web Management',
      icon: GlobeAltIcon,
      color: 'from-green-500 to-emerald-600',
      description: 'Complete website care and maintenance',
      plans: [
        {
          id: 'web-basic',
          name: 'Basic Plan',
          monthlyPrice: 49,
          yearlyPrice: 470,
          popular: false,
          features: [
            'Daily website monitoring & maintenance',
            'Weekly performance reports',
            'Basic SEO optimization',
            'Up to 5 page updates monthly',
            '24/7 security monitoring',
            'Weekly backups',
            'Basic malware protection',
            'Email support (48h response)',
            'Mobile responsiveness check',
            '2 monthly blog posts',
            'Basic speed optimization',
            'Google Analytics integration'
          ]
        },
        {
          id: 'web-premium',
          name: 'Premium Plan',
          monthlyPrice: 99,
          yearlyPrice: 950,
          popular: true,
          features: [
            'Everything in Basic, plus:',
            'Priority website maintenance',
            'Daily backups',
            'Advanced SEO optimization',
            'Unlimited page updates',
            'Premium malware protection',
            'Priority email support (12h response)',
            'Monthly strategy consultation',
            '5 monthly blog posts',
            'CDN integration',
            'Advanced speed optimization',
            'Custom monthly reports',
            'A/B testing implementation'
          ]
        }
      ]
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      icon: MegaphoneIcon,
      color: 'from-blue-500 to-cyan-600',
      description: 'Professional Facebook advertising management',
      plans: [
        {
          id: 'fb-basic',
          name: 'Basic Plan',
          monthlyPrice: 199,
          yearlyPrice: 1910,
          popular: false,
          features: [
            'Ad account setup & optimization',
            '2 ad campaigns monthly',
            'Basic audience targeting',
            'Monthly performance reports',
            'Ad creative suggestions',
            'Basic A/B testing',
            'Campaign monitoring',
            'Basic remarketing setup',
            'Weekly optimization',
            'Basic competitor analysis',
            'ROI tracking',
            'Up to $5k monthly ad spend management'
          ]
        },
        {
          id: 'fb-premium',
          name: 'Premium Plan',
          monthlyPrice: 399,
          yearlyPrice: 3830,
          popular: true,
          features: [
            'Everything in Basic, plus:',
            '5 ad campaigns monthly',
            'Advanced audience targeting',
            'Weekly performance reports',
            'Custom ad creatives',
            'Advanced A/B testing',
            '24/7 campaign monitoring',
            'Advanced remarketing strategies',
            'Daily optimization',
            'In-depth competitor analysis',
            'Custom attribution modeling',
            'Unlimited ad spend management'
          ]
        }
      ]
    },
    {
      id: 'shopify-growth',
      name: 'Shopify Growth',
      icon: ShoppingCartIcon,
      color: 'from-purple-500 to-pink-600',
      description: 'Complete Shopify store optimization',
      plans: [
        {
          id: 'shopify-basic',
          name: 'Basic Plan',
          monthlyPrice: 149,
          yearlyPrice: 1430,
          popular: false,
          features: [
            'Store setup & optimization',
            'Basic theme customization',
            'Product listing optimization',
            'Basic inventory management',
            'Payment gateway setup',
            'Basic shipping setup',
            'Monthly performance review',
            'Basic SEO optimization',
            'Email support',
            'Basic analytics setup',
            'Shopping feed integration',
            'Basic conversion optimization'
          ]
        },
        {
          id: 'shopify-premium',
          name: 'Premium Plan',
          monthlyPrice: 299,
          yearlyPrice: 2870,
          popular: true,
          features: [
            'Everything in Basic, plus:',
            'Advanced theme customization',
            'Product photography guidelines',
            'Advanced inventory management',
            'Multi-currency setup',
            'Advanced shipping rules',
            'Weekly performance review',
            'Advanced SEO optimization',
            'Priority support',
            'Advanced analytics & reporting',
            'Multiple shopping feed integration',
            'Advanced conversion optimization'
          ]
        }
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Eco Beauty Store',
      rating: 5,
      text: 'GrowthPro transformed our business completely. Revenue increased 300% in 6 months!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Michael Chen',
      company: 'Tech Gadgets Pro',
      rating: 5,
      text: 'Their Facebook ads expertise is incredible. We see consistent 150% ROI every month.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyEquivalent = monthlyPrice * 12;
    const savings = yearlyEquivalent - yearlyPrice;
    const percentage = Math.round((savings / yearlyEquivalent) * 100);
    return { amount: savings, percentage };
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-lg font-semibold text-slate-600">Choose Your Growth Package</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
            Accelerate Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Business Growth
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Professional services designed to transform your business. Choose the perfect package for your needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg border border-slate-200">
              <div className="flex items-center">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <div className="space-y-20">
          {packages.map((pkg, packageIndex) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: packageIndex * 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Package Header */}
              <div className={`bg-gradient-to-r ${pkg.color} p-8 text-white`}>
                <div className="flex items-center justify-center mb-4">
                  <pkg.icon className="h-12 w-12 mr-4" />
                  <div className="text-center">
                    <h2 className="text-3xl font-bold">{pkg.name}</h2>
                    <p className="text-lg opacity-90">{pkg.description}</p>
                  </div>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pkg.plans.map((plan, planIndex) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border-2 transition-all duration-300 ${
                        plan.popular 
                          ? 'border-blue-500 shadow-xl' 
                          : 'border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                            <TrophyIcon className="h-4 w-4 mr-2" />
                            Most Popular
                          </div>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                        
                        <div className="mb-4">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-slate-900">
                              ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                            </span>
                            <span className="text-slate-600 ml-2">
                              /{billingCycle === 'monthly' ? 'month' : 'year'}
                            </span>
                          </div>
                          
                          {billingCycle === 'yearly' && (
                            <div className="mt-2">
                              <span className="text-green-600 font-semibold">
                                Save ${calculateSavings(plan.monthlyPrice, plan.yearlyPrice).amount} 
                                ({calculateSavings(plan.monthlyPrice, plan.yearlyPrice).percentage}%)
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedPackage(plan.id)}
                          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                          }`}
                        >
                          Get Started
                          <ArrowRightIcon className="inline h-5 w-5 ml-2" />
                        </button>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (packageIndex * 0.2) + (planIndex * 0.1) + (featureIndex * 0.05) }}
                            className={`flex items-start ${
                              feature.startsWith('Everything in') 
                                ? 'font-semibold text-blue-600 border-t border-slate-200 pt-3 mt-3' 
                                : ''
                            }`}
                          >
                            <CheckIcon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                              feature.startsWith('Everything in') ? 'text-blue-600' : 'text-green-500'
                            }`} />
                            <span className={`text-slate-700 ${
                              feature.startsWith('Everything in') ? 'font-semibold' : ''
                            }`}>
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-8 lg:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose GrowthPro?</h3>
            <p className="text-xl text-blue-200">
              Join hundreds of successful businesses who trust us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <ShieldCheckIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">30-Day Guarantee</h4>
              <p className="text-blue-200 text-sm">Money back if not satisfied</p>
            </div>
            <div className="text-center">
              <ClockIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">24/7 Support</h4>
              <p className="text-blue-200 text-sm">Always here when you need us</p>
            </div>
            <div className="text-center">
              <TrophyIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">Proven Results</h4>
              <p className="text-blue-200 text-sm">500+ successful projects</p>
            </div>
            <div className="text-center">
              <CurrencyDollarIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">ROI Guarantee</h4>
              <p className="text-blue-200 text-sm">See results or we work for free</p>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/20">
            <div className="flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2 text-blue-300" />
              <span className="text-blue-200">Secure Payment</span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 mr-2 text-blue-300" />
              <span className="text-blue-200">SSL Encrypted</span>
            </div>
            <div className="flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2 text-blue-300" />
              <span className="text-blue-200">Industry Certified</span>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">What Our Clients Say</h3>
            <p className="text-xl text-slate-600">Real results from real businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-slate-700 mb-6 text-lg">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful businesses and start your growth journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Free Consultation
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold text-lg">
                Contact Sales Team
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscribePage;