
import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Check } from 'lucide-react';
import { getFontPairing } from '../services/geminiService';
import { FontPairing, Category, Font } from '../types';

interface AIPairingProps {
  onImportFont: (font: Partial<Font>) => void;
  existingFontFamilies: string[];
}

const AIPairing: React.FC<AIPairingProps> = ({ onImportFont, existingFontFamilies }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [pairing, setPairing] = useState<FontPairing | null>(null);
  const [addedFonts, setAddedFonts] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAddedFonts([]);
    const result = await getFontPairing(prompt);
    setPairing(result);
    setLoading(false);

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${result.heading.replace(/ /g, '+')}&family=${result.body.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const handleImport = (family: string, isHeading: boolean) => {
    onImportFont({
      family,
      category: isHeading ? Category.SERIF : Category.SANS_SERIF,
      description: `AI 推荐用于 ${prompt} 的${isHeading ? '标题' : '正文'}字体`,
    });
    setAddedFonts(prev => [...prev, family]);
  };

  return (
    <section className="bg-slate-900 rounded-[10px] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[440px]">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Sparkles size={240} strokeWidth={1} />
      </div>

      <div className="relative z-10 w-full">
        {loading && (
          <div className="absolute -top-10 left-0 w-full h-1 bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-orange-500 animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-rose-500/20 p-2 rounded-[10px] transition-transform hover:rotate-15-hover">
            <Sparkles className="text-rose-400" size={24} />
          </div>
          <h2 className="text-[18px] font-semibold tracking-tight">AI 智能配对顾问</h2>
        </div>
        <p className="text-slate-400 mb-8 text-[14px]">
          只需输入项目愿景，AI 将为您推荐极致的文字排版组合。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述氛围，如：极简摄影、赛博朋克..."
            className="flex-grow bg-white/10 border border-white/10 rounded-[10px] px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-rose-500 focus:bg-white/20 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white font-semibold rounded-[10px] px-8 py-3 text-[13px] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : '开启探索'}
          </button>
        </div>

        {pairing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white/5 border border-white/10 rounded-[10px] p-6 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="group/item">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-rose-400">标题推荐</label>
                    <button 
                      onClick={() => handleImport(pairing.heading, true)}
                      disabled={addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading)}
                      className="text-[13px] font-bold text-rose-400 hover:text-rose-300 disabled:text-green-400 flex items-center gap-1 transition-all"
                    >
                      {addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading) ? <Check size={14} /> : <Plus size={14} />}
                      {addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading) ? '已收录' : '库中保存'}
                    </button>
                  </div>
                  <p 
                    style={{ fontFamily: `"${pairing.heading}", serif` }}
                    className="text-4xl font-medium leading-none mb-1 group-hover/item:translate-x-1 transition-transform"
                  >
                    视觉焦点
                  </p>
                  <p className="text-[13px] text-white/30 font-mono tracking-widest uppercase">{pairing.heading}</p>
                </div>

                <div className="group/item">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-rose-400">正文推荐</label>
                    <button 
                      onClick={() => handleImport(pairing.body, false)}
                      disabled={addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body)}
                      className="text-[13px] font-bold text-rose-400 hover:text-rose-300 disabled:text-green-400 flex items-center gap-1 transition-all"
                    >
                      {addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body) ? <Check size={14} /> : <Plus size={14} />}
                      {addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body) ? '已收录' : '库中保存'}
                    </button>
                  </div>
                  <p 
                    style={{ fontFamily: `"${pairing.body}", sans-serif` }}
                    className="text-[14px] leading-relaxed text-white/80 group-hover/item:translate-x-1 transition-transform"
                  >
                    通过精准的字重平衡和行间距调优，即使在移动端阅读也能享受极佳的舒适感。
                  </p>
                  <p className="text-[13px] text-white/30 font-mono tracking-widest uppercase mt-2">{pairing.body}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-[10px] p-5 space-y-4 border border-white/5">
                <div>
                  <h4 className="text-[13px] font-bold text-rose-300 opacity-50 uppercase tracking-widest">氛围特征</h4>
                  <p className="text-[16px] font-bold text-white mt-1">{pairing.vibe}</p>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-rose-300 opacity-50 uppercase tracking-widest">推荐逻辑</h4>
                  <p className="text-[13px] text-white/70 italic leading-relaxed mt-2 border-l border-rose-500/30 pl-3">“{pairing.reason}”</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIPairing;
