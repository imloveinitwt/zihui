
import React, { useEffect } from 'react';
import { X, Users, History, Target, Heart, Github, Twitter, Mail, Award, Zap, Globe, MessageCircle } from 'lucide-react';

interface AboutTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const TEAM_MEMBERS = [
  {
    name: 'Leon. C',
    role: '创始人 / 首席设计师',
    desc: '深耕字形排版 10 年，坚信文字是有生命的容器。',
    avatar: 'LC',
    color: 'bg-rose-500'
  },
  {
    name: 'Sarah Wang',
    role: 'AI 算法工程师',
    desc: '致力于利用 Gemini Pro 探索字形配对的无限可能。',
    avatar: 'SW',
    color: 'bg-indigo-500'
  },
  {
    name: 'Kimi. J',
    role: '前端架构师',
    desc: '追求像素级的极致交互体验。',
    avatar: 'KJ',
    color: 'bg-emerald-500'
  }
];

const STATS = [
  { label: '收录字体', value: '1,200+', icon: <Globe size={16} /> },
  { label: '活跃用户', value: '85k', icon: <Users size={16} /> },
  { label: '开源贡献', value: '340+', icon: <Github size={16} /> },
];

const AboutTeamModal: React.FC<AboutTeamModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    card: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100',
    subText: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
    label: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 block',
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        
        {/* Header */}
        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-[18px] font-bold">关于团队</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">The Soul Behind FontCanvas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
            <X size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-16 custom-scrollbar">
          
          {/* Section: Mission */}
          <section className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
               <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[11px] font-black uppercase tracking-widest border border-indigo-500/20">
                 Our Vision
               </span>
            </div>
            <h3 className="text-[28px] md:text-[36px] font-black leading-tight tracking-tighter">
              让文字在视网膜上起舞，<br />
              <span className="text-indigo-600">连接每一份创作灵感。</span>
            </h3>
            <p className={`text-[16px] leading-relaxed ${themeClasses.subText}`}>
              字绘.Lab (FontCanvas Studio) 成立于 2023 年秋季。我们是一群对排版美学近乎痴迷的设计师与开发者。在这个被信息淹没的时代，我们相信“合适的字体”是承载思想最有力的视觉容器。
            </p>
          </section>

          {/* Section: Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className={`p-8 rounded-2xl border ${themeClasses.card} text-center space-y-2 group hover:border-indigo-500/30 transition-all`}>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-[24px] font-black">{stat.value}</div>
                <div className="text-[12px] font-bold opacity-40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Section: Core Team */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-current opacity-10" />
              <h4 className={themeClasses.label}>核心成员 / CORE TEAM</h4>
              <div className="h-px flex-grow bg-current opacity-10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.map((member, i) => (
                <div key={i} className="space-y-4 group">
                  <div className={`aspect-square rounded-3xl ${member.color} flex items-center justify-center text-white text-[40px] font-black shadow-xl group-hover:-translate-y-2 transition-transform duration-500`}>
                    {member.avatar}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[16px] font-bold">{member.name}</h5>
                    <p className="text-[12px] text-indigo-600 font-bold">{member.role}</p>
                    <p className={`text-[13px] leading-relaxed opacity-60`}>{member.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Philosophy */}
          <section className={`p-10 rounded-3xl border ${isDarkTheme ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} grid md:grid-cols-2 gap-10 items-center`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="text-indigo-600" />
                <h4 className="text-[18px] font-bold">我们的坚持</h4>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: <Zap size={14} />, text: '极致性能：毫秒级的字体预览与渲染。' },
                  { icon: <Award size={14} />, text: '尊重版权：严格审核所有字体的开源合规性。' },
                  { icon: <Heart size={14} />, text: '人文关怀：为独立设计师提供展示与变现的舞台。' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-medium leading-relaxed">
                    <span className="mt-1 text-indigo-600">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl space-y-4">
               <h5 className="text-[14px] font-bold flex items-center gap-2">
                 <MessageCircle size={16} className="text-indigo-600" /> 加入讨论
               </h5>
               <p className="text-[12px] opacity-60">我们正在招募对文字设计有热忱的贡献者。无论是代码、翻译还是字体整理，这里都有你的位置。</p>
               <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[12px] font-bold hover:bg-indigo-700 transition-all active:scale-95">
                 提交申请 / Apply Now
               </button>
            </div>
          </section>

          {/* Footer of Modal */}
          <footer className="pt-12 border-t border-current/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <a href="#" className="opacity-40 hover:opacity-100 hover:text-indigo-600 transition-all"><Github size={20} /></a>
              <a href="#" className="opacity-40 hover:opacity-100 hover:text-indigo-600 transition-all"><Twitter size={20} /></a>
              <a href="mailto:hello@fontcanvas.lab" className="opacity-40 hover:opacity-100 hover:text-indigo-600 transition-all"><Mail size={20} /></a>
            </div>
            <div className="text-[13px] font-bold opacity-30 tracking-widest">
              EST. 2023 • SHANGHAI / TOKYO
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AboutTeamModal;
