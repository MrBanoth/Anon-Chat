import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending reset email
    setTimeout(() => {
      setMessage('If an account with that email exists, a reset link has been sent.');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a password reset link.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {message && <p className="text-green-600">{message}</p>}
            <Button type="submit" fullWidth isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Remembered your password?{' '}
            <button 
              type="button" 
              className="text-primary-600 hover:text-primary-500 font-medium"
              onClick={() => navigate('/auth/login')}
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
