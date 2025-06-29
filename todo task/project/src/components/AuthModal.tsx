import React from 'react';
import { motion } from 'framer-motion';
import { X, Github, Mail, Facebook } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn } = useAuthStore();

  const handleSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      await signIn(provider);
      toast.success(`Signing in with ${provider}...`);
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-8 text-center">
          Sign in to access your tasks and collaborate with others
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <Mail size={20} />
            Continue with Google
          </button>
          
          <button
            onClick={() => handleSignIn('github')}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
          
          <button
            onClick={() => handleSignIn('facebook')}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Facebook size={20} />
            Continue with Facebook
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );
};