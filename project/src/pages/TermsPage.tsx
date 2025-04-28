import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to Anon_Chat. By using our service, you agree to the following terms and conditions.
      </p>
      <p className="mb-4">
        1. You must be at least 18 years old to use this service.
      </p>
      <p className="mb-4">
        2. You agree not to use the service for any unlawful or harmful purposes.
      </p>
      <p className="mb-4">
        3. We reserve the right to suspend or terminate accounts that violate our policies.
      </p>
      <p className="mb-4">
        4. Your use of the service is at your own risk. We provide no warranties or guarantees.
      </p>
      <p className="mb-4">
        5. These terms may be updated from time to time. Continued use constitutes acceptance.
      </p>
      <p>
        For full details, please contact support.
      </p>
    </div>
  );
};
