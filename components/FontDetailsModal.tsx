
import React, { useEffect, useState } from 'react';
import { Font } from '../types';
import { X, ShieldCheck, User, Tag, Calendar, Globe, FileText, CheckCircle2, AlertCircle, AlignLeft, Info, Download, Heart, Zap, Target } from 'lucide-react';

interface FontDetailsModalProps {
  font: Font;
  onClose: () => void;
  previewText: string;
  isFavorite: boolean;
  onToggleFavorite: (font: Font) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  'sans-serif': '无衬线',
  'serif': '衬线体',
  'display': '展示体',
  'handwriting': '手写体',
  'monospace': '等宽体'
};

const FontDetailsModal: React.FC<FontDetailsModalProps> = ({ font, onClose, previewText, isFavorite, onToggleFavorite }) => {
  const [activeVariant, setActiveVariant] = useState(font.variants[0] || 'regular');
  const sourceName = font.source || 'Google Fonts';
  const isChineseFont = ['SC', 'ZCOOL', 'Ma Shan', 'Zhi Mang', 'Long Cang', 'Liu Jian', 'PuHuiTi', 'ShuHeiTi'].some(k => font.family.includes(k) || (font.chineseName && font.chineseName.includes(k)));
  const displayPreview = previewText.trim() || (isChineseFont ? "书山有路勤为径。" : "Stay hungry, stay foolish.");

  useEffect(() => {
    const familyQuery = font.family.replace(/ /g, '+');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${familyQuery}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [font.family]);

  const getVariantStyles = (variant: string) => {
    const style: React.CSSProperties = { fontFamily: `"${font.family}", sans-serif` };
    const v = variant.toLowerCase();
    style.fontStyle = v.includes('italic') ? 'italic' : 'normal';
    const weightMatch = v.match(/\d+/);
    if (weightMatch) style.fontWeight = weightMatch[0];
    else if (v.includes('bold')) style.fontWeight = '700';
    else style.fontWeight = '400';
    return style;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* 左侧：艺术预览区 */}
        <div className="w-full md:w-1/2 bg-slate-50 relative flex flex-col p-12 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 flex justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">{font.chineseName || font.family}</h2>
              <span className="text-[14px] font-black uppercase tracking-[0.2em] text-indigo-500/60 font-mono">{font.family}</span>
            </div>
            <div className="bg-white/80 backdrop-blur shadow-sm border border-slate-100 px-4 py-2 rounded-2xl">
               <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{CATEGORY_MAP[font.category] || font.category}</span>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center py-12">
            <p style={{ ...getVariantStyles(activeVariant), fontSize: 'clamp(32px, 8vw, 80px)', lineHeight: 1.1 }} className="text-center break-words w-full text-slate-900">
              {displayPreview}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 relative z-10">
            {font.variants.map(v => (
              <button 
                key={v} 
                onClick={() => setActiveVariant(v)}
                className={`px-6 py-3 rounded-2xl text-[14px] font-black transition-all ${activeVariant === v ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：档案与信息区 */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto no-scrollbar bg-white">
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur px-10 py-6 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-4">
               <button onClick={() => onToggleFavorite(font)} className={`p-3 rounded-2xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-red-500'}`}>
                 <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
               </button>
               <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[14px] hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200">
                 <Download size={18} /> 获取字体
               </button>
            </div>
            <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-10 space-y-10">
            {/* 特点与场景 (核心新增) */}
            <div className="grid grid-cols-1 gap-6">
               <section className="bg-amber-50/50 border border-amber-100 rounded-[2.5rem] p-8 space-y-4">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Zap size={20} />
                    <h3 className="text-[14px] font-black uppercase tracking-widest">核心特点 / Features</h3>
                  </div>
                  <p className="text-[15px] font-bold text-slate-700 leading-relaxed">
                    {font.features || '均衡的字重设计与极佳的阅读舒适度。'}
                  </p>
               </section>

               <section className="bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-8 space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                    <Target size={20} />
                    <h3 className="text-[14px] font-black uppercase tracking-widest">适用场景 / Scenarios</h3>
                  </div>
                  <p className="text-[15px] font-bold text-slate-700 leading-relaxed">
                    {font.scenarios || '适用于各类品牌排版与数字媒介。'}
                  </p>
               </section>
            </div>

            {/* 字体简介 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <AlignLeft size={18} className="text-indigo-500" />
                <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">Project Description / 简介</h3>
              </div>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium italic">
                “ {font.description} ”
              </p>
            </section>

            {/* 技术档案 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-indigo-500" />
                <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">Technical Dossier / 技术档案</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="flex flex-col gap-1.5 border-l-2 border-indigo-500/20 pl-5">
                    <span className="text-[12px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><User size={14}/> 设计师</span>
                    <span className="text-[15px] font-black text-slate-800">{font.designer || '社区贡献者'}</span>
                 </div>
                 <div className="flex flex-col gap-1.5 border-l-2 border-slate-300/30 pl-5">
                    <span className="text-[12px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Globe size={14}/> 品牌系列</span>
                    <span className="text-[15px] font-black text-slate-800">{sourceName}</span>
                 </div>
                 <div className="flex flex-col gap-1.5 border-l-2 border-slate-300/30 pl-5">
                    <span className="text-[12px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Calendar size={14}/> 更新日期</span>
                    <span className="text-[15px] font-black text-slate-800">{font.lastModified}</span>
                 </div>
                 <div className="flex flex-col gap-1.5 border-l-2 border-slate-300/30 pl-5">
                    <span className="text-[12px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Tag size={14}/> 许可协议</span>
                    <span className="text-[15px] font-black text-emerald-600">{font.license || 'SIL OFL 1.1'}</span>
                 </div>
              </div>
            </section>

            <section className="space-y-4 pb-10">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-indigo-500" />
                <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">Legal Notice / 法律声明</h3>
              </div>
              <p className="text-[13px] leading-relaxed font-bold italic text-slate-400 border-l-4 border-slate-100 pl-6">
                {font.copyright}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDetailsModal;
