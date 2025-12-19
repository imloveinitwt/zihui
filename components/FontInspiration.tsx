
import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Check, Search, Type, ArrowRight } from 'lucide-react';
import { discoverFonts } from '../services/geminiService';
import { Font, Category } from '../types';

interface FontInspirationProps {
  onImportFont: (font: Partial<Font>) => void;
  existingFontFamilies: string[];
  theme?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': '无衬线',
  'serif': '衬线',
  'display': '展示',
  'handwriting': '手写',
  'monospace': '等宽'
};

const FontInspiration: React.FC<FontInspirationProps> = ({ onImportFont, existingFontFamilies, theme = 'classic' }) => {
  const [prompt, setPrompt] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [results, setResults] = useState<Partial<Font>[]>([]);
  const [addedFamilies, setAddedFamilies] = useState<string[]>([]);

  const isDarkTheme = theme === 'midnight';

  const handleDiscover = async () => {
    if (!prompt.trim()) return;
    setIsDiscovering(true);
    setResults([]);
    try {
      const fonts = await discoverFonts(prompt);
      setResults(fonts);
      
      if (fonts.length > 0) {
        const link = document.createElement('link');
        const families = fonts.map(f => f.family?.replace(/ /g, '+')).join('|');
        link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleAdd = (font: Partial<Font>) => {
    onImportFont(font);
    if (font.family) {
      setAddedFamilies(prev => [...prev, font.family!]);
    }
  };

  const themeClasses = {
    container: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    header: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100',
    input: isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900',
    card: isDarkTheme ? 'bg-slate-950 border-slate-800 hover:border-rose-500/30' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-rose-200',
    title: isDarkTheme ? 'text-slate-100' : 'text-slate-900',
    desc: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
    iconBg: isDarkTheme ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-600'
  };

  return (
    <div className={`${themeClasses.container} rounded-[10px] border shadow-sm overflow-hidden flex flex-col h-full min-h-[440px]`}>
      <div className={`p-8 border-b ${themeClasses.header}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${themeClasses.iconBg} rounded-[10px] flex items-center justify-center`}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className={`text-[16px] font-semibold ${themeClasses.title}`}>字体灵感探索</h3>
            <p className={`${isDarkTheme ? 'text-slate-600' : 'text-slate-400'} text-[13px] font-medium uppercase tracking-widest`}>DISCOVER BY CONTEXT</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入风格描述，如：80年代赛博朋克..."
            className={`w-full ${themeClasses.input} rounded-[10px] pl-10 pr-12 py-2.5 text-[14px] focus:border-rose-500 outline-none transition-all shadow-inner`}
            onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
          />
          <button 
            onClick={handleDiscover}
            disabled={isDiscovering || !prompt}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-rose-600 text-white rounded-[10px] hover:bg-rose-700 transition-all disabled:opacity-50"
          >
            {isDiscovering ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-grow p-8 space-y-4 overflow-y-auto no-scrollbar max-h-[360px]">
        {results.length > 0 ? (
          results.map((font, idx) => {
            const isAdded = addedFamilies.includes(font.family!) || existingFontFamilies.includes(font.family!);
            return (
              <div 
                key={font.family || idx} 
                className={`group p-4 ${themeClasses.card} rounded-[10px] hover:shadow-sm transition-all animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[13px] font-bold uppercase tracking-widest ${isDarkTheme ? 'text-rose-400 bg-rose-500/10' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-[10px]`}>
                    {CATEGORY_LABELS[font.category as string] || font.category}
                  </span>
                  <button 
                    onClick={() => handleAdd(font)}
                    disabled={isAdded}
                    className={`flex items-center gap-1 px-3 py-1 rounded-[10px] border text-[13px] font-bold transition-all ${
                      isAdded 
                      ? 'text-green-500 border-green-500/30 bg-green-500/10' 
                      : (isDarkTheme ? 'text-slate-500 border-slate-800 hover:text-rose-400 hover:border-rose-500/30' : 'text-slate-400 border-slate-200 hover:text-rose-600 hover:border-rose-300 hover:bg-white')
                    }`}
                  >
                    {isAdded ? <><Check size={14} /> 已收录</> : <><Plus size={14} /> 收录</>}
                  </button>
                </div>
                <div className="mb-2">
                  <h4 
                    style={{ fontFamily: `"${font.family}", sans-serif` }}
                    className={`text-2xl ${themeClasses.title} truncate font-medium group-hover:text-rose-500 transition-colors`}
                  >
                    {font.chineseName || font.family}
                  </h4>
                  <p className={`text-[13px] font-mono ${isDarkTheme ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-widest`}>{font.family}</p>
                </div>
                <p className={`text-[13px] ${themeClasses.desc} italic leading-relaxed`}>
                  “{font.description}”
                </p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
            <div className={`w-12 h-12 ${isDarkTheme ? 'bg-slate-800' : 'bg-slate-100'} rounded-[10px] flex items-center justify-center mb-4`}>
              <Type size={24} className={isDarkTheme ? 'text-slate-600' : 'text-slate-400'} />
            </div>
            <p className={`text-[13px] font-bold ${isDarkTheme ? 'text-slate-600' : 'text-slate-500'} uppercase tracking-widest`}>输入描述发现新灵感</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontInspiration;
