
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
    // Fix: changed setAddedFamilies to setAddedFonts to match the state setter defined above
    setAddedFonts(prev => [...prev, family]);
  };

  return (
    <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl overflow-hidden relative min-h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
        <Sparkles size={350} strokeWidth={1} />
      </div>

      <div className="relative z-10 w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Sparkles className="text-blue-400" size={28} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">AI 智能搭配顾问</h2>
        </div>
        <p className="text-blue-100/70 mb-10 text-xl leading-relaxed">
          告诉我们您的项目愿景，AI 将为您精准匹配极致的文字组合方案。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述项目愿景，如：极简现代摄影集"
            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-black rounded-2xl px-10 py-4 text-base transition-all flex items-center justify-center gap-3 whitespace-nowrap shadow-xl active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : '探索无限可能'}
          </button>
        </div>

        {pairing && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 bg-white/10 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-10">
                <div className="relative group/font">
                  <div className="flex justify-between items-start mb-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 opacity-60">标题推荐 / Headline</label>
                    <button 
                      onClick={() => handleImport(pairing.heading, true)}
                      disabled={addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/20 transition-all flex items-center gap-2 text-xs font-black"
                    >
                      {addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading) ? <Check size={14} className="text-green-400" /> : <Plus size={14} />}
                      {addedFonts.includes(pairing.heading) || existingFontFamilies.includes(pairing.heading) ? '已收藏' : '加入库'}
                    </button>
                  </div>
                  <p 
                    style={{ fontFamily: `"${pairing.heading}", serif` }}
                    className="text-5xl md:text-6xl font-medium leading-none mb-2"
                  >
                    视觉焦点
                  </p>
                  <p className="text-sm text-white/40 font-mono tracking-widest uppercase">{pairing.heading}</p>
                </div>

                <div className="relative group/font">
                  <div className="flex justify-between items-start mb-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 opacity-60">正文推荐 / Body</label>
                    <button 
                      onClick={() => handleImport(pairing.body, false)}
                      disabled={addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/20 transition-all flex items-center gap-2 text-xs font-black"
                    >
                      {addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body) ? <Check size={14} className="text-green-400" /> : <Plus size={14} />}
                      {addedFonts.includes(pairing.body) || existingFontFamilies.includes(pairing.body) ? '已收藏' : '加入库'}
                    </button>
                  </div>
                  <p 
                    style={{ fontFamily: `"${pairing.body}", sans-serif` }}
                    className="text-lg leading-relaxed text-white/80 font-medium"
                  >
                    通过精准的字重平衡和行间距调优，即使在移动端阅读也能享受极佳的舒适感。
                  </p>
                  <p className="text-sm text-white/40 font-mono tracking-widest uppercase mt-3">{pairing.body}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/5 flex flex-col justify-center space-y-8">
                <div>
                  <h4 className="text-xs font-black text-blue-300 mb-2 uppercase tracking-widest opacity-50">设计调性 / VIBE</h4>
                  <p className="text-2xl font-black border-l-4 border-blue-500 pl-4 text-white">{pairing.vibe}</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-300 mb-2 uppercase tracking-widest opacity-50">推荐逻辑 / REASON</h4>
                  <p className="text-base text-white/70 italic leading-relaxed font-medium">“{pairing.reason}”</p>
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
