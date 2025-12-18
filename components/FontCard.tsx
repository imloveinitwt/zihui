
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Font } from '../types';
import { Download, Heart, Scale, Info, Moon, Sun, Settings2, Italic, Palette } from 'lucide-react';

interface FontCardProps {
  font: Font;
  previewText: string;
  fontSize: number;
  onSelect: (font: Font) => void;
  onShowDetails: (font: Font) => void;
  isFavorite: boolean;
  onToggleFavorite: (font: Font) => void;
  isComparing: boolean;
  onToggleCompare: (font: Font) => void;
}

// 扩展主题选项
type CardTheme = 'light' | 'dark' | 'indigo' | 'rose' | 'amber' | 'emerald';

const THEME_CONFIG: Record<CardTheme, { container: string, text: string, sub: string, border: string, badge: string }> = {
  'light': {
    container: 'bg-white',
    text: 'text-slate-900',
    sub: 'text-slate-400',
    border: 'border-slate-100',
    badge: 'bg-slate-50 text-slate-500'
  },
  'dark': {
    container: 'bg-slate-900',
    text: 'text-white',
    sub: 'text-slate-500',
    border: 'border-slate-800',
    badge: 'bg-white/5 text-slate-400'
  },
  'indigo': {
    container: 'bg-indigo-600',
    text: 'text-white',
    sub: 'text-indigo-200/60',
    border: 'border-indigo-500',
    badge: 'bg-white/10 text-white/80'
  },
  'rose': {
    container: 'bg-rose-500',
    text: 'text-white',
    sub: 'text-rose-200/60',
    border: 'border-rose-400',
    badge: 'bg-white/10 text-white/80'
  },
  'amber': {
    container: 'bg-amber-400',
    text: 'text-amber-950',
    sub: 'text-amber-900/40',
    border: 'border-amber-300',
    badge: 'bg-black/5 text-amber-900/60'
  },
  'emerald': {
    container: 'bg-emerald-600',
    text: 'text-white',
    sub: 'text-emerald-200/60',
    border: 'border-emerald-500',
    badge: 'bg-white/10 text-white/80'
  }
};

const CATEGORY_MAP: Record<string, string> = {
  'sans-serif': '无衬线',
  'serif': '衬线体',
  'display': '展示体',
  'handwriting': '手写体',
  'monospace': '等宽体'
};

const WEIGHT_NAME_MAP: Record<string, string> = {
  '100': 'Thin',
  '200': 'Extra Light',
  '300': 'Light',
  '400': 'Regular',
  'regular': 'Regular',
  '500': 'Medium',
  '600': 'Semi Bold',
  '700': 'Bold',
  'bold': 'Bold',
  '800': 'Extra Bold',
  '900': 'Black',
};

const EN_DEFAULT = "Stay hungry, stay foolish.";
const CN_DEFAULT = "书山有路勤为径。";

const WeightIcon = ({ weight, isItalic, active }: { weight: string, isItalic: boolean, active: boolean }) => {
  const w = parseInt(weight) || 400;
  const strokeWidth = 1.2 + (w - 100) * (3.5 / 800);
  
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-500 ease-out ${isItalic ? 'skew-x-[-12deg]' : ''} ${active ? 'scale-110' : 'scale-90 opacity-40 group-hover:opacity-100'}`}
    >
      <path d="M4 20L12 4L20 20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
};

const FontCard: React.FC<FontCardProps> = ({ 
  font, previewText, fontSize, onSelect, onShowDetails, isFavorite, onToggleFavorite, isComparing, onToggleCompare 
}) => {
  const [activeVariant, setActiveVariant] = useState(font.variants[0] || 'regular');
  const [cardTheme, setCardTheme] = useState<CardTheme>('light');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const themeStyle = THEME_CONFIG[cardTheme];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const familyQuery = font.family.replace(/ /g, '+');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${familyQuery}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, [font.family, isVisible]);

  const isChineseFont = useMemo(() => ['SC', 'ZCOOL', 'Ma Shan', 'Zhi Mang', 'Long Cang', 'Liu Jian', 'PuHuiTi', 'ShuHeiTi'].some(k => font.family.includes(k) || (font.chineseName && font.chineseName.includes(k))), [font.family, font.chineseName]);
  const displayPreview = useMemo(() => previewText.trim() || (isChineseFont ? CN_DEFAULT : EN_DEFAULT), [previewText, isChineseFont]);

  const sortedVariants = useMemo(() => {
    return [...font.variants].sort((a, b) => {
      const wa = parseInt(a.match(/\d+/)?.[0] || '400');
      const wb = parseInt(b.match(/\d+/)?.[0] || '400');
      return wa - wb;
    });
  }, [font.variants]);

  const getVariantStyles = (variant: string) => {
    const style: React.CSSProperties = {
      fontFamily: isVisible ? `"${font.family}", sans-serif` : 'sans-serif',
    };
    const v = variant.toLowerCase();
    style.fontStyle = v.includes('italic') ? 'italic' : 'normal';
    const weightMatch = v.match(/\d+/);
    if (weightMatch) style.fontWeight = weightMatch[0];
    else if (v.includes('bold')) style.fontWeight = '700';
    else if (v.includes('thin') || v.includes('light')) style.fontWeight = '300';
    else style.fontWeight = '400';
    return style;
  };

  const activeStyle = useMemo(() => ({
    ...getVariantStyles(activeVariant),
    fontSize: `${fontSize}px`,
    lineHeight: 1.2,
    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    opacity: isVisible ? 1 : 0.3
  }), [activeVariant, font.family, fontSize, isVisible]);

  const toggleTheme = (theme: CardTheme) => {
    setCardTheme(theme);
    setShowThemePicker(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`group relative border rounded-[3.5rem] p-10 pb-10 transition-all duration-700 overflow-hidden flex flex-col h-full hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3 ${themeStyle.container} ${themeStyle.border} ${themeStyle.text} ${isComparing ? 'ring-4 ring-indigo-500/30 shadow-indigo-500/20 shadow-lg' : ''}`}
    >
      {/* 悬浮操作栏 */}
      <div className={`absolute top-8 right-10 flex items-center gap-2 backdrop-blur-xl rounded-full p-2 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 border ${cardTheme === 'light' ? 'bg-white/60 border-white/80 shadow-lg' : 'bg-black/20 border-white/10 shadow-2xl'}`}>
        
        {/* 皮肤选择器容器 */}
        <div className="flex items-center gap-1.5 px-2">
           {showThemePicker ? (
             <div className="flex items-center gap-2 px-1 animate-in slide-in-from-right-2 fade-in">
               {(Object.keys(THEME_CONFIG) as CardTheme[]).map(t => (
                 <button 
                  key={t}
                  onClick={() => toggleTheme(t)}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${t === 'light' ? 'bg-white border-slate-200' : t === 'dark' ? 'bg-slate-900 border-slate-700' : t === 'indigo' ? 'bg-indigo-500 border-indigo-400' : t === 'rose' ? 'bg-rose-500 border-rose-400' : t === 'amber' ? 'bg-amber-400 border-amber-300' : 'bg-emerald-500 border-emerald-400'} ${cardTheme === t ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                 />
               ))}
             </div>
           ) : (
             <button 
              onClick={() => setShowThemePicker(true)} 
              className={`p-3 rounded-full hover:bg-white/20 transition-all ${cardTheme === 'light' ? 'text-slate-400' : 'text-white/60'}`}
              title="切换皮肤"
             >
               <Palette size={18} />
             </button>
           )}
        </div>

        <div className={`w-px h-5 ${cardTheme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
        
        <button 
          onClick={() => alert(`正在准备下载 ${font.family}...`)} 
          className="p-3 rounded-full transition-all bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-110 active:scale-90 shadow-indigo-500/20 shadow-lg"
          title="下载字体"
        >
          <Download size={18} />
        </button>
        
        <button onClick={() => onToggleCompare(font)} className={`p-3 rounded-full transition-all ${isComparing ? 'bg-indigo-600 text-white' : 'hover:bg-white/20'}`} title="对比分析">
          <Scale size={18} />
        </button>
        
        <button 
          onClick={() => onToggleFavorite(font)} 
          className={`p-3 rounded-full transition-all hover:scale-110 active:scale-75 ${isFavorite ? 'text-red-500' : (cardTheme === 'light' ? 'text-slate-400' : 'text-white/40')}`} 
          title={isFavorite ? "取消收藏" : "加入收藏"}
        >
          <Heart size={18} className={`${isFavorite ? 'fill-red-500 animate-in zoom-in-125 duration-300' : ''}`} />
        </button>
      </div>

      <div className="mb-10">
        <div className="flex items-start gap-4">
          {isChineseFont && (
            <div className={`shrink-0 w-8 h-8 mt-1 rounded-xl flex items-center justify-center text-[12px] font-black shadow-sm ${cardTheme === 'light' ? 'bg-rose-500 text-white' : 'bg-rose-400 text-slate-900'}`}>中</div>
          )}
          <div className="flex flex-col">
            <h3 className="text-3xl font-black tracking-tighter leading-none mb-2">{font.chineseName || font.family}</h3>
            <span className={`text-[12px] font-black uppercase tracking-[0.25em] font-mono ${themeStyle.sub}`}>{font.family}</span>
          </div>
        </div>
        <div className={`flex items-center flex-wrap gap-4 mt-6 ${isChineseFont ? 'pl-12' : 'pl-0'}`}>
          <p className={`text-[12px] font-black uppercase tracking-[0.3em] font-mono py-1 px-3 border rounded-full border-current opacity-60`}>
            {CATEGORY_MAP[font.category] || font.category}
          </p>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center min-h-[220px] px-2 py-8 overflow-hidden">
        {!isVisible ? (
          <div className="animate-pulse flex items-center gap-2 opacity-40 font-bold uppercase tracking-widest text-[14px]">
             <span className={`w-2.5 h-2.5 rounded-full ${cardTheme === 'light' ? 'bg-indigo-200' : 'bg-white/20'}`}></span> 资源加载中...
          </div>
        ) : (
          <p style={activeStyle} className="break-words w-full text-center">
            {displayPreview}
          </p>
        )}
      </div>

      <div className="mt-8">
        {/* 字重选择器 */}
        <div className={`flex items-center gap-2 p-2 rounded-[2rem] overflow-x-auto no-scrollbar transition-colors ${cardTheme === 'light' ? 'bg-slate-50' : 'bg-white/5'}`}>
          {sortedVariants.map((v) => {
            const isSelected = activeVariant === v;
            const weightVal = v.match(/\d+/)?.[0] || (v.toLowerCase().includes('bold') ? '700' : '400');
            const isItalic = v.toLowerCase().includes('italic');
            const weightName = WEIGHT_NAME_MAP[weightVal] || 'Regular';
            const tooltip = `${weightName}${isItalic ? ' Italic' : ''} (${weightVal})`;

            return (
              <button
                key={v}
                onClick={() => setActiveVariant(v)}
                title={tooltip}
                className={`group relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] scale-110 z-10' : 'hover:bg-white hover:shadow-sm'}`}
              >
                <WeightIcon weight={weightVal} isItalic={isItalic} active={isSelected} />
                {isItalic && (
                  <span className={`absolute bottom-2 right-2 transition-opacity duration-300 ${isSelected ? 'text-white opacity-100' : 'text-indigo-500 opacity-40 group-hover:opacity-100'}`}>
                    <Italic size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 详情触发条 */}
        <div className="mt-8">
          <button 
            onClick={() => onShowDetails(font)}
            className={`w-full group/bar flex items-center justify-between px-7 py-6 rounded-[2.5rem] border transition-all duration-500 ${themeStyle.badge} border-transparent hover:border-current/20 shadow-sm`}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <span className={`flex items-center justify-center w-9 h-9 rounded-full bg-current/10 group-hover/bar:bg-indigo-600 group-hover/bar:text-white transition-all`}><Info size={16} /></span>
              <div className="flex flex-col items-start overflow-hidden">
                 <span className={`text-[14px] font-bold italic opacity-70 leading-normal line-clamp-1 text-left`}>{font.description || '探索极致的文字排版之美。'}</span>
              </div>
            </div>
            <div className={`p-3 rounded-2xl bg-current/5 group-hover/bar:bg-indigo-600/10 transition-all`}>
              <Settings2 size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontCard;
