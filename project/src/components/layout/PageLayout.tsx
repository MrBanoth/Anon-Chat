import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { MessageCircle, LogOut, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Link } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { user, isLoggedIn, isGuest, logout } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <MessageCircle className="text-primary-600 h-6 w-6" />
            <span className="font-bold text-xl text-gray-900">AnonChat</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {user && (
                  <div className="flex items-center space-x-2">
                    <Avatar name={user.name} color={user.avatarColor} size="sm" />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-primary-400">{user.name}</p>
                      {isGuest && <span className="text-xs text-primary-400">Guest</span>}
                    </div>
                  </div>
                )}
                {isGuest ? (
                  <Link to="/auth/register">
                    <Button size="sm" variant="primary" className="bg-primary-500 text-white hover:bg-primary-600">Sign Up</Button>
                  </Link>
                ) : (
                  <Link to="/profile">
                    <Button size="sm" variant="primary" className="bg-primary-500 text-white hover:bg-primary-600" leftIcon={<User size={16} />}>
                      Profile
                    </Button>
                  </Link>
                )}
                <Button 
                  size="sm" 
                  variant="primary"
                  className="bg-white text-primary-600 border border-primary-500 hover:bg-primary-50"
                  onClick={logout}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut size={18} className="text-primary-600" />
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth/login">
                  <Button size="sm" variant="primary" className="bg-primary-500 text-white hover:bg-primary-600">Sign In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" variant="primary" className="bg-primary-500 text-white hover:bg-primary-600">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-primary-foreground">
          <p>© {new Date().getFullYear()} AnonChat. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/terms" className="text-primary-500 hover:text-primary-600 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-primary-500 hover:text-primary-600 transition-colors">Privacy</Link>
            <Link to="/help" className="text-primary-500 hover:text-primary-600 transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};