
import React from 'react';
import { X, ShieldAlert, MessageCircle, Mail, MessageSquare, ExternalLink, Zap } from 'lucide-react';

interface DownloadContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const DownloadContactModal: React.FC<DownloadContactModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const isDarkTheme = theme === 'midnight';

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    card: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100',
    subText: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
  };

  const contactButtons = [
    {
      label: '微信客服',
      icon: <MessageCircle size={20} />,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      shadow: 'shadow-emerald-500/20',
      action: () => alert('正在呼叫微信客服...')
    },
    {
      label: 'QQ 客服',
      icon: <MessageSquare size={20} />,
      color: 'bg-sky-500 hover:bg-sky-600',
      shadow: 'shadow-sky-500/20',
      action: () => alert('正在打开 QQ 客服会话...')
    },
    {
      label: '邮件反馈',
      icon: <Mail size={20} />,
      color: 'bg-slate-700 hover:bg-slate-800',
      shadow: 'shadow-slate-700/20',
      action: () => window.location.href = 'mailto:support@fontcanvas.lab'
    }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className={`relative w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden expand-enter ${themeClasses.modal}`}>
        <header className={`p-6 border-b ${themeClasses.header} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg">
              <ShieldAlert size={18} />
            </div>
            <h2 className="text-[16px] font-bold">版权与下载说明</h2>
          </div>
          <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
            <X size={20} />
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldAlert size={40} className="text-rose-500" />
            </div>
            <h3 className="text-[20px] font-black leading-tight">为避免版权纠纷<br /><span className="text-rose-500">暂不提供直接下载</span></h3>
            <p className={`text-[14px] leading-relaxed ${themeClasses.subText}`}>
              字绘.Lab 致力于保护创作者权益。由于开源协议与商用授权的复杂性，部分字体需通过人工核验后发放。
            </p>
          </div>

          <div className="space-y-3">
             <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30 text-center mb-4">请联系在线客服领取</p>
             <div className="grid grid-cols-1 gap-3">
                {contactButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={btn.action}
                    className={`w-full py-4 rounded-2xl ${btn.color} text-white font-bold text-[14px] flex items-center justify-center gap-3 shadow-lg ${btn.shadow} transition-all active:scale-95`}
                  >
                    {btn.icon}
                    {btn.label}
                    <ExternalLink size={14} className="opacity-50" />
                  </button>
                ))}
             </div>
          </div>

          <div className={`p-4 rounded-xl border border-dashed ${isDarkTheme ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'} flex items-start gap-3`}>
             <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[12px] opacity-50 leading-relaxed font-medium italic">
               客服在线时间：周一至周日 09:00 - 22:00。我们将第一时间协助您获取授权。
             </p>
          </div>
        </div>

        <footer className="p-6 border-t border-current/5 flex justify-center bg-current/5">
           <button 
             onClick={onClose}
             className="text-[13px] font-bold opacity-40 hover:opacity-100 transition-opacity"
           >
             返回浏览其他字体
           </button>
        </footer>
      </div>
    </div>
  );
};

export default DownloadContactModal;
