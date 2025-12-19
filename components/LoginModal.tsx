
import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

const COLORS = ['bg-rose-500', 'bg-red-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-sky-500'];

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (user: UserType, isNewUser: boolean) => void }> = ({ isOpen, onClose, onLogin }) => {
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
      {/* 统一遮挡背景 */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-10 h-10 bg-rose-600 rounded-[10px] flex items-center justify-center text-white mb-4 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-[18px] font-semibold text-slate-900">{isRegister ? '加入灵感实验室' : '欢迎回来'}</h2>
              <p className="text-[13px] text-slate-400 font-medium mt-1">
                {isRegister ? '即刻同步您的字体库' : '登录以管理您的收藏'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-[10px] transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-slate-400 ml-1">用户名 / USERNAME</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] font-medium outline-none focus:border-rose-500 focus:bg-white transition-all"
                  placeholder="输入用户名"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold uppercase tracking-widest text-slate-400 ml-1">密码 / PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[10px] pl-10 pr-10 py-2.5 text-[14px] font-medium outline-none focus:border-rose-500 focus:bg-white transition-all"
                  placeholder="输入密码"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-[10px] text-[13px] font-semibold border border-red-100 flex items-center gap-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-rose-600 text-white rounded-[10px] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-sm"
            >
              {isRegister ? '立即注册' : '登录系统'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {setIsRegister(!isRegister); setError('');}}
              className="text-[13px] font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              {isRegister ? '已有账户？点击登录' : '没有账户？创建新账户'}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
          <Sparkles size={12} className="text-amber-400" /> 加密传输 • 快速同步 • 个人实验室
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
