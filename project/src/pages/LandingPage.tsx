import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { MessageCircle, Shield, Zap, Users, Heart, Star, Gift, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, enterAsGuest, user } = useAuthStore();
  
  const handleGuestEntry = () => {
    enterAsGuest();
    navigate('/chat');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* User Info on right side corner */}
      {isLoggedIn && user && (
        <div className="fixed top-4 right-4 bg-background/80 backdrop-blur-md rounded-lg shadow-lg p-4 flex items-center space-x-4 z-50">
          <div className="font-semibold text-white">Hello, {user.name}</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/profile')}
          >
            Edit Profile
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-background text-foreground py-32 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"
        />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <MessageCircle className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-float" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-glow">
              Wel-Come to Anon_Chat
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-10 text-gray-400 max-w-3xl mx-auto"
          >
            Connect anonymously with kindred spirits. Share your thoughts freely in the digital void.
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {isLoggedIn ? (
              <Button 
                size="lg" 
                className="bg-primary-500 text-black hover:bg-primary-400 hover:scale-105 transform transition-all glow"
                onClick={() => navigate('/chat')}
              >
                Enter the Void
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary-500 text-black hover:bg-primary-400 hover:scale-105 transform transition-all glow"
                  onClick={() => navigate('/auth/register')}
                >
                  Create Your Identity
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:scale-105 transform transition-all"
                  onClick={handleGuestEntry}
                  leftIcon={<Ghost className="w-5 h-5" />}
                >
                  Enter as Phantom
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="max-w-6xl mx-auto px-4"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-bold text-center mb-16 text-glow"
          >
            Features of the Void
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeInUp}
              className="bg-secondary/20 backdrop-blur-sm p-8 rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-colors"
            >
              <div className="bg-primary-500/20 text-primary-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-primary-400">Smart Matching</h3>
              <p className="text-gray-400 text-center">
                Our quantum algorithm connects you with souls that resonate with your frequency.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-secondary/20 backdrop-blur-sm p-8 rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-colors"
            >
              <div className="bg-primary-500/20 text-primary-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-primary-400">Absolute Privacy</h3>
              <p className="text-gray-400 text-center">
                Your identity remains hidden in the shadows. Chat freely without a trace.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-secondary/20 backdrop-blur-sm p-8 rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-colors"
            >
              <div className="bg-primary-500/20 text-primary-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center text-primary-400">Ethereal Features</h3>
              <p className="text-gray-400 text-center">
                Experience supernatural abilities with vanishing messages and spectral presence.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Premium Section */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="lg:flex items-center gap-12"
          >
            <motion.div 
              variants={fadeInUp}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <h2 className="text-4xl font-bold mb-6 text-glow">Ascend to Ethereal</h2>
              <p className="text-xl text-gray-400 mb-8">
                Transcend the limitations of mortal communication with our premium features.
              </p>
              
              <ul className="space-y-6 mb-8">
                <motion.li 
                  variants={fadeInUp}
                  className="flex items-start"
                >
                  <div className="bg-primary-500/20 text-primary-400 rounded-full p-2 mr-4">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-primary-400">Spectral Selection</h4>
                    <p className="text-gray-400">Choose your preferred type of spirits to connect with.</p>
                  </div>
                </motion.li>
                
                <motion.li 
                  variants={fadeInUp}
                  className="flex items-start"
                >
                  <div className="bg-primary-500/20 text-primary-400 rounded-full p-2 mr-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-primary-400">Ethereal Messages</h4>
                    <p className="text-gray-400">Send messages that fade into the void after being read.</p>
                  </div>
                </motion.li>
                
                <motion.li 
                  variants={fadeInUp}
                  className="flex items-start"
                >
                  <div className="bg-primary-500/20 text-primary-400 rounded-full p-2 mr-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-primary-400">Priority Summoning</h4>
                    <p className="text-gray-400">Get matched faster with more compatible spirits.</p>
                  </div>
                </motion.li>
              </ul>
              
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/subscription')}
                  className="bg-primary-500 text-black hover:bg-primary-400 glow"
                >
                  Ascend Now - Only ₹20/cycle
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl border border-primary-500/20 overflow-hidden">
                <div className="bg-gradient-to-br from-primary-500/20 to-primary-900/20 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-primary-400">Ethereal Experience</h3>
                    <span className="bg-primary-500/20 px-3 py-1 rounded-full text-sm text-primary-400">Premium</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-400">Enhanced Privacy</h4>
                      <p className="text-sm text-gray-400">Your messages, your control</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <Heart className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-400">Smart Matching</h4>
                      <p className="text-sm text-gray-400">Find your ethereal companion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <Star className="text-primary-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-400">Ethereal Badge</h4>
                      <p className="text-sm text-gray-400">Stand out in the void</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary-900/50 to-background py-20"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 text-glow"
          >
            Enter the Void Today
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-10 text-gray-400"
          >
            Join thousands of spirits already connecting in the digital void.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {isLoggedIn ? (
              <Button 
                size="lg" 
                className="bg-primary-500 text-black hover:bg-primary-400 glow"
                onClick={() => navigate('/chat')}
              >
                Return to Void
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary-500 text-black hover:bg-primary-400 glow"
                  onClick={() => navigate('/auth/register')}
                >
                  Create Your Identity
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-500 text-primary-400 hover:bg-primary-500/10"
                  onClick={handleGuestEntry}
                  leftIcon={<Ghost className="w-5 h-5" />}
                >
                  Enter as Phantom
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <footer className="bg-background/80 text-gray-400 py-6 mt-12 text-center text-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-center space-x-8">
          <a href="/terms" className="hover:text-primary-400 transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-primary-400 transition-colors">Privacy</a>
          <a href="/help" className="hover:text-primary-400 transition-colors">Help</a>
        </div>
      </footer>
    </div>
  );
};
