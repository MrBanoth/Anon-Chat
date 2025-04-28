import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { Subscription } from '../../types';

interface PricingCardProps {
  plan: Subscription;
  isActive: boolean;
  onSelect: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isActive,
  onSelect,
}) => {
  return (
    <div 
      className={cn(
        'rounded-lg overflow-hidden border transition-all duration-300',
        isActive 
          ? 'border-primary-500 shadow-lg transform scale-105' 
          : 'border-gray-200 shadow hover:shadow-md'
      )}
    >
      <div className="p-6">
        <h3 className="font-bold text-xl mb-1 text-primary-foreground">
          {plan.plan === 'free' ? 'Free' : 'Premium'}
        </h3>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-primary-foreground">
            {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price}`}
          </span>
          {plan.price > 0 && <span className="text-primary-foreground">/month</span>}
        </div>
        
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check 
                size={18} 
                className={cn(
                  'mr-2 mt-0.5',
                  isActive ? 'text-primary-500' : 'text-gray-500'
                )} 
              />
              <span className={cn(
                isActive ? 'text-primary-foreground' : 'text-gray-700'
              )}>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          variant={isActive ? 'primary' : 'outline'}
          fullWidth
          onClick={onSelect}
          disabled={isActive}
        >
          {isActive ? 'Current Plan' : 'Select Plan'}
        </Button>
      </div>
    </div>
  );
};