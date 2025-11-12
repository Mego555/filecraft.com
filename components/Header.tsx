
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { User } from '../types';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
    onReset: () => void;
    hasContent: boolean;
    user: User;
    onProfileClick: () => void;
}

const SubscriptionStatus: React.FC<{ user: User }> = ({ user }) => {
    if (user.subscription === 'Pro') {
        return <span className="px-2.5 py-1 text-xs font-semibold text-cyan-200 bg-cyan-600/50 rounded-full">Pro Plan</span>;
    }
    if (user.subscription === 'Free Trial' && user.trialEndsAt) {
        const now = new Date().getTime();
        const ends = user.trialEndsAt;
        const daysLeft = Math.ceil((ends - now) / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
            return <span className="px-2.5 py-1 text-xs font-semibold text-yellow-200 bg-yellow-600/50 rounded-full">Trial: {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left</span>;
        }
    }
    return null;
};

export const Header: React.FC<HeaderProps> = ({ onReset, hasContent, user, onProfileClick }) => {
    return (
        <header className="flex justify-between items-center pb-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
                <SparklesIcon className="h-8 w-8 text-cyan-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    FileCraft
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                {hasContent && (
                    <button 
                        onClick={onReset}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                    >
                        Analyze New File
                    </button>
                )}
                 <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-3">
                      <SubscriptionStatus user={user} />
                      <span className="text-sm text-gray-400">Welcome, {user.name.split(' ')[0]}!</span>
                    </div>
                    <button
                        onClick={onProfileClick}
                        className="flex items-center justify-center h-10 w-10 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                        aria-label="Open user profile"
                    >
                        <UserIcon className="h-5 w-5 text-gray-300" />
                    </button>
                </div>
            </div>
        </header>
    );
};
