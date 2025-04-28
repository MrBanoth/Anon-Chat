import React, { useState } from 'react';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    "Hello! I'm Sara, your AI assistant. How can I help you today?"
  ]);
  const [input, setInput] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, `You: ${input}`]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, "Sara: I'm here to assist you!"]);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '50%',
          width: 60,
          height: 60,
          fontSize: 24,
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        aria-label="Toggle Chatbot"
      >
        💬
      </button>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 320,
            maxHeight: 400,
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '12px 16px',
              fontWeight: 'bold',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            Sara - AI Assistant
          </div>
          <div
            style={{
              flexGrow: 1,
              padding: 12,
              overflowY: 'auto',
              fontSize: 14,
              color: '#333',
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                {msg}
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #ddd' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSend}
              style={{
                marginTop: 8,
                width: '100%',
                padding: 10,
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};
