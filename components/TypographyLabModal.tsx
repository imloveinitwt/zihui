
import React, { useState, useEffect } from 'react';
import { X, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Maximize2, MoveHorizontal, MoveVertical, RotateCcw, Copy, Check, Layout, Square, CreditCard, FileText, Palette, Layers, Terminal } from 'lucide-react';
import { Font } from '../types';

interface TypographyLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  fonts: Font[];
  theme?: string;
}

const PRESETS = [
  { id: 'article', label: '长文阅读', icon: <FileText size={16} />, styles: { fontSize: 18, lineHeight: 1.8, letterSpacing: 0.5, textAlign: 'justify' } },
  { id: 'headline', label: '醒目标题', icon: <Layout size={16} />, styles: { fontSize: 72, lineHeight: 1.1, letterSpacing: -2, textAlign: 'center' } },
  { id: 'card', label: '名片信息', icon: <CreditCard size={16} />, styles: { fontSize: 24, lineHeight: 1.4, letterSpacing: 2, textAlign: 'left' } },
  { id: 'poster', label: '海报构图', icon: <Square size={16} />, styles: { fontSize: 120, lineHeight: 0.9, letterSpacing: -5, textAlign: 'center' } },
];

const TypographyLabModal: React.FC<TypographyLabModalProps> = ({ isOpen, onClose, fonts, theme = 'classic' }) => {
  const [selectedFont, setSelectedFont] = useState<Font>(fonts[0] || {} as Font);
  const [text, setText] = useState('在排版的艺术中，间隙与笔画同样重要。\n文字不仅是信息的载体，更是设计的灵魂。');
  const [fontSize, setFontSize] = useState(48);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [writingMode, setWritingMode] = useState<'horizontal-tb' | 'vertical-rl'>('horizontal-tb');
  const [color, setColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFontSize(preset.styles.fontSize);
    setLineHeight(preset.styles.lineHeight);
    setLetterSpacing(preset.styles.letterSpacing);
    setTextAlign(preset.styles.textAlign as any);
  };

  const cssSnippet = `/* 字体排版代码片段 */
font-family: "${selectedFont.family}";
font-size: ${fontSize}px;
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
text-align: ${textAlign};
writing-mode: ${writingMode === 'horizontal-tb' ? '横向' : '纵向'};
color: ${color};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    sidebar: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200',
    input: isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900',
    controlLabel: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 block',
    accent: 'text-indigo-600 border-indigo-600 bg-indigo-50',
    accentDark: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10'
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full h-full rounded-[24px] shadow-2xl overflow-hidden flex flex-col lg:flex-row expand-enter ${themeClasses.modal}`}>
        
        {/* 控制面板 */}
        <div className={`w-full lg:w-[400px] flex flex-col border-r h-full overflow-y-auto no-scrollbar ${themeClasses.sidebar}`}>
          <div className="p-8 space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Terminal size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold">排版实验室</h2>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">排版引擎 2.0 版本</p>
                </div>
              </div>
            </div>

            {/* 预设 */}
            <div className="space-y-3">
              <span className={themeClasses.controlLabel}>快速预设</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-bold transition-all ${isDarkTheme ? 'bg-slate-950 border-slate-800 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <span className="opacity-40">{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 字体选择 */}
            <div className="space-y-3">
              <span className={themeClasses.controlLabel}>字体家族</span>
              <select 
                value={selectedFont.family} 
                onChange={(e) => setSelectedFont(fonts.find(f => f.family === e.target.value) || fonts[0])}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-500 transition-all font-bold text-[14px] ${themeClasses.input}`}
              >
                {fonts.map(f => (
                  <option key={f.family} value={f.family}>{f.chineseName || f.family}</option>
                ))}
              </select>
            </div>

            {/* 参数控制 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={themeClasses.controlLabel}>字号</span>
                  <span className="text-[12px] font-mono font-bold text-indigo-600">{fontSize}像素</span>
                </div>
                <input type="range" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={themeClasses.controlLabel}>行高</span>
                  <span className="text-[12px] font-mono font-bold text-indigo-600">{lineHeight}倍</span>
                </div>
                <input type="range" min="0.8" max="3" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={themeClasses.controlLabel}>字间距</span>
                  <span className="text-[12px] font-mono font-bold text-indigo-600">{letterSpacing}像素</span>
                </div>
                <input type="range" min="-10" max="40" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className={themeClasses.controlLabel}>对齐方式</span>
                  <div className="flex gap-1">
                    {(['left', 'center', 'right', 'justify'] as const).map(align => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`p-2 flex-1 rounded-lg border transition-all ${textAlign === align ? (isDarkTheme ? themeClasses.accentDark : themeClasses.accent) : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
                      >
                        {align === 'left' && <AlignLeft size={16} className="mx-auto" />}
                        {align === 'center' && <AlignCenter size={16} className="mx-auto" />}
                        {align === 'right' && <AlignRight size={16} className="mx-auto" />}
                        {align === 'justify' && <AlignJustify size={16} className="mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <span className={themeClasses.controlLabel}>书写方向</span>
                  <div className="flex gap-1">
                    {(['horizontal-tb', 'vertical-rl'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setWritingMode(mode)}
                        className={`p-2 flex-1 rounded-lg border transition-all ${writingMode === mode ? (isDarkTheme ? themeClasses.accentDark : themeClasses.accent) : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
                      >
                        {mode === 'horizontal-tb' ? <MoveHorizontal size={16} className="mx-auto" /> : <MoveVertical size={16} className="mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className={themeClasses.controlLabel}>文字颜色</span>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                </div>
                <div className="space-y-2">
                  <span className={themeClasses.controlLabel}>背景颜色</span>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-none bg-transparent" />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-current/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className={themeClasses.controlLabel}>样式导出</span>
                <button onClick={copyToClipboard} className={`text-[11px] font-bold flex items-center gap-1 transition-all ${copied ? 'text-emerald-500' : 'text-indigo-600 hover:underline'}`}>
                  {copied ? <><Check size={12} /> 已复制</> : <><Copy size={12} /> 复制代码</>}
                </button>
              </div>
              <pre className={`p-4 rounded-xl text-[12px] font-mono leading-relaxed overflow-x-auto ${isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                {cssSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* 预览画布 */}
        <div className="flex-grow flex flex-col min-w-0 h-full">
          <header className={`p-6 border-b flex items-center justify-between shrink-0 ${isDarkTheme ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-4">
               <button onClick={() => { setFontSize(48); setLineHeight(1.4); setLetterSpacing(0); setTextAlign('center'); setWritingMode('horizontal-tb'); setColor('#0f172a'); setBgColor('#ffffff'); }} className="flex items-center gap-2 text-[12px] font-bold opacity-40 hover:opacity-100 transition-opacity">
                 <RotateCcw size={14} /> 重置实验台
               </button>
            </div>
            <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
              <X size={24} />
            </button>
          </header>

          <div 
            className="flex-grow relative flex items-center justify-center p-12 transition-colors duration-500 overflow-hidden" 
            style={{ backgroundColor: bgColor }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="absolute inset-0 w-full h-full bg-transparent p-20 resize-none outline-none custom-scrollbar"
              style={{
                fontFamily: `"${selectedFont.family}", sans-serif`,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                textAlign: textAlign,
                writingMode: writingMode,
                color: color,
                border: 'none',
              }}
              placeholder="在此输入预览文字..."
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid grid-cols-12 gap-0">
               {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-current" />)}
            </div>
          </div>

          <div className={`p-4 shrink-0 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 ${isDarkTheme ? 'bg-slate-900' : 'bg-slate-50'}`}>
             <span>精密布局画布</span>
             <div className="w-1 h-1 rounded-full bg-current" />
             <span>硬件加速实时渲染</span>
             <div className="w-1 h-1 rounded-full bg-current" />
             <span>全平台排版一致性测试</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyLabModal;
