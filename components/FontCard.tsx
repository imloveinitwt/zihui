
import React, { useRef, useState, useEffect } from 'react';
import { Font } from '../types';
import { Download, Heart, ArrowUpRight, GripVertical, Copyright, Hash, Globe, Scale } from 'lucide-react';

interface FontCardProps {
  font: Font;
  previewText: string;
  fontSize: number;
  onShowDetails: (font: Font) => void;
  isFavorite: boolean;
  onToggleFavorite: (font: Font) => void;
  isComparing?: boolean;
  onToggleCompare?: () => void;
  draggable?: boolean;
  theme?: string;
}

const FontCard: React.FC<FontCardProps> = ({ 
  font, 
  previewText, 
  fontSize, 
  onShowDetails, 
  isFavorite, 
  onToggleFavorite, 
  isComparing,
  onToggleCompare,
  draggable, 
  theme = 'classic' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(font.variants.includes('400') ? '400' : font.variants[0]);
  const cardRef = useRef<HTMLDivElement>(null);

  const isDarkTheme = theme === 'midnight';
  const isChinese = font.subsets.includes('chinese-simplified');
  
  // 视口监测
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        obs.disconnect();
      }
    });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  // 字体加载逻辑
  useEffect(() => {
    if (!isVisible) return;
    
    setIsFontLoaded(false);
    
    const fallbackTimer = setTimeout(() => {
      setIsFontLoaded(true);
    }, 2500);

    const familyQuery = font.family.replace(/ /g, '+');
    const weight = selectedVariant.includes('italic') ? selectedVariant.replace('italic', '') : selectedVariant;
    const isItalic = selectedVariant.includes('italic');
    
    const weightSpec = `:ital,wght@${isItalic ? '1' : '0'},${weight}`;
    const fontUrl = `https://fonts.googleapis.com/css2?family=${familyQuery}${weightSpec}&display=swap`;
    
    const checkFontReady = () => {
      const fontSpec = `${isItalic ? 'italic' : 'normal'} ${weight} 16px "${font.family}"`;
      document.fonts.load(fontSpec).then(() => {
        clearTimeout(fallbackTimer);
        setTimeout(() => setIsFontLoaded(true), 400);
      }).catch(() => {
        setIsFontLoaded(true);
      });
    };

    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.onload = checkFontReady;
      link.onerror = () => setIsFontLoaded(true);
      document.head.appendChild(link);
    } else {
      checkFontReady();
    }

    return () => clearTimeout(fallbackTimer);
  }, [isVisible, font.family, selectedVariant]);

  const styleTags = font.features 
    ? font.features.split(/[，,。.\s]+/).filter(tag => tag.length >= 2).slice(0, 3) 
    : [];

  const displayPreview = previewText.trim() || (font.chineseName ? "笔尖意蕴，墨香延绵。" : "简约之美，见微知著。");
  const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`;

  const accentClasses = {
    border: isChinese 
      ? (isDarkTheme ? 'hover:border-rose-500/60' : 'hover:border-rose-400') 
      : (isDarkTheme ? 'hover:border-indigo-500/60' : 'hover:border-indigo-400'),
    shadow: isChinese ? 'hover:shadow-rose-500/10' : 'hover:shadow-indigo-500/10',
    text: isChinese ? 'text-rose-600' : 'text-indigo-600',
    linkHover: isChinese ? 'hover:text-rose-500' : 'hover:text-indigo-500',
    btnSelected: isChinese ? 'bg-rose-600 border-rose-600' : 'bg-indigo-600 border-indigo-600',
    badge: isChinese 
      ? (isDarkTheme ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-200')
      : (isDarkTheme ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'),
    indicator: isChinese ? 'bg-rose-500' : 'bg-indigo-500',
    metaIcon: isChinese ? 'text-rose-500/40' : 'text-indigo-500/40',
    inkColor: isChinese ? 'fill-rose-500/10' : 'fill-indigo-500/10'
  };

  const themeClasses = {
    card: isDarkTheme ? 'bg-slate-950 border-slate-800/60' : 'bg-white border-slate-200',
    title: isDarkTheme ? 'text-white' : 'text-slate-900',
    previewBg: isDarkTheme ? 'bg-slate-900/30' : 'bg-slate-50/50',
    previewText: isDarkTheme ? 'text-slate-100' : 'text-slate-800',
    desc: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
    metaBg: isDarkTheme ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-50/80 border-slate-100',
    hoverBtn: isDarkTheme ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    subText: isDarkTheme ? 'text-slate-500' : 'text-slate-400',
    tagBg: isDarkTheme ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500',
    footerBtn: isDarkTheme ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'
  };

  const categoryMap: Record<string, string> = {
    'sans-serif': '无衬线体',
    'serif': '衬线体',
    'display': '展示体',
    'handwriting': '手写体',
    'monospace': '等宽体'
  };

  return (
    <div 
      ref={cardRef}
      className={`${themeClasses.card} border rounded-[10px] p-8 flex flex-col h-full group transition-all duration-500 ease-out hover:-translate-y-1.5 ${accentClasses.border} hover:shadow-2xl ${accentClasses.shadow}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          {draggable && <GripVertical size={16} className={`mt-1.5 ${isDarkTheme ? 'text-slate-700' : 'text-slate-300'}`} />}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h3 className={`text-[19px] font-semibold ${themeClasses.title} leading-tight`}>
                <a 
                  href={googleFontsUrl} target="_blank" rel="noopener noreferrer"
                  className={`hover:underline transition-all duration-300 ${accentClasses.linkHover}`}
                >
                  {font.chineseName || font.family}
                </a>
              </h3>
              {isChinese && (
                <span className={`flex items-center justify-center w-5 h-5 rounded-[4px] border text-[10px] font-black ${accentClasses.badge} shadow-sm transform group-hover:rotate-6 transition-transform`}>
                  中
                </span>
              )}
            </div>
            <p className={`text-[11px] font-mono ${themeClasses.subText} uppercase tracking-[0.2em]`}>{font.family}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onToggleCompare?.(); }} className={`p-2 rounded-lg transition-all ${themeClasses.hoverBtn}`} title="加入对比">
            <Scale size={18} className={isComparing ? accentClasses.text : ''} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(font); }} className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-red-500 bg-red-50/10' : themeClasses.hoverBtn}`} title="收藏">
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onShowDetails(font); }} className={`p-2 rounded-lg transition-all ${themeClasses.hoverBtn}`} title="详情">
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
        {font.variants.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVariant(v)}
            className={`px-3 py-1 text-[11px] font-bold rounded-md border transition-all ${
              selectedVariant === v 
                ? `${accentClasses.btnSelected} text-white border-transparent shadow-md scale-105` 
                : `${isDarkTheme ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'} hover:border-slate-400`
            }`}
          >
            {v === '400' ? '常规' : v === '700' ? '加粗' : v}
          </button>
        ))}
      </div>

      <div className={`flex-grow flex items-center justify-center min-h-[160px] ${themeClasses.previewBg} rounded-[10px] mb-6 px-6 relative overflow-hidden`}>
        <div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-in-out ${
            isFontLoaded ? 'opacity-0 scale-125 blur-2xl' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {/* 水墨加载动画保持，汉化不需要移除视觉特效 */}
          <svg className="w-full h-full max-w-[280px]" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M10,40 Q50,30 90,45 T190,40" fill="none" strokeWidth="18" strokeLinecap="round" className={`ink-path ink-delay-1 ${isChinese ? 'stroke-rose-500/10' : 'stroke-indigo-500/10'}`} />
            <circle cx="100" cy="50" r="25" className={`ink-path ${accentClasses.inkColor}`} style={{ animationDuration: '3s' }} />
          </svg>
        </div>

        <p 
          style={{ 
            fontFamily: isFontLoaded ? `"${font.family}"` : 'serif',
            fontSize: `${fontSize}px`,
            fontWeight: selectedVariant.includes('italic') ? selectedVariant.replace('italic', '') : selectedVariant,
            fontStyle: selectedVariant.includes('italic') ? 'italic' : 'normal',
            lineHeight: 1.3
          }}
          className={`text-center transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${themeClasses.previewText} ${
            isFontLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {displayPreview}
        </p>
      </div>

      {styleTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {styleTags.map(tag => (
            <span key={tag} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${themeClasses.tagBg}`}>
              <Hash size={10} className="opacity-40" /> {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-3 rounded-full ${accentClasses.indicator}`} />
          <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkTheme ? 'text-slate-600' : 'text-slate-400'}`}>字体愿景</span>
        </div>
        <p className={`text-[13px] ${themeClasses.desc} italic leading-relaxed line-clamp-2`}>
          {font.description || "在纸张与数字之间，寻找那一份独特的书写灵感。这款字体不仅是排版的工具，更是情感的载体。"}
        </p>
      </div>

      <div className={`mt-auto ${themeClasses.metaBg} rounded-xl border p-4 space-y-2.5 transition-colors`}>
        {font.copyright && (
          <div className="flex items-start gap-3">
            <Copyright size={14} className={`${accentClasses.metaIcon} mt-0.5`} />
            <p className={`text-[12px] font-medium ${themeClasses.desc} leading-tight`}>{font.copyright}</p>
          </div>
        )}
        {font.source && (
          <div className="flex items-center gap-3">
            <Globe size={14} className={accentClasses.metaIcon} />
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase ${isDarkTheme ? 'text-slate-600' : 'text-slate-400'}`}>系列:</span>
              <span className={`text-[12px] font-bold ${accentClasses.text}`}>{font.source}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100/10 flex items-center justify-between">
        <span className={`text-[11px] font-black px-3 py-1.5 rounded-lg ${themeClasses.footerBtn}`}>
          {categoryMap[font.category] || font.category}
        </span>
        <button className={`flex items-center gap-2 text-[13px] font-bold transition-all hover:gap-3 ${isChinese ? 'text-rose-600' : 'text-indigo-600'}`}>
          下载字体 <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default FontCard;
