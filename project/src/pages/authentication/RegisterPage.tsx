import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { AtSign, Lock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, enterAsGuest } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    preferredGender: 'any',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await signup(
        formData.name,
        formData.email,
        formData.password
      );
      
      if (success) {
        navigate('/chat');
      } else {
        setErrors(prev => ({
          ...prev,
          email: 'Account creation failed. Try again.',
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuestEntry = () => {
    enterAsGuest();
    navigate('/chat');
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 flex justify-center items-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Join AnonChat and start connecting</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              leftIcon={<User size={18} />}
              error={errors.name}
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              leftIcon={<AtSign size={18} />}
              error={errors.email}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Gender
                </label>
              <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-primary-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-foreground"
              required
            >
              <option value="" className="text-primary-foreground">Select Gender</option>
              <option value="male" className="text-primary-foreground">Male</option>
              <option value="female" className="text-primary-foreground">Female</option>
            </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-destructive">{errors.gender}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary-foreground mb-1">
                  Preferred Match
                </label>
            <select
              name="preferredGender"
              value={formData.preferredGender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-primary-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-primary-foreground"
            >
              <option value="any" className="text-primary-foreground">Any Gender</option>
              <option value="male" className="text-primary-foreground">Male</option>
              <option value="female" className="text-primary-foreground">Female</option>
            </select>
              </div>
            </div>
            
            <Input
              label="Password"
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              leftIcon={<Lock size={18} />}
              error={errors.password}
              required
            />
            
            <Input
              label="Confirm Password"
              type="text"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword}
              required
            />
            
            <div className="flex items-center mt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <motion.div 
              className="pt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<UserPlus size={18} />}
              >
                Create Account
              </Button>
            </motion.div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleGuestEntry}
                leftIcon={<User size={18} />}
              >
                Enter as Guest
              </Button>
            </motion.div>
          </div>
          
          <p className="text-center mt-8 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};