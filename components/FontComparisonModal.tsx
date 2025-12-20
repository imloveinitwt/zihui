
import React, { useState, useEffect } from 'react';
import { Font } from '../types';
import { X, Type, Maximize2, Trash2, Download, Hash, Sparkles } from 'lucide-react';

interface Props {
  fonts: Font[];
  onClose: () => void;
  onRemove: (font: Font) => void;
  previewText: string;
  onDownloadRequest?: () => void;
}

const FontComparisonModal: React.FC<Props> = ({ fonts, onClose, onRemove, previewText: initialPreview, onDownloadRequest }) => {
  const [comparisonText, setComparisonText] = useState(initialPreview || "文字排版之美，始于细节。");
  const [compFontSize, setCompFontSize] = useState(48);
  // 为每个字体家族独立存储选中的字重
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // 当 fonts 改变时，确保每个字体都有一个默认选中的字重
  useEffect(() => {
    setSelectedVariants(prev => {
      const next = { ...prev };
      fonts.forEach(f => {
        if (!next[f.family]) {
          next[f.family] = f.variants.includes('400') ? '400' : f.variants[0];
        }
      });
      return next;
    });
  }, [fonts]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-7xl max-h-[95vh] rounded-[10px] shadow-2xl flex flex-col overflow-hidden expand-enter">
        {/* Header */}
        <div className="px-8 h-20 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-4 flex-grow">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] flex-grow max-w-md">
              <Type size={16} className="text-slate-400" />
              <input 
                type="text" 
                value={comparisonText} 
                onChange={(e) => setComparisonText(e.target.value)}
                placeholder="输入自定义对比文本..."
                className="bg-transparent border-none outline-none text-[14px] font-medium w-full text-slate-800"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px]">
              <Maximize2 size={16} className="text-slate-400" />
              <input 
                type="range" min="16" max="120" value={compFontSize} 
                onChange={(e) => setCompFontSize(Number(e.target.value))}
                className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[13px] font-mono font-bold text-indigo-600 w-8 text-right">{compFontSize}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all ml-4">
            <X size={24} />
          </button>
        </div>

        {/* Comparison Area */}
        <div className="flex-grow overflow-x-auto overflow-y-auto flex custom-scrollbar bg-slate-50">
          <div className="flex min-w-full divide-x divide-slate-200">
            {fonts.map((font) => {
              const isChinese = font.subsets.includes('chinese-simplified');
              const accentColor = isChinese ? 'text-rose-600' : 'text-indigo-600';
              const accentBg = isChinese ? 'bg-rose-50' : 'bg-indigo-50';
              const selectedVariant = selectedVariants[font.family] || (font.variants.includes('400') ? '400' : font.variants[0]);

              return (
                <div key={font.family} className="flex-1 min-w-[400px] flex flex-col bg-white">
                  <div className="p-8 border-b border-slate-100 space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className={`text-[20px] font-bold leading-tight ${accentColor}`}>
                          {font.chineseName || font.family}
                        </h3>
                        <p className="text-[12px] font-mono text-slate-400 uppercase tracking-[0.2em]">{font.family}</p>
                      </div>
                      <button 
                        onClick={() => onRemove(font)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-all"
                        title="移除此字体"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* 字重切换预览控制器 */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">选择字重 / VARIANTS</label>
                      <div className="flex flex-wrap gap-1.5">
                        {font.variants.map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVariants(prev => ({ ...prev, [font.family]: v }))}
                            className={`px-3 py-1 rounded-md text-[11px] font-bold border transition-all active:scale-90 ${
                              selectedVariant === v 
                                ? `${isChinese ? 'bg-rose-600 border-rose-600 shadow-rose-200' : 'bg-indigo-600 border-indigo-600 shadow-indigo-200'} text-white shadow-lg` 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {v === '400' ? 'Regular' : v === '700' ? 'Bold' : v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 核心预览区 */}
                  <div className="flex-grow p-8 flex items-center justify-center min-h-[440px] bg-slate-50/20">
                    <p 
                      style={{ 
                        fontFamily: `"${font.family}", sans-serif`, 
                        fontSize: `${compFontSize}px`,
                        fontWeight: selectedVariant.includes('italic') ? selectedVariant.replace('italic', '') : selectedVariant,
                        fontStyle: selectedVariant.includes('italic') ? 'italic' : 'normal',
                        lineHeight: 1.15
                      }}
                      className="text-center text-slate-900 break-words w-full selection:bg-rose-100"
                    >
                      {comparisonText}
                    </p>
                  </div>

                  <div className="p-8 border-t border-slate-100 space-y-6 bg-slate-50/50">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={14} className="opacity-50" /> 风格特点
                      </label>
                      <p className={`text-[14px] text-slate-600 leading-relaxed italic border-l-2 ${isChinese ? 'border-rose-200' : 'border-indigo-200'} pl-4`}>
                        {font.features || "尚未录入具体风格描述。这款字体通过对空间与比例的精准把控，旨在创造一种独特的阅读体验。"}
                      </p>
                    </div>
                    <button 
                      onClick={() => onDownloadRequest?.()}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-[12px] font-bold text-[14px] text-white shadow-xl transition-all active:scale-[0.98] ${isChinese ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-200' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200'}`}
                    >
                      <Download size={18} /> 下载该家族
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="h-14 flex items-center justify-center bg-slate-900 text-slate-400 gap-3 shrink-0">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span className="text-[12px] font-black uppercase tracking-[0.2em]">
            字绘实验室 • 多维度实时对比模式 ({fonts.length} 款参与)
          </span>
        </div>
      </div>
    </div>
  );
};

export default FontComparisonModal;
