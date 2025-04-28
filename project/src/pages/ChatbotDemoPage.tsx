import React, { useState } from 'react';
import { ChatbotModal } from '../components/ChatbotModal';
import { Button } from '../components/ui/Button';

export const ChatbotDemoPage: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#1f2937' }}>Chatbot Demo - Sara</h1>
      <p style={{ marginBottom: '1rem', textAlign: 'center', color: '#4b5563', maxWidth: '24rem' }}>
        Click the button below to open the chatbot assistant named Sara. You can ask questions and get AI-powered responses.
      </p>
      <Button onClick={openChatbot} style={{ padding: '0.75rem 1.5rem', fontSize: '1.125rem' }}>
        Open Chatbot
      </Button>
      <ChatbotModal isOpen={isChatbotOpen} onClose={closeChatbot} />
    </div>
  );
};
