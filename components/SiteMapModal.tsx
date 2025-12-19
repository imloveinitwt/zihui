
import React, { useEffect } from 'react';
import { X, Globe, Layers, Sparkles, Zap, Download, Terminal, ShieldCheck, HeartHandshake, Info, MessageSquare, HelpCircle, Shield, FileText, Search, User, Palette, TrendingUp, Users, Database } from 'lucide-react';

interface SiteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
  onNavigate: (action: string, params?: any) => void;
}

const SiteMapModal: React.FC<SiteMapModalProps> = ({ isOpen, onClose, theme = 'classic', onNavigate }) => {
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
    sectionTitle: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 block',
    link: isDarkTheme ? 'hover:bg-slate-900 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-slate-600 hover:text-indigo-600',
    iconBg: isDarkTheme ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'
  };

  const SECTIONS = [
    {
      title: '内容发现与探索',
      links: [
        { label: '全部字体库', icon: <Layers size={16} />, action: 'filter-category', params: 'All' },
        { label: '全量数据库', icon: <Database size={16} />, action: 'open-database' },
        { label: '2025 趋势报告', icon: <TrendingUp size={16} />, action: 'open-trends' },
        { label: '中文字库专区', icon: <Globe size={16} />, action: 'filter-category', params: 'chinese-simplified' },
        { label: '最新发布', icon: <Sparkles size={16} />, action: 'sort-newest' },
      ]
    },
    {
      title: '核心实验室工具',
      links: [
        { label: 'AI 配对顾问', icon: <Sparkles size={16} />, action: 'scroll-ai' },
        { label: '排版实验室', icon: <Terminal size={16} />, action: 'open-lab' },
        { label: '品牌视觉资产', icon: <Palette size={16} />, action: 'open-brand-assets' },
        { label: '我的收藏夹', icon: <ShieldCheck size={16} />, action: 'toggle-favorites' },
      ]
    },
    {
      title: '相关资源与支持',
      links: [
        { label: '安装手册', icon: <Download size={16} />, action: 'open-handbook', params: 'os-install' },
        { label: '开发者 API', icon: <Globe size={16} />, action: 'open-handbook', params: 'developer' },
        { label: '贡献者指南', icon: <Users size={16} />, action: 'open-contribution' },
        { label: '帮助中心', icon: <HelpCircle size={16} />, action: 'open-help' },
      ]
    },
    {
      title: '关于与法律条款',
      links: [
        { label: '关于团队', icon: <Info size={16} />, action: 'open-about' },
        { label: '意见反馈', icon: <MessageSquare size={16} />, action: 'open-feedback' },
        { label: '隐私保护政策', icon: <Shield size={16} />, action: 'open-legal', params: 'privacy' },
        { label: '用户协议条款', icon: <FileText size={16} />, action: 'open-legal', params: 'terms' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        {/* 页头 */}
        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black tracking-tight">站点地图</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">全局站点索引与快速导航</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
            <X size={28} />
          </button>
        </header>

        {/* 栅格内容 */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar bg-current/2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <span className={themeClasses.sectionTitle}>{section.title}</span>
                <nav className="flex flex-col gap-1">
                  {section.links.map((link, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => { 
                        onNavigate(link.action, link.params);
                        onClose(); 
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-[14px] text-left group ${themeClasses.link}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white ${themeClasses.iconBg}`}>
                        {link.icon}
                      </div>
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* 页脚 */}
        <footer className={`p-8 border-t border-current/5 flex flex-col md:flex-row items-center justify-between bg-current/5 gap-4`}>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[11px]">
                FC
              </div>
              <span className="text-[12px] font-bold opacity-40 italic">探索现代排版设计的无限疆界。</span>
           </div>
           <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest opacity-30">
              <span>当前版本 2.5.3</span>
              <div className="w-1.5 h-1.5 bg-current rounded-full" />
              <span>发布日期: 2025年5月</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default SiteMapModal;
