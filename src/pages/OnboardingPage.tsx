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
  CheckIcon
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
    { number: 1, title: 'Business Information', icon: BuildingOfficeIcon },
    { number: 2, title: 'Personal Information', icon: UserIcon },
    { number: 3, title: 'Success', icon: CheckIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className={`text-sm ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 mx-4 h-0.5 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
                <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      {...form1.register('businessName')}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your business name"
                    />
                    {form1.formState.errors.businessName && (
                      <p className="mt-1 text-sm text-red-600">{form1.formState.errors.businessName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      {...form1.register('websiteUrl')}
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://your-website.com"
                    />
                    {form1.formState.errors.websiteUrl && (
                      <p className="mt-1 text-sm text-red-600">{form1.formState.errors.websiteUrl.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      {...form1.register('businessDescription')}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your business (minimum 10 characters)"
                    />
                    {form1.formState.errors.businessDescription && (
                      <p className="mt-1 text-sm text-red-600">{form1.formState.errors.businessDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      {...form1.register('industry')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                    {form1.formState.errors.industry && (
                      <p className="mt-1 text-sm text-red-600">{form1.formState.errors.industry.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Monthly Revenue *
                    </label>
                    <select
                      {...form1.register('monthlyRevenue')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your revenue range</option>
                      {revenueRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                    {form1.formState.errors.monthlyRevenue && (
                      <p className="mt-1 text-sm text-red-600">{form1.formState.errors.monthlyRevenue.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      Next Step
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...form2.register('fullName')}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {form2.formState.errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{form2.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...form2.register('email')}
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                    {form2.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{form2.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...form2.register('phone')}
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number with country code"
                    />
                    {form2.formState.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{form2.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <textarea
                      {...form2.register('address')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your business address"
                    />
                    {form2.formState.errors.address && (
                      <p className="mt-1 text-sm text-red-600">{form2.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method *
                    </label>
                    <select
                      {...form2.register('preferredContact')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your preferred contact method</option>
                      {contactMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                    {form2.formState.errors.preferredContact && (
                      <p className="mt-1 text-sm text-red-600">{form2.formState.errors.preferredContact.message}</p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 flex items-center"
                    >
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for your interest in GrowthPro. We've received your application and will review it shortly.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <p className="text-gray-600">Our team will review your application within 24 hours</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <p className="text-gray-600">We'll contact you via your preferred method to discuss your growth strategy</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <p className="text-gray-600">If approved, we'll schedule a strategy session to get started</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Need immediate assistance?</h3>
                  <p className="text-blue-700 mb-4">
                    Expected response time: 4-6 hours during business hours
                  </p>
                  <p className="text-blue-700">
                    Email: <a href="mailto:support@growthpro.com" className="underline">support@growthpro.com</a><br />
                    Phone: <a href="tel:+15551234567" className="underline">+1 (555) 123-4567</a>
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