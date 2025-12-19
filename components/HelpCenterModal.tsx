
import React, { useState, useEffect } from 'react';
import { X, Book, Download, ShieldCheck, HelpCircle, ChevronRight, Search, Monitor, Smartphone, Terminal, ExternalLink, MessageSquare, HeartHandshake } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const HELP_SECTIONS = [
  {
    id: 'install',
    title: '安装指南',
    icon: <Download size={20} />,
    color: 'text-blue-500',
    topics: [
      { 
        title: '如何在 Windows 上安装字体？', 
        content: '1. 下载字体文件（通常是 .ttf 或 .otf）。\n2. 右键点击文件，选择“安装”或“为所有用户安装”。\n3. 或者将其拖入“控制面板 > 字体”文件夹。' 
      },
      { 
        title: '如何在 macOS 上安装字体？', 
        content: '1. 双击下载的字体文件。\n2. 在弹出的“字体册”窗口中点击“安装字体”。\n3. 安装后，字体将出现在所有支持字体的应用程序中。' 
      },
      { 
        title: '字体安装后在软件中找不到？', 
        content: '尝试重新启动该软件。有些软件（如 Adobe 系列、Office）在安装新字体后需要重启才能刷新字体列表。' 
      }
    ]
  },
  {
    id: 'license',
    title: '开源协议',
    icon: <ShieldCheck size={20} />,
    color: 'text-emerald-500',
    topics: [
      { 
        title: '什么是 SIL Open Font License (OFL)？', 
        content: '这是一种专门为字体设计的开源协议。它允许您自由地使用、研究、修改和重新分发字体，只要不单独销售字体本身即可。' 
      },
      { 
        title: '商用是否需要付费？', 
        content: '本站收录的大多数字体（如思源系列、普惠体）均为免费商用。但请务必在下载页面查看具体的 License 说明，以确保符合版权要求。' 
      }
    ]
  },
  {
    id: 'usage',
    title: '排版建议',
    icon: <Book size={20} />,
    color: 'text-indigo-500',
    topics: [
      { 
        title: '如何进行中西文混排？', 
        content: '建议中文使用无衬线体（如思源黑体）搭配西文无衬线体（如 Roboto），或中文宋体搭配西文衬线体（如 Playfair Display），以保持视觉风格一致。' 
      },
      { 
        title: '字重的选择逻辑？', 
        content: '标题通常建议使用 Bold (700+) 字重以增强视觉冲击力，正文建议使用 Regular (400) 或 Medium (500) 以保证长久阅读的舒适度。' 
      }
    ]
  }
];

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('install');
  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    sidebar: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    search: isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900',
    item: isDarkTheme ? 'hover:bg-slate-800' : 'hover:bg-white hover:shadow-sm',
    itemActive: isDarkTheme ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    topicBg: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100',
    content: isDarkTheme ? 'text-slate-400' : 'text-slate-600',
  };

  const filteredSections = HELP_SECTIONS.map(section => ({
    ...section,
    topics: section.topics.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.topics.length > 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 lg:p-12">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-6xl h-full max-h-[85vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row expand-enter ${themeClasses.modal}`}>
        
        {/* Sidebar */}
        <div className={`w-full md:w-72 flex flex-col border-r ${themeClasses.sidebar}`}>
          <div className="p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <HelpCircle size={18} />
              </div>
              <h2 className="text-[18px] font-bold tracking-tight">帮助中心</h2>
            </div>
            
            <nav className="space-y-1">
              {HELP_SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all border ${
                    activeTab === section.id ? themeClasses.itemActive : `border-transparent opacity-60 hover:opacity-100 ${themeClasses.item}`
                  }`}
                >
                  <span className={activeTab === section.id ? '' : section.color}>{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-8 border-t border-current/5">
            <div className={`p-5 rounded-2xl ${isDarkTheme ? 'bg-slate-950' : 'bg-white'} border border-current/5 space-y-3`}>
              <p className="text-[12px] font-bold opacity-40 uppercase tracking-widest">需要更多帮助？</p>
              <button className="flex items-center gap-2 text-[13px] font-bold text-indigo-600 hover:gap-3 transition-all">
                <MessageSquare size={16} /> 联系技术支持
              </button>
              <button className="flex items-center gap-2 text-[13px] font-bold text-indigo-600 hover:gap-3 transition-all">
                <HeartHandshake size={16} /> 赞助我们
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col min-h-0">
          <header className="p-8 border-b border-current/5 flex items-center justify-between gap-6 shrink-0">
            <div className="relative flex-grow max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索常见问题或排版建议..."
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border outline-none focus:border-indigo-500 transition-all ${themeClasses.search}`}
              />
            </div>
            <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
              <X size={24} />
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-12">
              {filteredSections.map(section => (
                <section key={section.id} className={`${activeTab !== 'all' && activeTab !== section.id ? 'hidden' : 'block'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkTheme ? 'bg-white/5' : 'bg-slate-100'} ${section.color}`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold">{section.title}</h3>
                      <p className="text-[11px] opacity-40 font-black uppercase tracking-widest">{section.id.toUpperCase()} MODULE</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {section.topics.map((topic, i) => (
                      <div 
                        key={i} 
                        className={`p-6 rounded-2xl border ${themeClasses.topicBg} group hover:border-indigo-500/30 transition-all`}
                      >
                        <h4 className="text-[15px] font-bold mb-3 flex items-center justify-between">
                          {topic.title}
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h4>
                        <p className={`text-[14px] leading-relaxed whitespace-pre-line ${themeClasses.content}`}>
                          {topic.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              
              {filteredSections.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                  <Search size={64} strokeWidth={1} />
                  <p className="mt-4 text-[18px] font-black uppercase tracking-widest">未找到相关结果</p>
                </div>
              )}

              {/* Quick Links Footer */}
              <div className="pt-12 border-t border-current/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="#" className={`p-6 rounded-2xl border ${themeClasses.topicBg} flex items-center justify-between group`}>
                  <div className="flex items-center gap-4">
                    <Monitor size={20} className="text-indigo-500" />
                    <div>
                      <p className="text-[14px] font-bold">查看桌面端文档</p>
                      <p className="text-[12px] opacity-40">完整排版实验室手册</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className={`p-6 rounded-2xl border ${themeClasses.topicBg} flex items-center justify-between group`}>
                  <div className="flex items-center gap-4">
                    <Terminal size={20} className="text-rose-500" />
                    <div>
                      <p className="text-[14px] font-bold">开发者 API 参考</p>
                      <p className="text-[12px] opacity-40">获取字体元数据与预览图</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
