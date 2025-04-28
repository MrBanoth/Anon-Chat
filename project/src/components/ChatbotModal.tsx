import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageInput } from './chat/MessageInput';
import { useAuthStore } from '../store/authStore';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose, userId }) => {
  const { isPremium, isGuest } = useAuthStore();

  const [messages, setMessages] = useState<string[]>([
    "Hello! I'm Sara, your AI assistant for Anon_Chat. How can I help you today?"
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);

  const [isVanishMode, setIsVanishMode] = useState(false);
  const [wallpaper, setWallpaper] = useState<string>('default');

  const GEMINI_API_KEY = 'AIzaSyAZE0bNt96PyCmgMOmodsrDMrVoRsMMb4k';

  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [lastMessageToSpeak, setLastMessageToSpeak] = useState('');
  const messageQueue = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('susan') ||
        v.name.toLowerCase().includes('karen')
      );
      setVoice(femaleVoice || voices[0] || null);
    }
  }, []);

  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.startsWith('Sara: ')) {
        setLastMessageToSpeak(msg.substring(6));
        break;
      }
    }
  }, [messages]);

  const speakChunks = (text: string) => {
    if (!('speechSynthesis' in window) || !voice) return;
    const chunkSize = 120;
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      let end = start + chunkSize;
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > start) {
          end = lastSpace;
        }
      }
      chunks.push(text.substring(start, end));
      start = end;
    }
    messageQueue.current = chunks;
    speakNextChunk();
  };

  const speakNextChunk = () => {
    if (messageQueue.current.length === 0) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setCurrentUtterance(null);
      return;
    }
    if (isSpeakingRef.current) return;

    const chunk = messageQueue.current.shift()!;
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.voice = voice;
    utterance.pitch = 1.5;
    utterance.rate = 1.1;
    utterance.volume = 1.0;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setCurrentUtterance(null);
      speakNextChunk();
    };

    utterance.onerror = () => {
      messageQueue.current = [];
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setCurrentUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setCurrentUtterance(utterance);
  };

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window && voice) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakChunks(message);
        setLastMessageToSpeak(message);
      }, 50);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = `You: ${input}`;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `You are Sara, an AI assistant for the Anon_Chat website. The current user ID is ${userId}. Provide helpful, user-friendly answers about how to use the website features. For example, if asked how to logout, say: 'You can logout from the top right corner.' Now, answer the user's question accordingly: ${input}` }]
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setError(`API Error: ${errorText}`);
        setMessages(prev => [...prev, "Sara: Sorry, I couldn't process your request."]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      let aiMessage = data?.candidates?.[0]?.content || data?.message || "Sara: Sorry, I couldn't understand that.";
      if (typeof aiMessage === 'object') {
        if (Array.isArray(aiMessage.parts)) {
          aiMessage = aiMessage.parts.map((part: any) => part.text).join('');
        } else {
          aiMessage = JSON.stringify(aiMessage);
        }
      }
      const emojis = ['🤖', '🎉', '✨', '🔥', '💡', '🚀', '😎', '🌟', '🎈', '🤩'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const aiMessageWithEmoji = `${aiMessage} ${randomEmoji}`;

      setMessages(prev => [...prev, `Sara: ${aiMessageWithEmoji}`]);
      if (isSpeakingEnabled) {
        speakMessage(aiMessageWithEmoji);
      }
    } catch (err) {
      setError(`Network Error: ${err}`);
      setMessages(prev => [...prev, "Sara: Sorry, there was an error processing your request."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMessages(["Hello! I'm Sara, your AI assistant for Anon_Chat. How can I help you today?"]);
      setInput('');
      setError(null);
    }
  }, [isOpen]);

  const toggleVanishMode = () => {
    setIsVanishMode(prev => !prev);
  };

  const changeWallpaper = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-[1040]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed w-80 max-w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-3xl flex flex-col z-[1050] relative border-4 border-indigo-500 hover:border-indigo-700 transition-colors duration-300"
            style={{ bottom: 24, right: 24, height: '560px', backgroundImage: wallpaper !== 'default' ? `url(/wallpapers/${wallpaper}.jpg)` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-5 flex justify-between items-center text-white font-bold text-xl rounded-t-2xl shadow-inner">
              <style>
                {`
                  @keyframes blink {
                    0%, 20%, 40%, 60%, 80%, 100% {
                      opacity: 1;
                    }
                    10%, 30%, 50%, 70%, 90% {
                      opacity: 0.1;
                    }
                  }
                  .blinking-eye {
                    animation: blink 3s infinite;
                    transform-origin: center;
                  }
                `}
              </style>
              <span className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
                </svg>
                <span className="text-white font-semibold text-lg select-none">Sara - AI Assistant</span>
              </span>
              <button onClick={onClose} className="text-white text-3xl font-extrabold hover:text-red-500 transition-colors duration-200">&times;</button>
            </div>

            {isPremium && (
              <div className="p-4 border-b border-indigo-600 flex flex-col space-y-2 text-white">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVanishMode}
                    onChange={toggleVanishMode}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span>Enable Vanish Mode (Premium)</span>
                </label>
                <div>
                  <label htmlFor="wallpaper-select" className="block mb-1">Select Wallpaper (Premium):</label>
                  <select
                    id="wallpaper-select"
                    value={wallpaper}
                    onChange={e => changeWallpaper(e.target.value)}
                    className="w-full bg-indigo-800 border border-indigo-600 rounded px-2 py-1 text-white"
                  >
                    <option value="default">Default</option>
                    <option value="stars">Stars</option>
                    <option value="mountains">Mountains</option>
                    <option value="ocean">Ocean</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex-grow overflow-y-auto space-y-3 pb-32 px-4 text-white scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900 rounded-b-lg">
              {messages.map((msg, idx) => {
                const isAIMessage = msg.startsWith('Sara: ');
                const messageText = isAIMessage ? msg.substring(6) : msg;
                return (
                  <div
                    key={idx}
                    className={`text-base whitespace-pre-wrap flex items-start space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isAIMessage ? 'bg-indigo-900 bg-opacity-70 text-white' : 'bg-indigo-700 bg-opacity-50 text-indigo-100'
                    }`}
                  >
                    {isAIMessage && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-md mt-1" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
                      </svg>
                    )}
                    <div className="flex flex-col flex-1">
                      {isAIMessage && (
                        <span className="text-indigo-300 font-semibold mb-1 select-none">Sara</span>
                      )}
                      <span>{messageText}</span>
                    </div>
                    {isAIMessage && (
                      <button
                        onClick={() => {
                          if (isSpeaking) {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                            setCurrentUtterance(null);
                          }
                          speakMessage(messageText);
                        }}
                        disabled={isSpeaking}
                        className={`text-indigo-400 hover:text-indigo-300 focus:outline-none ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isSpeaking ? "Speaking..." : "Speak this reply"}
                        aria-label="Speak this reply"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                          <path d="M5 9v6h4l5 5V4L9 9H5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
              {isLoading && <div className="text-sm italic text-indigo-300">Sara is typing...</div>}
              {error && <div className="text-sm text-red-500 font-semibold">{error}</div>}
            </div>
            <div className="p-4 border-t border-indigo-700 flex flex-col space-y-3 bg-indigo-900 sticky bottom-0 shadow-inner border-t border-indigo-600 z-[1070] rounded-b-2xl">
              <MessageInput
                onSendMessage={async (text: string, options?: { vanish?: boolean; timer?: number }) => {
                  if (!text.trim()) return;
                  const userMessage = `You: ${text}`;
                  setMessages(prev => [...prev, userMessage]);
                  setInput('');
                  setIsLoading(true);
                  setError(null);

                  try {
                    const response = await fetch(
                      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          contents: [
                            {
                              parts: [{ text: `You are Sara, an AI assistant for the Anon_Chat website. The current user ID is ${userId}. Provide helpful, user-friendly answers about how to use the website features. For example, if asked how to logout, say: 'You can logout from the top right corner.' Now, answer the user's question accordingly: ${text}` }]
                            }
                          ]
                        }),
                      }
                    );

                    if (!response.ok) {
                      const errorText = await response.text();
                      setError(`API Error: ${errorText}`);
                      setMessages(prev => [...prev, "Sara: Sorry, I couldn't process your request."]);
                      setIsLoading(false);
                      return;
                    }

                    const data = await response.json();
                    let aiMessage = data?.candidates?.[0]?.content || data?.message || "Sara: Sorry, I couldn't understand that.";
                    if (typeof aiMessage === 'object') {
                      if (Array.isArray(aiMessage.parts)) {
                        aiMessage = aiMessage.parts.map((part: any) => part.text).join('');
                      } else {
                        aiMessage = JSON.stringify(aiMessage);
                      }
                    }
                    const emojis = ['🤖', '🎉', '✨', '🔥', '💡', '🚀', '😎', '🌟', '🎈', '🤩'];
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    const aiMessageWithEmoji = `${aiMessage} ${randomEmoji}`;

                    setMessages(prev => [...prev, `Sara: ${aiMessageWithEmoji}`]);
                    if (isSpeakingEnabled) {
                      speakMessage(aiMessageWithEmoji);
                    }
                  } catch (err) {
                    setError(`Network Error: ${err}`);
                    setMessages(prev => [...prev, "Sara: Sorry, there was an error processing your request."]);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                isPremium={isPremium}
              />
            </div>
            <div
              className="p-4 border border-indigo-600 bg-indigo-800 flex items-center justify-center cursor-pointer select-none fixed bottom-6 right-6 rounded-full shadow-lg z-[1060] hover:bg-indigo-700 transition-colors duration-200"
              title={isSpeaking ? "Stop Speaking" : isSpeakingEnabled ? "Disable Speak Replies" : "Enable Speak Replies"}
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setCurrentUtterance(null);
                  setIsSpeakingEnabled(false);
                } else {
                  if (lastMessageToSpeak) {
                    speakMessage(lastMessageToSpeak);
                    setIsSpeakingEnabled(true);
                  } else {
                    setIsSpeakingEnabled(!isSpeakingEnabled);
                  }
                }
              }}
            >
              {(isSpeaking || isSpeakingEnabled) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M5 9v6h4l5 5V4L9 9H5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5v14l5-7-5-7z" />
                </svg>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
