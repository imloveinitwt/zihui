
import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Palette, Image as ImageIcon, Layout, Share2, Type, Box, Layers, Code, Zap, AlertCircle, CheckCircle2, XCircle, Monitor, Smartphone, Terminal, AlignLeft } from 'lucide-react';

interface BrandAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

type TabType = 'visual' | 'colors' | 'typography' | 'templates';

const BRAND_COLORS = [
  { name: '品牌主色', hex: '#4F46E5', rgb: '79, 70, 229', usage: '主品牌视觉', shades: ['#4338CA', '#3730A3', '#312E81'] },
  { name: '强调色', hex: '#E11D48', rgb: '225, 29, 72', usage: '重点/中文强调', shades: ['#BE123C', '#9F1239', '#881337'] },
  { name: '深石板色', hex: '#0F172A', rgb: '15, 23, 42', usage: '主要文本/背景', shades: ['#1E293B', '#334155', '#475569'] },
  { name: '纯净白', hex: '#FFFFFF', rgb: '255, 255, 255', usage: '画布/留白空间', shades: ['#F8FAF0', '#F1F5F9', '#E2E8F0'] },
];

const BrandAssetsModal: React.FC<BrandAssetsModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [downloading, setDownloading] = useState<string | null>(null);

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const simulateDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    card: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    tabActive: 'text-indigo-600 border-indigo-600',
    tabInactive: 'text-slate-400 border-transparent hover:text-slate-600',
    label: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block',
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-6xl h-full max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        
        {/* 页头 */}
        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Palette size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black tracking-tight">品牌资产系统</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">品牌视觉标识规范 2.5 版本</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
               {[
                 { id: 'visual', label: '视觉标识', icon: <ImageIcon size={16} /> },
                 { id: 'colors', label: '色彩系统', icon: <Box size={16} /> },
                 { id: 'typography', label: '字体规范', icon: <AlignLeft size={16} /> },
                 { id: 'templates', label: '数字资产', icon: <Layout size={16} /> }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as TabType)}
                   className={`flex items-center gap-2 text-[14px] font-bold py-1 border-b-2 transition-all ${
                     activeTab === tab.id ? themeClasses.tabActive : themeClasses.tabInactive
                   }`}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </nav>
            <div className="w-px h-8 bg-current/10 hidden md:block" />
            <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
              <X size={28} />
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
          
          {activeTab === 'visual' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section>
                  <span className={themeClasses.label}>核心标志</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className={`p-16 rounded-[32px] border ${themeClasses.card} flex flex-col items-center gap-8 group relative overflow-hidden`}>
                        <div className="w-28 h-28 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 duration-700">
                           <Type size={56} />
                        </div>
                        <div className="text-center">
                           <p className="font-black text-[24px]">字绘.Lab</p>
                           <p className="text-[10px] opacity-30 font-bold uppercase tracking-widest">主品牌标识</p>
                        </div>
                        <button onClick={() => simulateDownload('logo-main')} className="absolute bottom-6 right-6 p-4 bg-white shadow-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white flex items-center gap-2 font-bold text-[12px]">
                           {downloading === 'logo-main' ? <Zap size={16} className="animate-spin" /> : <Download size={16} />} 
                           {downloading === 'logo-main' ? '下载中' : 'SVG / PNG 格式'}
                        </button>
                     </div>
                     <div className={`p-16 rounded-[32px] bg-slate-900 border border-slate-800 flex flex-col items-center gap-8 group relative overflow-hidden`}>
                        <div className="w-28 h-28 bg-white rounded-[32px] flex items-center justify-center text-slate-900 shadow-2xl transition-transform group-hover:scale-110 duration-700">
                           <Type size={56} />
                        </div>
                        <div className="text-center text-white">
                           <p className="font-black text-[24px]">字绘.Lab</p>
                           <p className="text-[10px] opacity-30 font-bold uppercase tracking-widest">反白品牌标识</p>
                        </div>
                        <button onClick={() => simulateDownload('logo-inverse')} className="absolute bottom-6 right-6 p-4 bg-white/10 text-white shadow-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900 flex items-center gap-2 font-bold text-[12px]">
                           {downloading === 'logo-inverse' ? <Zap size={16} className="animate-spin" /> : <Download size={16} />} 
                           {downloading === 'logo-inverse' ? '下载中' : 'SVG / PNG 格式'}
                        </button>
                     </div>
                  </div>
               </section>

               <section>
                  <span className={themeClasses.label}>使用规范</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className={`p-6 rounded-2xl border ${themeClasses.card} space-y-4`}>
                        <div className="h-40 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                           <div className="flex items-center gap-2 text-indigo-600 font-bold">
                              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Type size={16}/></div>
                              字绘.Lab
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[13px]">
                           <CheckCircle2 size={16} /> 保持清晰的安全边距
                        </div>
                     </div>
                     <div className={`p-6 rounded-2xl border ${themeClasses.card} space-y-4`}>
                        <div className="h-40 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                           <div className="flex items-center gap-2 text-rose-500 font-bold rotate-12 scale-150 blur-[1px]">
                              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white"><Type size={16}/></div>
                              字绘.Lab
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-[13px]">
                           <XCircle size={16} /> 禁止拉伸、扭曲或旋转
                        </div>
                     </div>
                     <div className={`p-6 rounded-2xl border ${themeClasses.card} space-y-4`}>
                        <div className="h-40 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                           <div className="flex items-center gap-2 text-emerald-500 font-bold opacity-10">
                              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><Type size={16}/></div>
                              字绘.Lab
                           </div>
                        </div>
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-[13px]">
                           <XCircle size={16} /> 禁止过低透明度使用
                        </div>
                     </div>
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {BRAND_COLORS.map(color => (
                    <div key={color.hex} className={`rounded-[32px] border ${themeClasses.card} overflow-hidden group shadow-sm`}>
                       <div className="h-40 w-full relative" style={{ backgroundColor: color.hex }}>
                          <button 
                            onClick={() => copyToClipboard(color.hex)}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold gap-1"
                          >
                             {copied === color.hex ? <Check size={20} /> : <Copy size={20} />}
                             <span className="text-[12px]">{copied === color.hex ? '已复制' : '复制十六进制色值'}</span>
                          </button>
                       </div>
                       <div className="p-8 space-y-6">
                          <div>
                             <h4 className="font-black text-[18px]">{color.name}</h4>
                             <p className="text-[11px] opacity-40 font-black uppercase tracking-widest">{color.usage}</p>
                          </div>
                          <div className="flex gap-2">
                             {color.shades.map(shade => (
                               <button 
                                 key={shade} 
                                 onClick={() => copyToClipboard(shade)}
                                 className="flex-1 h-8 rounded-lg border border-white/10 hover:scale-110 transition-transform shadow-sm"
                                 style={{ backgroundColor: shade }}
                                 title={shade}
                               />
                             ))}
                          </div>
                          <div className="space-y-1 font-mono text-[11px] opacity-40">
                             <p>十六进制: {color.hex}</p>
                             <p>RGB: {color.rgb}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </section>

               <section className={`p-10 rounded-[32px] border ${themeClasses.card} bg-current/2`}>
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <Code size={20} className="text-indigo-600" />
                        <div>
                           <h4 className="text-[16px] font-black">开发变量引用</h4>
                           <p className="text-[11px] opacity-40 font-bold uppercase tracking-widest">全局 CSS 设计令牌</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => copyToClipboard(':root {\n  --fc-primary: #4F46E5;\n  --fc-accent: #E11D48;\n  --fc-slate-900: #0F172A;\n  --fc-surface: #F8FAFC;\n}')}
                        className="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-[12px] font-bold hover:bg-indigo-600 hover:text-white transition-all"
                     >
                        {copied?.includes(':root') ? '代码已复制' : '复制 CSS 变量'}
                     </button>
                  </div>
                  <pre className={`p-6 rounded-2xl text-[13px] font-mono leading-relaxed overflow-x-auto ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100 shadow-inner'}`}>
{`:root {
  --fc-primary: #4F46E5; /* 品牌主色 */
  --fc-accent: #E11D48;  /* 强调色 */
  --fc-slate-900: #0F172A; /* 文本深色 */
  --fc-surface: #F8FAFC; /* 表面背景 */
  --fc-radius-lg: 32px;
  --fc-shadow-soft: 0 10px 40px -10px rgba(0,0,0,0.1);
}`}
                  </pre>
               </section>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section className="space-y-8">
                  <span className={themeClasses.label}>标准排版规范</span>
                  <div className={`p-12 rounded-[32px] border ${themeClasses.card} space-y-12`}>
                     <div className="space-y-4">
                        <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.2em]">大标题展示</p>
                        <h3 className="text-[56px] font-black tracking-tighter leading-none text-indigo-600">Inter Black</h3>
                        <p className="text-[14px] opacity-60 max-w-lg leading-relaxed font-medium italic">用于所有的标题和关键视觉点，强调力量感与现代感。</p>
                     </div>
                     <div className="h-px bg-current opacity-10" />
                     <div className="space-y-4">
                        <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.2em]">正文/中文字体</p>
                        <h3 className="text-[32px] font-bold tracking-tight">思源黑体 (Noto Sans SC)</h3>
                        <p className="text-[15px] opacity-60 max-w-xl leading-relaxed">用于正文叙述与详细说明。思源黑体不仅提供了卓越的易读性，更体现了品牌对开源精神的崇尚。</p>
                     </div>
                  </div>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-3xl border ${themeClasses.card} flex items-center gap-6`}>
                     <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                        <Terminal size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-[16px]">等宽字体 (JetBrains Mono)</h4>
                        <p className="text-[13px] opacity-40">用于代码片段、元数据及界面细节标注。</p>
                     </div>
                  </div>
                  <div className={`p-8 rounded-3xl border ${themeClasses.card} flex items-center gap-6`}>
                     <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-[16px]">字间距标准</h4>
                        <p className="text-[13px] opacity-40">标题 -0.05em / 正文 -0.01em / 标签 +0.1em。</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <section>
                  <span className={themeClasses.label}>桌面壁纸</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                       { title: '抽象几何 01', size: '3840x2160', color: 'bg-indigo-600' },
                       { title: '现代衬线 02', size: '3840x2160', color: 'bg-slate-900' },
                     ].map((item, i) => (
                       <div key={i} className={`group rounded-[24px] overflow-hidden border ${themeClasses.card} relative aspect-video`}>
                          <div className={`absolute inset-0 ${item.color} opacity-90 flex items-center justify-center text-white p-12`}>
                             <div className="text-center space-y-2 group-hover:scale-95 transition-transform">
                                <Type size={48} className="mx-auto opacity-20" />
                                <h4 className="font-black text-[20px]">{item.title}</h4>
                                <p className="text-[11px] font-bold opacity-40">{item.size} • 4K 高清</p>
                             </div>
                          </div>
                          <button onClick={() => simulateDownload(`wp-${i}`)} className="absolute bottom-6 right-6 p-4 bg-white/95 text-slate-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl font-bold text-[12px] flex items-center gap-2">
                             {downloading === `wp-${i}` ? <Zap size={16} className="animate-spin" /> : <Download size={16} />}
                             立即下载
                          </button>
                       </div>
                     ))}
                  </div>
               </section>

               <section>
                  <span className={themeClasses.label}>办公物料</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { title: 'PPT 演示模版', icon: <Monitor size={24} />, count: '24页演示稿' },
                       { title: '社交媒体海报', icon: <Smartphone size={24} />, count: '12款设计模版' },
                       { title: '名片与工牌', icon: <Layers size={24} />, count: '印刷就绪格式' },
                     ].map((item, i) => (
                       <div key={i} className={`p-8 rounded-3xl border ${themeClasses.card} group hover:border-indigo-600 transition-all flex flex-col gap-6`}>
                          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {item.icon}
                          </div>
                          <div>
                             <h4 className="font-black text-[17px]">{item.title}</h4>
                             <p className="text-[13px] opacity-40 font-bold">{item.count}</p>
                          </div>
                          <button onClick={() => simulateDownload(`kit-${i}`)} className="text-indigo-600 text-[13px] font-bold flex items-center gap-2 hover:gap-3 transition-all pt-2">
                             打包下载资源 <Download size={14} />
                          </button>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className={`p-8 border-t border-current/5 flex items-center justify-between bg-current/5 shrink-0`}>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center">
                 <AlertCircle size={20} />
              </div>
              <div className="text-[12px] font-bold opacity-30 italic leading-tight">
                本资产包仅供合规合作伙伴及社区贡献者使用。<br />未经授权禁止用于商业转售。
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => simulateDownload('full-pack')}
                className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-bold text-[15px] hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center gap-3"
              >
                 {downloading === 'full-pack' ? <Zap size={20} className="animate-spin" /> : <Download size={20} />} 
                 {downloading === 'full-pack' ? '打包中...' : '下载完整品牌资源包 (.ZIP)'}
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default BrandAssetsModal;
