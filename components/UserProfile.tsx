
import React from 'react';
import { User, ConversionHistoryEntry } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { UserIcon } from './icons/UserIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { SubscriptionIcon } from './icons/SubscriptionIcon';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  history: ConversionHistoryEntry[];
  onLogout: () => void;
  onSettingsChange: (settings: User['settings']) => void;
  onUpgradeClick: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center text-cyan-300 mb-3">
            {icon}
            <h3 className="font-semibold ml-2">{title}</h3>
        </div>
        {children}
    </div>
);

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, user, history, onLogout, onSettingsChange, onUpgradeClick }) => {
    if (!isOpen) return null;

    const handleSettingToggle = (key: keyof User['settings']) => {
        onSettingsChange({
            ...user.settings,
            [key]: !user.settings[key]
        });
    };
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const getSubscriptionInfo = () => {
        switch (user.subscription) {
            case 'Pro':
                return { text: 'Your Pro plan is active.', statusClass: 'text-green-400' };
            case 'Free Trial':
                if (user.trialEndsAt) {
                    const daysLeft = Math.ceil((user.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24));
                    return { text: `You have ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left in your trial.`, statusClass: 'text-yellow-400' };
                }
                return { text: 'Free Trial', statusClass: 'text-yellow-400' };
            case 'Expired':
                return { text: 'Your trial has expired.', statusClass: 'text-red-400' };
            default:
                return { text: 'Unknown status', statusClass: 'text-gray-400' };
        }
    };
    
    const { text: subText, statusClass: subStatusClass } = getSubscriptionInfo();


    return (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true" onClick={onClose}></div>

            {/* Panel */}
            <div className={`relative z-10 flex flex-col w-full max-w-md bg-gray-900 border-l border-gray-700 shadow-xl transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ml-auto`}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Profile & Settings</h2>
                    <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </header>

                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    <InfoCard title="Account" icon={<UserIcon className="h-5 w-5" />}>
                        <div className="text-sm">
                            <p className="font-medium text-white">{user.name}</p>
                            <p className={`font-semibold ${subStatusClass}`}>{user.subscription} Plan</p>
                        </div>
                    </InfoCard>

                    <InfoCard title="Subscription" icon={<SubscriptionIcon className="h-5 w-5" />}>
                        <div className="text-sm space-y-3">
                           <p className="text-gray-300">{subText}</p>
                            {user.subscription !== 'Pro' && (
                                <button onClick={onUpgradeClick} className="w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                                    {user.subscription === 'Expired' ? 'Renew Subscription' : 'Upgrade to Pro'}
                                </button>
                            )}
                        </div>
                    </InfoCard>

                    <InfoCard title="Settings" icon={<SettingsIcon className="h-5 w-5" />}>
                        <div className="space-y-3 text-sm">
                            <Toggle label="Dark Mode" enabled={user.settings.darkMode} onChange={() => handleSettingToggle('darkMode')} />
                            <Toggle label="Email Notifications" enabled={user.settings.notifications} onChange={() => handleSettingToggle('notifications')} />
                        </div>
                    </InfoCard>

                    <InfoCard title="Conversion History" icon={<HistoryIcon className="h-5 w-5" />}>
                        {history.length > 0 ? (
                            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 -mr-2">
                                {history.map(item => (
                                    <li key={item.id} className="text-sm p-3 bg-gray-900/50 rounded-md">
                                        <p className="font-medium text-gray-200 truncate" title={item.originalName}>{item.originalName}</p>
                                        <p className="text-gray-400">
                                            Converted from <strong>{item.fromFormat}</strong> to <strong>{item.toFormat}</strong>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{timeAgo(item.timestamp)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No conversions yet. Analyze and convert a file to see your history here.</p>
                        )}
                    </InfoCard>
                </div>

                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button onClick={onLogout} className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600/80 rounded-md hover:bg-red-600 transition-colors">
                        Sign Out
                    </button>
                </footer>
            </div>
        </div>
    );
};
