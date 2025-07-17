import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  BoltIcon, 
  ServerIcon, 
  WrenchScrewdriverIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

// Components
import TestimonialCarousel from '../components/services/TestimonialCarousel';
import PricingTable from '../components/services/PricingTable';
import FAQSection from '../components/services/FAQSection';

const WebsiteManagementPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const painPoints = [
    {
      title: "Security Vulnerabilities",
      description: "Outdated software and plugins create security holes that hackers actively exploit, putting your business data at risk.",
      icon: ShieldCheckIcon
    },
    {
      title: "Slow Loading Times",
      description: "Unoptimized websites frustrate visitors and hurt your search rankings, costing you valuable traffic and conversions.",
      icon: BoltIcon
    },
    {
      title: "Broken Functionality",
      description: "Plugin conflicts, outdated code, and browser incompatibilities create a poor user experience that damages your reputation.",
      icon: WrenchScrewdriverIcon
    },
    {
      title: "Maintenance Neglect",
      description: "Most business owners lack the time and expertise to properly maintain their websites, leading to compounding technical debt.",
      icon: ClockIcon
    },
    {
      title: "Downtime & Crashes",
      description: "Server issues and resource limitations can take your site offline at critical moments, resulting in lost revenue and opportunities.",
      icon: ServerIcon
    },
    {
      title: "Data Loss Risk",
      description: "Without proper backup systems, a single technical issue can result in catastrophic and permanent loss of your website data.",
      icon: ExclamationTriangleIcon
    }
  ];

  const solutions = [
    {
      title: "24/7 Security Monitoring",
      description: "Continuous protection against the latest threats with real-time malware scanning, firewall protection, and intrusion detection.",
      icon: ShieldCheckIcon
    },
    {
      title: "Performance Optimization",
      description: "Regular speed enhancements, caching implementation, and code optimization to keep your site loading lightning-fast.",
      icon: BoltIcon
    },
    {
      title: "Regular Updates & Maintenance",
      description: "Timely updates to core software, themes, and plugins while ensuring compatibility and preventing conflicts.",
      icon: WrenchScrewdriverIcon
    },
    {
      title: "Content Management",
      description: "Professional handling of all your content needs - adding new pages, updating existing content, and ensuring consistent quality.",
      icon: ClockIcon
    },
    {
      title: "Backup Management",
      description: "Automated daily backups with secure off-site storage and rapid restoration capabilities to protect against data loss.",
      icon: ServerIcon
    },
    {
      title: "Emergency Support",
      description: "Rapid response team available 24/7 to address critical issues, with guaranteed response times for business-critical problems.",
      icon: ExclamationTriangleIcon
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Eco Beauty Store",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Since switching to GrowthPro's website management service, our site has never been faster or more secure. We've seen a 40% increase in page speed and zero security incidents in the past year.",
      results: "40% faster page load times, zero security breaches"
    },
    {
      name: "Michael Chen",
      company: "Tech Gadgets Pro",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Their team handles all our website updates and maintenance, freeing us to focus on our core business. When we had an emergency on a Sunday night, they responded within minutes.",
      results: "15 hours saved weekly, 99.9% uptime guaranteed"
    },
    {
      name: "Emma Rodriguez",
      company: "Fashion Forward",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Our e-commerce site was constantly breaking until we found GrowthPro. Now we have peace of mind knowing professionals are monitoring our site 24/7 and fixing issues before they impact sales.",
      results: "28% increase in sales, 99.9% uptime"
    }
  ];

  const faqs = [
    {
      question: "What's included in your website management service?",
      answer: "Our comprehensive service includes 24/7 security monitoring, regular software updates, performance optimization, content management, daily backups, and emergency support. We handle all technical aspects of your website so you can focus on your business."
    },
    {
      question: "How quickly do you respond to website emergencies?",
      answer: "For critical issues like site downtime or security breaches, our team responds within 15 minutes, 24/7/365. For non-critical issues, we guarantee a response within 4 business hours."
    },
    {
      question: "Do you work with all types of websites?",
      answer: "Yes, we support websites built on all major platforms including WordPress, Shopify, Wix, Squarespace, and custom-built sites. Our team has expertise across various technologies and CMS platforms."
    },
    {
      question: "What if I need content updates on my website?",
      answer: "Content updates are included in our service. Whether you need new pages created, existing content modified, or regular blog posts published, our team handles it all with professional quality and attention to detail."
    },
    {
      question: "How do your backups work?",
      answer: "We implement automated daily backups of your entire website and database. These backups are stored securely off-site and retained for 30 days. In case of any issues, we can quickly restore your site to a previous working state."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, our service is month-to-month with no long-term contracts required. You can cancel anytime with 30 days' notice. However, most clients stay with us for years due to the value and peace of mind we provide."
    }
  ];

  return (
    <div className="min-h-screen pt-16 lg:pt-18">
      {/* Hero Section with Video */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <iframe 
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&playlist=dQw4w9WgXcQ" 
            title="Website Management Services"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Professional Website Management That <span className="text-blue-400">Never Sleeps</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              24/7 monitoring, maintenance, and support to keep your business website secure, fast, and always online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="px-8 py-4 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                Start Your Free Trial
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#pricing"
                className="px-8 py-4 bg-white/10 text-white rounded text-lg font-semibold hover:bg-white/20 transition-colors duration-300"
              >
                View Pricing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problems & Pain Points Section */}
      <section className="py-20 bg-white" id="problems">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Hidden Costs of Website Neglect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most business websites are vulnerable, underperforming, and costing you money without you even realizing it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gray-50 p-8 rounded border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-red-100 p-3 rounded inline-block mb-4">
                  <point.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-xl text-red-600 font-semibold mb-6">
              The average cost of website downtime is $5,600 per minute.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Can your business afford to leave your website vulnerable and unmanaged?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Website Management <span className="text-blue-600">Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our 24/7 website management service handles everything so you can focus on running your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-8 rounded border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-blue-100 p-3 rounded inline-block mb-4">
                  <solution.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded mb-6">
              <p className="text-xl font-semibold">
                We handle 100+ technical tasks so you don't have to
              </p>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our team of experts works around the clock to ensure your website is secure, fast, and always online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client Success Stories Section */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How We've Helped Others
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from real businesses just like yours
            </p>
          </motion.div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All-inclusive website management with no hidden fees or surprises
            </p>
          </motion.div>

          <PricingTable />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white" id="why-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose GrowthPro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What makes our website management service different
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-8 rounded border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Advantages</h3>
              <ul className="space-y-4">
                {[
                  "True 24/7 monitoring and support with 15-minute response time",
                  "Proactive maintenance that prevents issues before they occur",
                  "Dedicated account manager who knows your business",
                  "No long-term contracts - stay because you want to, not because you have to",
                  "Transparent reporting so you always know what we're doing",
                  "Unlimited support requests and website changes"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-blue-600 text-white p-8 rounded"
            >
              <h3 className="text-2xl font-bold mb-6">Our Guarantees</h3>
              <ul className="space-y-4">
                {[
                  "99.9% uptime guarantee or your money back",
                  "Same-day resolution for critical issues",
                  "Security breach protection or we fix it for free",
                  "30-day risk-free trial with no obligations",
                  "Regular performance improvements or we work for free",
                  "100% satisfaction guarantee"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50" id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about our website management service
            </p>
          </motion.div>

          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Never Worry About Your Website Again?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of businesses who trust us with their most valuable digital asset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="px-8 py-4 bg-white text-blue-600 rounded text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
              >
                Start Your Free Trial
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded text-lg font-semibold hover:bg-white/10 transition-colors duration-300"
              >
                Schedule a Demo
              </a>
            </div>
            <p className="mt-6 text-blue-200">
              No credit card required. 30-day free trial.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebsiteManagementPage;