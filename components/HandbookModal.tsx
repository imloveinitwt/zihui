
import React, { useState, useEffect, useMemo } from 'react';
// Added Zap and Type to the imports from lucide-react
import { X, Book, Download, ShieldCheck, Monitor, Smartphone, Terminal, ExternalLink, Code2, Palette, Info, Check, Copy, Laptop, Command, Settings, HelpCircle, Search, Zap, Type } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
  initialSection?: string;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose, theme = 'classic', initialSection = 'getting-started' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveSection(initialSection);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialSection]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    sidebar: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    codeBg: isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-slate-100',
    card: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200',
    activeTab: isDarkTheme ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
    inactiveTab: 'opacity-60 hover:opacity-100 hover:bg-current/5 border-transparent',
    textMuted: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
  };

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: '快速上手',
      icon: <Zap size={18} />,
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-[24px] font-bold mb-4">欢迎使用 字绘.Lab</h3>
            <p className={themeClasses.textMuted}>字绘.Lab 是一个为专业设计师和开发者打造的字体探索平台。我们不仅提供高质量的开源字体预览，还通过 AI 技术辅助您完成排版设计。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-6 rounded-2xl border ${themeClasses.card} space-y-3`}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Search size={20}/></div>
              <h4 className="font-bold">发现字体</h4>
              <p className="text-[13px] opacity-60">利用筛选器、搜索或 AI 智能顾问，在海量开源库中找到最适合您项目的字符集。</p>
            </div>
            <div className={`p-6 rounded-2xl border ${themeClasses.card} space-y-3`}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white"><Type size={20}/></div>
              <h4 className="font-bold">深度预览</h4>
              <p className="text-[13px] opacity-60">进入排版实验室，调整字间距、行高、对齐方式，查看字体在真实场景下的表现。</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'os-install',
      title: '系统安装指南',
      icon: <Laptop size={18} />,
      content: (
        <div className="space-y-10">
          <section className="space-y-4">
            <h3 className="text-[20px] font-bold flex items-center gap-2">
              <Monitor size={22} className="text-indigo-600" /> Windows 安装步骤
            </h3>
            <div className="space-y-3 pl-8 border-l-2 border-slate-200">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-bold">1</span>
                <p className="text-[14px]">解压下载的 <strong>.zip</strong> 压缩包。</p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-bold">2</span>
                <p className="text-[14px]">找到后缀为 <strong>.ttf</strong> 或 <strong>.otf</strong> 的字体文件。</p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-bold">3</span>
                <p className="text-[14px]">右键点击该文件，选择 <strong>“为所有用户安装”</strong>。</p>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-[20px] font-bold flex items-center gap-2">
              <Command size={22} className="text-indigo-600" /> macOS 安装步骤
            </h3>
            <div className="space-y-3 pl-8 border-l-2 border-slate-200">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-bold">1</span>
                <p className="text-[14px]">双击已下载的字体文件。</p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[12px] flex items-center justify-center font-bold">2</span>
                <p className="text-[14px]">在弹出的 <strong>“字体册”</strong> 窗口中点击右下角的 <strong>“安装字体”</strong>。</p>
              </div>
            </div>
          </section>
        </div>
      )
    },
    {
      id: 'developer',
      title: '开发者文档',
      icon: <Code2 size={18} />,
      content: (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-[20px] font-bold">Web 字体引用</h3>
            <p className={themeClasses.textMuted}>我们建议使用 <strong>@font-face</strong> 规则以实现最佳的自定义控制。对于中文字体，请考虑使用分包加载技术以减小体积。</p>
            <div className={`relative p-5 rounded-xl font-mono text-[13px] ${themeClasses.codeBg} group`}>
              <button 
                onClick={() => copyCode('@font-face {\n  font-family: "YourFontName";\n  src: url("/fonts/font-file.woff2") format("woff2");\n  font-weight: normal;\n  font-style: normal;\n  font-display: swap;\n}', 'css')}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === 'css' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
              <pre className="overflow-x-auto">
{`@font-face {
  font-family: "YourFontName";
  src: url("/fonts/font-file.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`}
              </pre>
            </div>
          </section>
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
             <div className="flex items-center gap-3 text-amber-600 mb-2">
                <Info size={18} />
                <h4 className="font-bold">性能提示</h4>
             </div>
             <p className="text-[13px] text-amber-700/80 leading-relaxed">对于中文字库，完整文件可能达到 10MB 以上。在生产环境中，请务必配合 <strong>font-spider</strong> 等工具进行字蛛压缩，或仅引入项目中实际使用的字符。</p>
          </section>
        </div>
      )
    },
    {
      id: 'design-tools',
      title: '设计工具集成',
      icon: <Palette size={18} />,
      content: (
        <div className="space-y-8">
          <h3 className="text-[20px] font-bold">在设计软件中使用</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center shrink-0"><Settings size={24}/></div>
              <div className="space-y-1">
                <h4 className="font-bold text-[16px]">Figma</h4>
                <p className={themeClasses.textMuted}>确保已安装 <strong>Figma Font Helper</strong> (仅限桌面端)。安装系统字体后，重启 Figma 即可在字体列表中找到它们。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center shrink-0"><Palette size={24}/></div>
              <div className="space-y-1">
                <h4 className="font-bold text-[16px]">Adobe Photoshop / Illustrator</h4>
                <p className={themeClasses.textMuted}>Adobe 软件会自动扫描系统字体库。如果在列表中未找到新安装的字体，请尝试通过 “文字 -> 字体菜单 -> 全部显示” 进行刷新。</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'license-wiki',
      title: '开源授权百科',
      icon: <ShieldCheck size={18} />,
      content: (
        <div className="space-y-8">
          <h3 className="text-[20px] font-bold">理解授权协议</h3>
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border-2 border-indigo-500/20 bg-indigo-500/5`}>
              <h4 className="text-[16px] font-black text-indigo-600 mb-2">SIL Open Font License (OFL)</h4>
              <p className="text-[14px] leading-relaxed mb-4">这是开源界最主流的字体授权协议。它允许<strong>免费个人使用及商业使用</strong>。您可以自由修改、嵌入和分发，唯一的限制是<strong>不能单独销售字体本身</strong>。</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold rounded">允许商用</span>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold rounded">允许修改</span>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold rounded">允许嵌入</span>
                <span className="px-2 py-1 bg-rose-500/10 text-rose-600 text-[11px] font-bold rounded">严禁转售</span>
              </div>
            </div>
            <div className={`p-6 rounded-2xl border ${themeClasses.card}`}>
              <h4 className="text-[16px] font-black mb-2 opacity-80">Apache License 2.0</h4>
              <p className="text-[14px] leading-relaxed opacity-60">常用于 Google 发布的字体（如 Roboto）。同样允许<strong>免费商用</strong>，且比 OFL 更加宽松，在某些闭源场景下更具优势。</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = useMemo(() => {
    if (!searchTerm) return sections;
    return sections.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activeSection === s.id
    );
  }, [searchTerm, activeSection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-6xl h-full max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row expand-enter ${themeClasses.modal}`}>
        
        {/* Sidebar */}
        <aside className={`w-full md:w-80 flex flex-col border-r shrink-0 ${themeClasses.sidebar}`}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Book size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold">字绘.完整手册</h2>
                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Master Documentation</p>
              </div>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索指南内容..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-[13px] outline-none focus:border-indigo-600 transition-all ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              />
            </div>
            
            <nav className="space-y-1.5">
              {filteredSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all border ${
                    activeSection === section.id ? themeClasses.activeTab : themeClasses.inactiveTab
                  }`}
                >
                  <span className={activeSection === section.id ? 'text-indigo-600' : 'opacity-40'}>{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-current/5">
             <div className={`p-5 rounded-2xl ${isDarkTheme ? 'bg-slate-950/40' : 'bg-white'} border border-current/10 space-y-3`}>
                <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.2em]">Still Stuck?</p>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-2 text-[13px] font-bold text-indigo-600 hover:gap-3 transition-all">
                    咨询技术团队 <ExternalLink size={14} />
                  </button>
                </div>
             </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-grow flex flex-col min-h-0 bg-current/2">
          <header className={`px-10 h-20 border-b flex items-center justify-between shrink-0 ${themeClasses.header}`}>
            <div className="flex items-center gap-3 opacity-60">
              <Book size={18} />
              <span className="text-[13px] font-bold uppercase tracking-widest">Documentation / {sections.find(s => s.id === activeSection)?.title}</span>
            </div>
            <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
              <X size={24} />
            </button>
          </header>

          <main className="flex-grow overflow-y-auto p-10 md:p-16 custom-scrollbar">
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </main>

          <footer className={`px-10 py-6 border-t shrink-0 flex items-center justify-between text-[11px] font-bold opacity-30 uppercase tracking-[0.2em] ${themeClasses.header}`}>
            <span>Last Updated: May 2025</span>
            <span>Ref: DOC-ID-92831</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HandbookModal;
