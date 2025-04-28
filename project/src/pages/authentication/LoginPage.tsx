import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { AtSign, Lock, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, enterAsGuest } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    
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
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password, formData.rememberMe);
      
      if (success) {
        navigate('/chat');
      } else {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue to AnonChat</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <Link to="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot password?
              </Link>
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
                leftIcon={<LogIn size={18} />}
              >
                Sign In
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
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};