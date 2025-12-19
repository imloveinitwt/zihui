
import React, { useState } from 'react';
import { PREVIEW_TEMPLATES, PreviewTemplate } from '../constants/templates';
import { Sparkles, Type, Quote, Layout, Globe, Hash } from 'lucide-react';

interface Props {
  onSelect: (content: string) => void;
  currentContent: string;
  theme?: string;
}

const CATEGORIES = [
  { id: 'all', label: '全部', icon: <Sparkles size={14} /> },
  { id: 'humanities', label: '人文', icon: <Quote size={14} /> },
  { id: 'commercial', label: '品牌', icon: <Layout size={14} /> },
  { id: 'english', label: '西文', icon: <Globe size={14} /> },
  { id: 'functional', label: '功能', icon: <Hash size={14} /> },
];

const PreviewTemplates: React.FC<Props> = ({ onSelect, currentContent, theme = 'classic' }) => {
  const [activeCat, setActiveCat] = useState('all');
  const isDarkTheme = theme === 'midnight';

  const filteredTemplates = activeCat === 'all' 
    ? PREVIEW_TEMPLATES 
    : PREVIEW_TEMPLATES.filter(t => t.category === activeCat);

  const themeClasses = {
    bg: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100',
    tabActive: isDarkTheme ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white',
    tabInactive: isDarkTheme ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600',
    chip: isDarkTheme ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300',
    chipActive: isDarkTheme ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-indigo-600 text-indigo-700 bg-indigo-50',
  };

  return (
    <div className={`p-5 rounded-xl border ${themeClasses.bg} space-y-4 animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${
                activeCat === cat.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
        <button 
          onClick={() => onSelect('')}
          className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-tighter"
        >
          重置预览
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.content)}
            className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all active:scale-95 ${
              currentContent === template.content 
                ? themeClasses.chipActive 
                : themeClasses.chip
            }`}
          >
            {template.label}
          </button>
        ))}
        <button
          onClick={() => {
            const random = PREVIEW_TEMPLATES[Math.floor(Math.random() * PREVIEW_TEMPLATES.length)];
            onSelect(random.content);
          }}
          className={`px-3 py-1.5 rounded-lg border border-dashed border-indigo-300 text-indigo-600 text-[12px] font-bold hover:bg-indigo-50 transition-all flex items-center gap-1.5`}
        >
          <Sparkles size={12} /> 随机灵感
        </button>
      </div>
    </div>
  );
};

export default PreviewTemplates;
