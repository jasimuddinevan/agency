import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

interface PasswordChangeFormProps {
  onSuccess?: () => void;
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSuccess }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const newPassword = watch('newPassword', '');

  // Calculate password strength
  React.useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 1;
    if (newPassword.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    // Normalize to 0-100
    setPasswordStrength(Math.min(100, Math.round((strength / 6) * 100)));
  }, [newPassword]);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Moderate';
    return 'Strong';
  };

  const onSubmit = async (data: { newPassword: string }) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              {...register('newPassword')}
              type={showNewPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.newPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password Strength:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength < 40 ? 'text-red-600' : 
                  passwordStrength < 70 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getStrengthColor()}`} 
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center text-xs">
                  {/[A-Z]/.test(newPassword) ? (
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                  )}
                  <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}>
                    Uppercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {/[a-z]/.test(newPassword) ? (
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                  )}
                  <span className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}>
                    Lowercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {/[0-9]/.test(newPassword) ? (
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                  )}
                  <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}>
                    Number
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {/[^A-Za-z0-9]/.test(newPassword) ? (
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                  )}
                  <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}>
                    Special character
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {newPassword.length >= 8 ? (
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-gray-400 mr-1" />
                  )}
                  <span className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                    8+ characters
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Security Tip</h4>
              <p className="text-sm text-blue-700 mt-1">
                Choose a unique password that you don't use for other accounts. A strong password is your first line of defense against unauthorized access.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Password...
              </>
            ) : (
              <>
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;