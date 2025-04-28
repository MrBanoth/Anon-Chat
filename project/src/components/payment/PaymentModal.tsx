import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../ui/Button';
import { X, CreditCard, Smartphone, Copy, Share2, Download, ArrowLeft } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  amount,
  onClose,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | null>(null);
  const [upiId, setUpiId] = useState('9390730129-3@ibl');
  const [copiedId, setCopiedId] = useState('');
  
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  const upiApps = [
    { name: 'Google Pay', id: 'gpay', icon: '/gpay-icon.png' },
    { name: 'PhonePe', id: 'phonepe', icon: '/phonepe-icon.png' },
    { name: 'Paytm', id: 'paytm', icon: '/paytm-icon.png' },
    { name: 'BHIM', id: 'bhim', icon: '/bhim-icon.png' },
  ];

  const handleUPIPayment = (appId: string) => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`;
    
    // Map of app-specific URL schemes
    const appSchemes: Record<string, string> = {
      'gpay': `gpay://upi/pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`,
      'phonepe': `phonepe://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`,
      'paytm': `paytm://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`,
      'bhim': `upi://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`
    };
  
    const appUrl = appSchemes[appId] || upiUrl;
    window.location.href = appUrl;
    
    // Set a timeout to trigger success callback
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const handleCopyUpiId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleShareQR = async () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pay with UPI',
          text: `Pay ₹${amount} to VoidWhispers`,
          url: upiUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'void-whispers-payment-qr.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-secondary/30 backdrop-blur-md rounded-xl border border-primary-500/20 max-w-md w-full overflow-hidden"
      >
        <div className="p-6 border-b border-primary-500/20 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-primary-400">Complete Payment</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
            aria-label="Close payment modal"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-400">Amount to pay</p>
            <p className="text-3xl font-bold text-primary-400">₹{amount}</p>
          </div>

          {!selectedMethod ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id as 'card' | 'upi')}
                  className="w-full p-4 border border-primary-500/20 rounded-lg hover:border-primary-500/40 hover:bg-primary-500/10 flex items-center space-x-4 transition-colors group"
                >
                  <div className="text-primary-400 group-hover:text-primary-300">{method.icon}</div>
                  <span className="font-medium text-gray-300">{method.name}</span>
                </motion.button>
              ))}
            </div>
          ) : selectedMethod === 'upi' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {upiApps.map((app) => (
                  <motion.button
                    key={app.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUPIPayment(app.id)}
                    className="p-4 border border-primary-500/40 rounded-lg hover:border-primary-600 hover:bg-primary-600/20 flex flex-col items-center space-y-2 transition-colors"
                  >
                    <Smartphone className="w-8 h-8 text-primary-500" />
                    <span className="text-sm font-medium text-primary-500">{app.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col items-center space-y-4 bg-secondary/30 p-6 rounded-lg border border-primary-500/20">
                <QRCodeSVG 
                  value={`upi://pay?pa=${upiId}&pn=VoidWhispers&am=${amount}&cu=INR`}
                  size={200}
                  bgColor="transparent"
                  fgColor="#14b8a6"
                  level="H"
                  includeMargin={true}
                />
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShareQR}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    <Share2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadQR}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    <Download size={18} />
                  </Button>
                </div>

                <div className="w-full space-y-2">
                  <p className="text-sm text-gray-400 text-center">UPI IDs</p>
                  {['9390730129-3@ibl', 'sandeepnaikb0@ibl', '9390730129-3@axl'].map((id) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-primary-500/20"
                    >
                      <span className="text-sm font-mono text-primary-400">{id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUpiId(id)}
                        className="text-primary-400 hover:text-primary-300"
                      >
                        {copiedId === id ? (
                          <span className="text-xs">Copied!</span>
                        ) : (
                          <Copy size={14} />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 bg-secondary/30 border border-primary-500/20 rounded-lg text-gray-300 focus:border-primary-500/40 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-2 bg-secondary/30 border border-primary-500/20 rounded-lg text-gray-300 focus:border-primary-500/40 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-2 bg-secondary/30 border border-primary-500/20 rounded-lg text-gray-300 focus:border-primary-500/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            {selectedMethod && (
              <Button
                variant="outline"
                onClick={() => setSelectedMethod(null)}
                fullWidth
                className="border-primary-500/20 text-primary-400 hover:bg-primary-500/10"
                leftIcon={<X size={18} />}
              >
                Back
              </Button>
            )}
            <Button
              onClick={onSuccess}
              fullWidth
              className="bg-primary-500 text-black hover:bg-primary-400"
              disabled={!selectedMethod}
            >
              Pay ₹{amount}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};