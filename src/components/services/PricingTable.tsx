import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const PricingTable: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Basic",
      description: "Essential website management for small businesses",
      monthlyPrice: 49,
      yearlyPrice: 470,
      features: [
        "Daily website monitoring",
        "Weekly performance reports",
        "Basic security monitoring",
        "Weekly backups",
        "Core software updates",
        "Up to 5 content updates monthly",
        "Email support (48h response)",
        "Business hours support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Complete website care for growing businesses",
      monthlyPrice: 99,
      yearlyPrice: 950,
      features: [
        "24/7 website monitoring",
        "Daily performance reports",
        "Advanced security monitoring",
        "Daily backups",
        "All software updates & patches",
        "Unlimited content updates",
        "Priority email support (12h)",
        "24/7 emergency support",
        "Monthly strategy call",
        "Performance optimization",
        "SEO monitoring"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Maximum protection for business-critical websites",
      monthlyPrice: 199,
      yearlyPrice: 1910,
      features: [
        "24/7 premium monitoring",
        "Real-time performance dashboard",
        "Enterprise-grade security",
        "Hourly backups",
        "Proactive updates & maintenance",
        "Unlimited content management",
        "VIP support (1h response)",
        "24/7 dedicated support line",
        "Weekly strategy calls",
        "Advanced performance tuning",
        "Comprehensive SEO management",
        "Custom development hours included"
      ],
      cta: "Get Started",
      popular: false
    }
  ];

  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyEquivalent = monthlyPrice * 12;
    const savings = yearlyEquivalent - yearlyPrice;
    const percentage = Math.round((savings / yearlyEquivalent) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-full p-1 shadow-md inline-flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
              billingCycle === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const savings = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);
          
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-white rounded border ${
                plan.popular 
                  ? 'border-blue-500 shadow-lg relative' 
                  : 'border-gray-200 shadow-sm hover:shadow-md'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-green-600 text-sm mt-2">
                    Save ${savings.amount} ({savings.percentage}%) with annual billing
                  </p>
                )}
              </div>
              
              <div className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link
                    to="/onboarding"
                    className={`w-full flex items-center justify-center px-4 py-3 rounded text-white font-medium transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          All plans include our 30-day money-back guarantee and 99.9% uptime SLA
        </p>
      </div>
    </div>
  );
};

export default PricingTable;