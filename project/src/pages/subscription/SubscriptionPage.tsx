import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { PricingCard } from '../../components/subscription/PricingCard';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { Subscription, SubscriptionPlan } from '../../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isPremium, isLoggedIn, upgradeToPremuim } = useAuthStore();
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    SubscriptionPlan.PREMIUM
  );
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('success');
  
  const subscriptionPlans: Subscription[] = [
    {
      plan: SubscriptionPlan.FREE,
      price: 0,
      currency: '₹',
      features: [
        'Anonymous chatting',
        'Random user matching',
        'Basic chat features',
        'Ad-supported experience',
      ],
    },
    {
      plan: SubscriptionPlan.PREMIUM,
      price: 20,
      currency: '₹',
      features: [
        'Everything in Free plan',
        'Vanish mode - messages that disappear',
        'No advertisements',
        'Priority user matching',
        'Premium profile badge',
        'Gender-based matching',
      ],
    },
  ];
  
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPaymentStatus('idle');
  };
  
  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
    
    if (selectedPlan === SubscriptionPlan.FREE || isPremium) {
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    setShowPaymentModal(false);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      upgradeToPremuim();
      setIsProcessing(false);
    }, 2000);
  };
  
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-3xl font-bold mb-4 text-primary-foreground">Choose Your Plan</h1>
          <p className="text-primary-500 text-lg">
            Select the plan that best fits your chatting needs
          </p>
        </motion.div>
        
        <AnimatePresence>
          {paymentStatus === 'success' && (
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  className="mb-8 bg-green-50 border border-green-500 text-green-700 p-4 rounded-lg flex items-center"
>
  <CheckCircle2 className="h-5 w-5 mr-2" />
  <span>Payment successful! Your account has been upgraded to Premium.</span>
</motion.div>
          )}
        
          {paymentStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-error-50 border border-error-500 text-error-700 p-4 rounded-lg flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>There was an error processing your payment. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.plan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PricingCard
                plan={plan}
                isActive={
                  (isPremium && plan.plan === SubscriptionPlan.PREMIUM) ||
                  (!isPremium && plan.plan === SubscriptionPlan.FREE)
                }
                onSelect={() => handleSelectPlan(plan.plan)}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-300"
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Complete your purchase</h3>
          
          <div className="mb-6">
            <div className="flex justify-between py-3 border-b border-gray-300">
              <span className="text-gray-800 font-medium">Premium Plan (Monthly)</span>
              <span className="text-gray-800 font-medium">₹20.00</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-gray-900">
              <span>Total</span>
              <span>₹20.00</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-6">
            By clicking "Upgrade to Premium", you agree to our terms and conditions for subscription services.
          </p>
          
          <Button
            fullWidth
            isLoading={isProcessing}
            onClick={handleUpgrade}
          >
            Upgrade to Premium
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            amount={20}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};