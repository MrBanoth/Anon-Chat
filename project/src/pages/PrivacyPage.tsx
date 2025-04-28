import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '768px', margin: 'auto', padding: '2rem', backgroundColor: 'white', color: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '1rem' }}>
        At Anon_Chat, your privacy is important to us. This policy explains how we collect, use, and protect your information.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        1. We collect only the information necessary to provide our services.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        2. We do not share your personal information with third parties without your consent.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        3. We use industry-standard security measures to protect your data.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        4. You have the right to access, modify, or delete your information.
      </p>
      <p style={{ marginBottom: '1rem' }}>
        5. This policy may be updated periodically. Continued use means acceptance.
      </p>
      <p>
        For any questions, please contact our support team.
      </p>
    </div>
  );
};
