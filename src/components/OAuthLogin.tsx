/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.COMPONENT
TAG: UI.BEAST.OAUTH_LOGIN

5WH:
WHAT = OAuth Authentication Component
WHY = Replace text-based credential input with social login
WHO = Leeway Innovations
WHERE = src/components/OAuthLogin.tsx
WHEN = 2026-04-28
HOW = OAuth 2.0 with multiple provider buttons

AGENTS: ARIA, GOVERNOR
LICENSE: MIT
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, MessageCircle, Zap, Globe, AlertCircle } from 'lucide-react';
import { Card, Button } from './UI';
import { OAuthService, OAuthAccount } from '../services/oauth';

interface OAuthLoginProps {
  onSuccess: (account: OAuthAccount) => void;
  selectedLevel: string;
}

export const OAuthLogin: React.FC<OAuthLoginProps> = ({ onSuccess, selectedLevel }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<OAuthAccount[]>([]);

  const iconMap = {
    Github,
    MessageCircle,
    Zap,
    Globe,
  };

  const handleOAuthLogin = async (provider: 'github' | 'discord' | 'huggingface' | 'google') => {
    try {
      setLoading(provider);
      setError(null);
      
      // Check if already connected
      const existing = connectedAccounts.find(acc => acc.provider === provider);
      if (existing) {
        onSuccess(existing);
        setLoading(null);
        return;
      }

      const account = await OAuthService.signIn(provider);
      setConnectedAccounts(prev => [...prev, account]);
      onSuccess(account);
      setLoading(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(null);
    }
  };

  const providers = [
    { id: 'github', label: 'GitHub', icon: 'Github', color: 'bg-black text-white hover:bg-neutral-800' },
    { id: 'discord', label: 'Discord', icon: 'MessageCircle', color: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 'huggingface', label: 'Hugging Face', icon: 'Zap', color: 'bg-yellow-500 text-black hover:bg-yellow-600' },
    { id: 'google', label: 'Google', icon: 'Globe', color: 'bg-blue-600 text-white hover:bg-blue-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 w-full max-w-sm text-left"
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Secure Sign In</h2>
        <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">
          Continue with a provider. Sign-in and account creation stay inside their own secure flow.
        </p>
      </div>

      {/* Connected Accounts Display */}
      {connectedAccounts.length > 0 && (
        <Card brutal className="bg-emerald-50 border-emerald-500">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-900 mb-2">Connected Accounts</h3>
          <div className="space-y-1">
            {connectedAccounts.map(account => (
              <div key={account.provider} className="text-[10px] font-bold text-emerald-900">
                ✓ {account.provider.toUpperCase()}: {account.username}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 border-2 border-red-500 rounded flex gap-2 items-start"
          >
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-red-900">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAuth Buttons */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-500 text-center">
          Choose one provider to enter the platform
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {providers.map(provider => {
            const Icon = iconMap[provider.icon as keyof typeof iconMap];
            const isConnected = connectedAccounts.some(acc => acc.provider === provider.id);
            
            return (
              <motion.button
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin(provider.id as 'github' | 'discord' | 'huggingface' | 'google')}
                disabled={loading === provider.id}
                className={`p-4 rounded border-2 border-black font-black uppercase tracking-widest text-xs transition-all flex flex-col items-center gap-2 ${
                  isConnected 
                    ? 'bg-emerald-500 text-black border-emerald-900' 
                    : `${provider.color} border-black`
                } ${loading === provider.id ? 'opacity-75 cursor-wait' : 'cursor-pointer'}`}
              >
                {Icon && <Icon size={20} />}
                <span className="text-[10px]">{loading === provider.id ? 'Loading...' : provider.label}</span>
                {isConnected && <span className="text-[8px]">✓ Connected</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Path Setup */}
      <Card brutal className="bg-black border-white/20">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Learning Path Set</p>
          <p className="text-[10px] font-bold text-white leading-relaxed">
            Your learning path is set to <span className="text-emerald-400 uppercase">{selectedLevel}</span>.
          </p>
          <p className="text-[10px] font-bold text-white/60 leading-relaxed">
            We use the provider session to recognize the learner, attach progress, and unlock certification tracks.
          </p>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="bg-white/5">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-cyan-400">What This Does</p>
          <ul className="text-[9px] font-bold text-white/70 space-y-1">
            <li>✓ Lets the provider handle sign-in and sign-up</li>
            <li>✓ Creates a learner identity inside BEAST automatically</li>
            <li>✓ Links progress to the signed-in account</li>
            <li>✓ Keeps certification access tied to the same profile</li>
            <li>✓ Removes manual username entry completely</li>
          </ul>
        </div>
      </Card>

      {/* Ready Button */}
      <Button 
        size="xl" 
        variant="brutal" 
        className="w-full bg-emerald-500"
        disabled={connectedAccounts.length === 0}
        onClick={() => {
          if (connectedAccounts.length > 0) {
            onSuccess(connectedAccounts[0]);
          }
        }}
      >
        {connectedAccounts.length > 0 
          ? 'Initialize Curriculum' 
          : 'Connect an Account to Continue'}
      </Button>
    </motion.div>
  );
};
