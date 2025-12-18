
import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType, isNewUser: boolean) => void;
}

const COLORS = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-sky-500'];

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('用户名至少需要 3 个字符');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要 6 个字符');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('fc_accounts') || '{}');

    if (isRegister) {
      if (accounts[username]) {
        setError('该用户名已被注册');
        return;
      }
      const newUser: UserType = {
        username,
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        createdAt: new Date().toISOString()
      };
      accounts[username] = { ...newUser, password };
      localStorage.setItem('fc_accounts', JSON.stringify(accounts));
      onLogin(newUser, true);
    } else {
      const account = accounts[username];
      if (!account || account.password !== password) {
        setError('用户名或密码错误');
        return;
      }
      const { password: _, ...user } = account;
      onLogin(user, false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{isRegister ? '创建新账户' : '欢迎回来'}</h2>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isRegister ? 'Join the Font Discovery Lab' : 'Login to sync your fonts'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-black uppercase tracking-widest text-slate-500 ml-2">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                  placeholder="输入用户名"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black uppercase tracking-widest text-slate-500 ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                  placeholder="输入密码"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[12px] font-black border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
            >
              {isRegister ? '注册账户' : '立即登录'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[13px] font-black text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {isRegister ? '已有账户？点击登录' : '没有账户？立即加入灵感实验室'}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex items-center justify-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100">
          <Sparkles size={14} className="text-amber-400" /> Secure Encryption • Fast Sync • Private Lab
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
