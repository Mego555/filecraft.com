
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <SparklesIcon className="h-20 w-20 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Welcome to FileCraft
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Your intelligent assistant for file analysis and conversion.
          Unlock insights, get security warnings, and convert formats with the power of AI.
        </p>
        <div className="mt-8">
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-12 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Sign In & Get Started
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-6">
          By signing in, you agree to our imaginary Terms of Service.
        </p>
      </div>
    </div>
  );
};
