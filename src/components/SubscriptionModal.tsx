
import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CloseIcon } from './icons/CloseIcon';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (code: string) => boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onActivate }) => {
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleActivateClick = () => {
    setError(null);
    setIsActivating(true);
    const success = onActivate(activationCode);
    if (!success) {
      setTimeout(() => {
        setError('Invalid activation code. Please try again.');
        setIsActivating(false);
      }, 500);
    }
  };
  
  const handleClose = () => {
    setError(null);
    setActivationCode('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md w-full m-4 text-center relative">
        <button onClick={handleClose} className="absolute top-4 right-4 p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white">
            <CloseIcon className="h-6 w-6" />
        </button>
        <SparklesIcon className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Your Free Trial has Ended</h2>
        <p className="mt-2 text-gray-400">
          To continue using FileCraft, please activate your Pro plan.
        </p>

        <div className="mt-6 text-left">
           <label htmlFor="activation-code" className="block text-sm font-medium text-gray-300 mb-1">
                Activation Code
            </label>
            <input
                type="text"
                id="activation-code"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="Enter your code"
                className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
             {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        <div className="mt-6">
          <button
            onClick={handleActivateClick}
            disabled={isActivating || !activationCode}
            className="w-full px-6 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isActivating ? 'Activating...' : 'Activate Pro Plan - $10/year'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-4">
          You will receive an activation code upon purchase.
        </p>
      </div>
    </div>
  );
};
