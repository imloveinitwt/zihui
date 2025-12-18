
import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Check, Search, Type, ArrowRight } from 'lucide-react';
import { discoverFonts } from '../services/geminiService';
import { Font, Category } from '../types';

interface FontInspirationProps {
  onImportFont: (font: Partial<Font>) => void;
  existingFontFamilies: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': '无衬线',
  'serif': '衬线',
  'display': '展示',
  'handwriting': '手写',
  'monospace': '等宽'
};

const FontInspiration: React.FC<FontInspirationProps> = ({ onImportFont, existingFontFamilies }) => {
  const [prompt, setPrompt] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [results, setResults] = useState<Partial<Font>[]>([]);
  const [addedFamilies, setAddedFamilies] = useState<string[]>([]);

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

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="p-10 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">字体灵感探索</h3>
            <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest mt-1">DISCOVER BY CONTEXT</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述项目氛围，如：80年代赛博朋克..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-16 py-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleDiscover()}
          />
          <button 
            onClick={handleDiscover}
            disabled={isDiscovering || !prompt}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-[0.8rem] hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg active:scale-90"
          >
            {isDiscovering ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-grow p-10 space-y-6 overflow-y-auto no-scrollbar max-h-[550px]">
        {results.length > 0 ? (
          results.map((font, idx) => {
            const isAdded = addedFamilies.includes(font.family!) || existingFontFamilies.includes(font.family!);
            return (
              <div 
                key={font.family || idx} 
                className="group/item p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all animate-in slide-in-from-bottom-3 fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[12px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {CATEGORY_LABELS[font.category as string] || font.category}
                  </span>
                  <button 
                    onClick={() => handleAdd(font)}
                    disabled={isAdded}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isAdded 
                      ? 'bg-green-50 text-green-600 border-green-100 cursor-default' 
                      : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-400'
                    }`}
                  >
                    {isAdded ? <Check size={20} /> : <Plus size={20} />}
                  </button>
                </div>
                <div className="mb-3">
                  <h4 
                    style={{ fontFamily: `"${font.family}", sans-serif` }}
                    className="text-3xl text-slate-900 truncate font-medium"
                  >
                    {font.chineseName || font.family}
                  </h4>
                  {font.chineseName && (
                    <p className="text-[12px] font-mono text-slate-400 uppercase mt-0.5 tracking-wider">{font.family}</p>
                  )}
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium italic border-l-2 border-slate-200 pl-4">
                  “{font.description}”
                </p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5">
              <Type size={32} className="text-slate-400" />
            </div>
            <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest">输入描述 开启你的字体发现之旅</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontInspiration;
