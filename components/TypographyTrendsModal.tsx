
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, TrendingUp, Layout, Palette, Move, MousePointer2, ArrowRight, ArrowLeft, Layers, Monitor, Target, Cpu, Eye, Type, Loader2 } from 'lucide-react';
import { Trend } from '../types';
import { contentService } from '../services/contentService';

interface TypographyTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const TypographyTrendsModal: React.FC<TypographyTrendsModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const [activeTrendId, setActiveTrendId] = useState<string | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetch = async () => {
        setLoading(true);
        const data = await contentService.getTrends();
        setTrends(data);
        setLoading(false);
      };
      fetch();
    } else {
      document.body.style.overflow = 'unset';
      setActiveTrendId(null);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeTrend = trends.find(t => t.id === activeTrendId);

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    card: isDarkTheme ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl',
    content: isDarkTheme ? 'text-slate-400' : 'text-slate-600',
    badge: isDarkTheme ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-700',
  };

  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-5xl h-full max-h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        {/* Background Decorative Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[140px] pointer-events-none transition-all duration-700 ${
          activeTrendId ? 'bg-indigo-600/20' : 'bg-indigo-600/10'
        }`} />

        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between shrink-0 relative z-10`}>
          <div className="flex items-center gap-4">
            {activeTrendId ? (
              <button 
                onClick={() => setActiveTrendId(null)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-current/5 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
            ) : (
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <TrendingUp size={24} />
              </div>
            )}
            <div>
              <h2 className="text-[20px] font-black tracking-tight">
                {activeTrendId ? activeTrend?.title : '2025 排版趋势报告'}
              </h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">
                {activeTrendId ? 'TREND DEEP DIVE' : 'Typography Trends & AI Insights'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
            <X size={28} />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar relative z-10">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-[14px] font-bold uppercase tracking-widest">加载趋势数据库...</p>
            </div>
          ) : !activeTrendId ? (
            /* Trends List View */
            <div className="p-8 md:p-12 space-y-16 animate-in fade-in slide-in-from-left-4 duration-500">
              <section className="text-center space-y-4">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600">The Future is Variable</span>
                <h3 className="text-[40px] md:text-[56px] font-black leading-none tracking-tighter">
                  文字正在<span className="italic underline decoration-indigo-500 underline-offset-8">流动</span>。
                </h3>
                <p className="text-[16px] opacity-60 max-w-xl mx-auto leading-relaxed">
                  我们与全球顶尖设计师及 AI 实验室合作，总结出引领 2025 年视觉世界的四个核心趋势。
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {trends.map((trend, i) => (
                  <div key={i} className={`p-10 rounded-[32px] border transition-all group ${themeClasses.card}`}>
                    <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${trend.color} mb-6 transition-all group-hover:w-24`} />
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-30 mb-2 block">{trend.tag}</span>
                    <h4 className="text-[20px] font-black mb-4 group-hover:text-indigo-600 transition-colors">{trend.title}</h4>
                    <p className="text-[14px] opacity-60 leading-relaxed mb-8">{trend.desc}</p>
                    <button 
                      onClick={() => setActiveTrendId(trend.id)}
                      className="flex items-center gap-2 text-[12px] font-bold text-indigo-600 hover:gap-4 transition-all uppercase tracking-widest"
                    >
                      深入探索案例 <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <section className={`p-12 rounded-[32px] bg-slate-900 text-white overflow-hidden relative group`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 transition-transform group-hover:rotate-45">
                  <Sparkles size={200} />
                </div>
                <div className="relative z-10 space-y-6">
                  <h4 className="text-[24px] font-black">AI 对 2025 的洞察</h4>
                  <p className="text-[16px] text-slate-400 max-w-2xl leading-relaxed italic">
                    “排版将不再是静态的布局。随着生成式 UI 的普及，字体将实时根据读者的情绪状态自动调节字宽和字间距，以达到最佳的共鸣效果。”
                  </p>
                  <div className="flex items-center gap-4 text-[12px] font-bold text-indigo-400">
                    <Zap size={16} /> 预测由 Gemini 3 Pro 生成
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* Trend Case Details View */
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-8 md:p-12 space-y-24">
                {activeTrend.cases.map((caseItem, i) => (
                  <div key={i} className="space-y-12">
                    <section className="grid md:grid-cols-5 gap-12">
                      <div className="md:col-span-2 space-y-8">
                        <div>
                          <span className={`${themeClasses.badge} px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest`}>
                            Case Study {i + 1}
                          </span>
                          <h3 className="text-[32px] font-black mt-4 leading-tight">{caseItem.title}</h3>
                          <p className="text-indigo-600 font-bold text-[14px]">品牌: {caseItem.brand}</p>
                        </div>
                        
                        <p className={`text-[15px] leading-relaxed ${themeClasses.content}`}>
                          {caseItem.description}
                        </p>

                        <div className="space-y-4">
                           <h4 className="text-[12px] font-black opacity-30 uppercase tracking-[0.2em]">技术亮点 / TECH SPECS</h4>
                           <div className="flex flex-wrap gap-2">
                             {caseItem.features.map(f => (
                               <span key={f} className={`px-4 py-2 rounded-xl border ${themeClasses.card} text-[13px] font-bold flex items-center gap-2`}>
                                 <Cpu size={14} className="text-indigo-600" /> {f}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <div className={`aspect-[4/3] rounded-[32px] border ${themeClasses.card} overflow-hidden flex items-center justify-center relative group`}>
                           {/* Decorative background for case */}
                           <div className={`absolute inset-0 opacity-10 ${caseItem.previewColor || 'bg-indigo-600'}`} />
                           
                           {/* Simulated UI Preview */}
                           <div className="text-center p-12 group-hover:scale-105 transition-transform duration-700 relative z-10">
                              <Type size={120} className="mx-auto mb-8 opacity-20" />
                              <div className="space-y-4">
                                <div className="h-4 w-64 bg-current/10 rounded-full mx-auto" />
                                <div className="h-4 w-40 bg-current/10 rounded-full mx-auto" />
                                <div className="h-4 w-56 bg-current/10 rounded-full mx-auto" />
                              </div>
                           </div>
                           <button className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-md">
                              <Eye size={32} />
                              <span className="font-bold text-[14px]">查看原尺寸预览</span>
                           </button>
                        </div>
                      </div>
                    </section>

                    <section className={`p-10 rounded-[32px] border border-dashed border-indigo-500/20 ${isDarkTheme ? 'bg-indigo-500/5' : 'bg-indigo-50/50'}`}>
                      <h4 className="text-[14px] font-black mb-8 flex items-center gap-2">
                        <Monitor size={18} className="text-indigo-600" /> 设计指引 / DESIGN PARAMETERS
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {Object.entries(caseItem.parameters).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{key}</p>
                            <p className="text-[18px] font-mono font-bold text-indigo-600">{value}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ))}

                <section className="flex flex-col items-center text-center py-20 space-y-8">
                   <div className="w-16 h-16 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-600 animate-bounce">
                     <Target size={32} />
                   </div>
                   <div className="max-w-md mx-auto space-y-3">
                     <h4 className="text-[24px] font-black">准备好尝试了吗？</h4>
                     <p className={`text-[15px] opacity-60 leading-relaxed`}>前往排版实验室，立即应用这些先进参数。您可以根据案例中的数值进行微调，创造属于您的独特视觉。</p>
                   </div>
                   <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                   >
                     立即开启实验
                   </button>
                </section>
              </div>
            </div>
          )}
        </div>

        <footer className={`p-8 border-t border-current/5 flex items-center justify-between bg-current/5 shrink-0 relative z-10`}>
           <div className="flex items-center gap-3">
              <Database className="text-indigo-600" size={18} />
              <div className="text-[12px] font-bold opacity-30 italic">
                Trends Archive v2.5.0 • Updated Monthly
              </div>
           </div>
           <div className="flex items-center gap-4">
              {activeTrendId && (
                <button 
                  onClick={() => setActiveTrendId(null)}
                  className="px-6 py-3 border border-current/10 rounded-2xl font-bold text-[14px] hover:bg-current/5 transition-all"
                >
                  返回趋势列表
                </button>
              )}
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-[14px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                获取白皮书高清版 (.PDF)
              </button>
           </div>
        </footer>
      </div>
    </div>
  );
};

// Add Database icon to imports from lucide-react above (already added in the prompt but ensuring consistency)
import { Database } from 'lucide-react';

export default TypographyTrendsModal;
