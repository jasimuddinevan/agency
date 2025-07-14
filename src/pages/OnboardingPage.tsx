import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserIcon,
  CheckIcon,
  SparklesIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Validation schemas
const step1Schema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  websiteUrl: yup.string().url('Please enter a valid URL').required('Website URL is required'),
  businessDescription: yup.string().min(10, 'Description must be at least 10 characters').required('Business description is required'),
  industry: yup.string().required('Please select an industry'),
  monthlyRevenue: yup.string().required('Please select your monthly revenue range')
});

const step2Schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Business address is required'),
  preferredContact: yup.string().required('Please select your preferred contact method')
});

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = [
    'E-commerce', 'Fashion', 'Beauty & Cosmetics', 'Health & Wellness',
    'Technology', 'Food & Beverage', 'Home & Garden', 'Sports & Fitness',
    'Education', 'Professional Services', 'Real Estate', 'Other'
  ];

  const revenueRanges = [
    'Under $1K', '$1K - $5K', '$5K - $10K', '$10K - $25K',
    '$25K - $50K', '$50K - $100K', '$100K - $250K', '$250K+'
  ];

  const contactMethods = ['Email', 'Phone', 'WhatsApp', 'Both Email and Phone'];

  const form1 = useForm({
    resolver: yupResolver(step1Schema),
    mode: 'onChange'
  });

  const form2 = useForm({
    resolver: yupResolver(step2Schema),
    mode: 'onChange'
  });

  const handleStep1Submit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = async (data: any) => {
    setIsSubmitting(true);
    const fullData = { ...formData, ...data };
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([{
          business_name: fullData.businessName,
          website_url: fullData.websiteUrl,
          business_description: fullData.businessDescription,
          industry: fullData.industry,
          monthly_revenue: fullData.monthlyRevenue,
          full_name: fullData.fullName,
          email: fullData.email,
          phone: fullData.phone,
          address: fullData.address,
          preferred_contact: fullData.preferredContact,
          status: 'new'
        }]);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      setCurrentStep(3);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Business Information', icon: BuildingOfficeIcon, description: 'Tell us about your business' },
    { number: 2, title: 'Contact Information', icon: UserIcon, description: 'How can we reach you?' },
    { number: 3, title: 'Success', icon: CheckIcon, description: 'Application submitted' }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
            <span className="text-lg font-semibold text-slate-600">Start Your Growth Journey</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Join <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+</span> Successful Businesses
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete our quick assessment to get a personalized growth strategy for your business
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg'
                      : 'border-slate-300 text-slate-400 bg-white'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircleIcon className="h-8 w-8" />
                    ) : (
                      <step.icon className="h-8 w-8" />
                    )}
                    
                    {/* Step Number Badge */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep >= step.number
                        ? 'bg-white text-blue-600'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Step Info */}
                  <div className="mt-4 text-center">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                      : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="bg-white rounded-1x2 shadow-1xl border border-slate-100/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-8 lg:p-12"
              >
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                    <BuildingOfficeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Business Information</h2>
                    <p className="text-slate-600 mt-1">Tell us about your business to create a personalized strategy</p>
                  </div>
                </div>

                <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Business Name */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Business Name *
                      </label>
                      <input
                        {...form1.register('businessName')}
                        type="text"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder="Enter your business name"
                      />
                      {form1.formState.errors.businessName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form1.formState.errors.businessName.message}
                        </p>
                      )}
                    </div>

                    {/* Website URL */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Website URL *
                      </label>
                      <input
                        {...form1.register('websiteUrl')}
                        type="url"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder="https://your-website.com"
                      />
                      {form1.formState.errors.websiteUrl && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form1.formState.errors.websiteUrl.message}
                        </p>
                      )}
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Industry *
                      </label>
                      <select
                        {...form1.register('industry')}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      >
                        <option value="">Select your industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                      {form1.formState.errors.industry && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form1.formState.errors.industry.message}
                        </p>
                      )}
                    </div>

                    {/* Monthly Revenue */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Current Monthly Revenue *
                      </label>
                      <select
                        {...form1.register('monthlyRevenue')}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      >
                        <option value="">Select your revenue range</option>
                        {revenueRanges.map(range => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                      {form1.formState.errors.monthlyRevenue && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form1.formState.errors.monthlyRevenue.message}
                        </p>
                      )}
                    </div>

                    {/* Business Description */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Business Description *
                      </label>
                      <textarea
                        {...form1.register('businessDescription')}
                        rows={4}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg resize-none"
                        placeholder="Tell us about your business, what you do, and your goals (minimum 10 characters)"
                      />
                      {form1.formState.errors.businessDescription && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form1.formState.errors.businessDescription.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button
                      type="submit"
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Continue to Contact Info
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-8 lg:p-12"
              >
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                    <UserIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Contact Information</h2>
                    <p className="text-slate-600 mt-1">How can our team reach you to discuss your growth strategy?</p>
                  </div>
                </div>

                <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Full Name *
                      </label>
                      <input
                        {...form2.register('fullName')}
                        type="text"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder="Enter your full name"
                      />
                      {form2.formState.errors.fullName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form2.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Email Address *
                      </label>
                      <input
                        {...form2.register('email')}
                        type="email"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder="Enter your email address"
                      />
                      {form2.formState.errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form2.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <PhoneIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Phone Number *
                      </label>
                      <input
                        {...form2.register('phone')}
                        type="tel"
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                        placeholder="Enter your phone number with country code"
                      />
                      {form2.formState.errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form2.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Preferred Contact */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Preferred Contact Method *
                      </label>
                      <select
                        {...form2.register('preferredContact')}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      >
                        <option value="">Select your preferred contact method</option>
                        {contactMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                      {form2.formState.errors.preferredContact && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form2.formState.errors.preferredContact.message}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Business Address *
                      </label>
                      <textarea
                        {...form2.register('address')}
                        rows={3}
                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg resize-none"
                        placeholder="Enter your complete business address"
                      />
                      {form2.formState.errors.address && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                          {form2.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="group bg-slate-200 text-slate-700 px-8 py-4 rounded-xl hover:bg-slate-300 transition-all duration-300 flex items-center text-lg font-semibold"
                    >
                      <ArrowLeftIcon className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                      Back to Business Info
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="p-8 lg:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircleIcon className="h-12 w-12 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold text-slate-900 mb-4">Application Submitted Successfully!</h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Thank you for your interest in GrowthPro. We've received your application and our team will review it shortly.
                </p>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">What happens next?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Review & Analysis</h4>
                      <p className="text-slate-600 text-sm">Our team reviews your application within 24 hours</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Strategy Call</h4>
                      <p className="text-slate-600 text-sm">We contact you to discuss your personalized growth strategy</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Get Started</h4>
                      <p className="text-slate-600 text-sm">Begin your journey to business growth and success</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Need immediate assistance?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <EnvelopeIcon className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                      <p className="font-semibold">Email Support</p>
                      <a href="mailto:support@growthpro.com" className="text-blue-300 hover:text-white transition-colors">
                        support@growthpro.com
                      </a>
                    </div>
                    <div className="text-center">
                      <PhoneIcon className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                      <p className="font-semibold">Phone Support</p>
                      <a href="tel:+15551234567" className="text-blue-300 hover:text-white transition-colors">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  <p className="text-blue-200 text-sm mt-4">
                    Expected response time: 4-6 hours during business hours
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;