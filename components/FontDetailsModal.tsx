
import React, { useEffect, useState } from 'react';
import { Font } from '../types';
import { X, Download, Heart, ShieldCheck, User, Globe, Tag, Info, Hash } from 'lucide-react';

interface Props {
  font: Font;
  onClose: () => void;
  previewText: string;
  isFavorite: boolean;
  onToggleFavorite: (font: Font) => void;
}

const FontDetailsModal: React.FC<Props> = ({ font, onClose, previewText, isFavorite, onToggleFavorite }) => {
  const [currentVariant, setCurrentVariant] = useState(font.variants.includes('400') ? '400' : font.variants[0]);
  const isChinese = font.subsets.includes('chinese-simplified');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const accentColor = isChinese ? 'text-rose-600' : 'text-indigo-600';
  const accentBorder = isChinese ? 'border-rose-500' : 'border-indigo-500';
  const accentBg = isChinese ? 'bg-rose-600' : 'bg-indigo-600';
  const accentShadow = isChinese ? 'shadow-rose-200' : 'shadow-indigo-200';

  const weight = currentVariant.includes('italic') ? currentVariant.replace('italic', '') : currentVariant;
  const isItalic = currentVariant.includes('italic');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* 增强的遮挡背景 */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300 cursor-zoom-out" 
        onClick={onClose} 
      />
      
      {/* 核心容器 */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[10px] shadow-2xl flex flex-col overflow-hidden expand-enter">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 h-16 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <h2 className={`text-[18px] font-semibold ${accentColor}`}>{font.chineseName || font.family}</h2>
            <span className="text-[13px] font-mono text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-[10px]">{font.family}</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white">
          <div className="bg-slate-50 rounded-[10px] p-12 flex items-center justify-center border border-slate-100 min-h-[300px] shadow-inner relative overflow-hidden group">
             <div className="absolute top-4 left-4 text-[13px] font-bold text-slate-300 uppercase tracking-tighter">Live Weight Preview</div>
             <p 
               style={{ 
                 fontFamily: `"${font.family}", sans-serif`, 
                 fontSize: '64px', 
                 lineHeight: 1.1,
                 fontWeight: weight,
                 fontStyle: isItalic ? 'italic' : 'normal'
               }}
               className="text-center text-slate-900 break-words w-full selection:bg-rose-100 transition-all duration-300"
             >
               {previewText || (font.chineseName ? "书山有路勤为径。" : "Visual Narrative.")}
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} className={accentColor} /> 技术档案 / TECHNICAL
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-[10px] border border-slate-100 transition-colors hover:border-slate-200">
                  <p className="text-[13px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-2"><User size={12}/> 设计师</p>
                  <p className="font-semibold text-[14px] text-slate-800">{font.designer || '开源社区贡献者'}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-[10px] border border-slate-100 transition-colors hover:border-slate-200">
                  <p className="text-[13px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-2"><Globe size={12}/> 来源</p>
                  <p className="font-semibold text-[14px] text-slate-800">{font.source || 'Google Fonts'}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-[10px] border border-slate-100 transition-colors hover:border-slate-200 col-span-2">
                  <p className="text-[13px] text-slate-400 font-bold uppercase mb-2 flex items-center gap-2"><Tag size={12}/> 授权协议</p>
                  <p className={`font-semibold text-[14px] ${accentColor}`}>{font.license || 'SIL Open Font License 1.1'}</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={16} className={accentColor} /> 字重变体 / VARIANTS
              </h3>
              <div className="bg-slate-50 p-6 rounded-[10px] border-l-4 border-slate-200 focus-within:border-rose-500 transition-all">
                <div className="flex flex-wrap gap-2">
                  {font.variants.map(v => (
                    <button
                      key={v}
                      onClick={() => setCurrentVariant(v)}
                      className={`text-[12px] font-bold px-4 py-2 rounded-[10px] border transition-all active:scale-95 ${
                        currentVariant === v 
                          ? `${accentBg} text-white border-transparent shadow-lg ${accentShadow}` 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {v === '400' ? 'Regular' : v === '700' ? 'Bold' : v}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-slate-400 italic">
                  点击上方标签切换实时预览效果
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={14} className="opacity-50" /> 风格特点
                </label>
                <p className="text-[14px] text-slate-600 leading-relaxed italic pl-3 border-l-2 border-slate-100">
                  {font.features || '探索极致的文字排版之美。这款字体通过对空间与比例的精准把控，旨在创造一种无干扰的沉浸式阅读体验。'}
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 h-20 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <button 
            onClick={() => onToggleFavorite(font)} 
            className={`flex items-center gap-2 text-[14px] font-semibold transition-all group ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className="group-hover:scale-110 transition-transform" />
            {isFavorite ? '已加入收藏' : '添加至收藏'}
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-[10px] border border-slate-200 text-slate-500 font-semibold text-[13px] hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              返回列表
            </button>
            <button className={`px-6 py-2.5 rounded-[10px] ${accentBg} text-white font-semibold text-[13px] hover:opacity-90 transition-all shadow-lg ${accentShadow} flex items-center gap-2 active:scale-95`}>
              <Download size={16} /> 立即下载安装
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDetailsModal;
