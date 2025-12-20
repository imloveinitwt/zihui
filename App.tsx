
// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Type, List, Heart, X, Maximize2, RefreshCw, Layers, Database, LogOut, User as UserIcon, Columns2, Columns3, Columns4, Rows, Sun, Moon, Sparkles, Feather, Box, Palette, Terminal, Edit3, GripVertical, Filter, ArrowUpDown, ChevronDown, ChevronUp, Check, Scale, BookOpen, Github, Twitter, Dribbble, Globe, Shield, ExternalLink, Zap, ArrowUp, Mail, Send, Activity, BarChart3, Clock, HelpCircle, FileText, Code2, Users, Download, ShieldCheck, HeartHandshake, Info, MessageSquare, TrendingUp, Menu, ChevronRight, LayoutGrid } from 'lucide-react';
import { Font, Category, User } from './types';
import { MOCK_FONTS } from './constants';
import { dbService } from './services/dbService';
import FontCard from './components/FontCard';
import AIPairing from './components/AIPairing';
import FontInspiration from './components/FontInspiration';
import FontDetailsModal from './components/FontDetailsModal';
import LoginModal from './components/LoginModal';
import FontComparisonModal from './components/FontComparisonModal';
import PreviewTemplates from './components/PreviewTemplates';
import HelpCenterModal from './components/HelpCenterModal';
import TypographyLabModal from './components/TypographyLabModal';
import FeedbackModal from './components/FeedbackModal';
import AboutTeamModal from './components/AboutTeamModal';
import SponsorModal from './components/SponsorModal';
import LegalModal, { LegalType } from './components/LegalModal';
import HandbookModal from './components/HandbookModal';
import SiteMapModal from './components/SiteMapModal';
import BrandAssetsModal from './components/BrandAssetsModal';
import TypographyTrendsModal from './components/TypographyTrendsModal';
import ContributionModal from './components/ContributionModal';
import FontDatabaseModal from './components/FontDatabaseModal';
import DownloadContactModal from './components/DownloadContactModal';

type AppStyle = 'classic' | 'midnight' | 'frosted' | 'nostalgic';
type SortOption = 'default' | 'alphabetical' | 'newest' | 'variants';

const STYLE_CONFIG: Record<AppStyle, { body: string, nav: string, text: string, input: string, label: string, accent: string, footer: string, footerSub: string, glass: string }> = {
  'classic': {
    body: 'bg-slate-50',
    nav: 'bg-white/85 border-slate-200',
    text: 'text-slate-900',
    input: 'bg-white border-slate-200',
    label: '经典蓝',
    accent: 'bg-indigo-600',
    footer: 'bg-white border-t border-slate-200',
    footerSub: 'text-slate-500',
    glass: 'bg-white/70 backdrop-blur-xl border-white/20'
  },
  'midnight': {
    body: 'bg-slate-950',
    nav: 'bg-slate-900/85 border-slate-800',
    text: 'text-slate-50',
    input: 'bg-slate-800 border-slate-700',
    label: '深邃黑',
    accent: 'bg-indigo-500',
    footer: 'bg-slate-900/50 border-t border-slate-800',
    footerSub: 'text-slate-400',
    glass: 'bg-slate-900/70 backdrop-blur-xl border-white/10'
  },
  'frosted': {
    body: 'bg-indigo-50/20',
    nav: 'bg-white/75 border-indigo-100',
    text: 'text-indigo-950',
    input: 'bg-white border-indigo-100',
    label: '幻境蓝',
    accent: 'bg-indigo-600',
    footer: 'bg-white/70 border-t border-indigo-100',
    footerSub: 'text-indigo-600/60',
    glass: 'bg-white/40 backdrop-blur-xl border-white/40'
  },
  'nostalgic': {
    body: 'bg-[#F4F1EA]',
    nav: 'bg-[#EAE6D9]/85 border-[#D8D2C2]',
    text: 'text-[#4A453A]',
    input: 'bg-white/50 border-[#D8D2C2]',
    label: '复古色',
    accent: 'bg-[#8B7E66]',
    footer: 'bg-[#EAE6D9]/50 border-t border-[#D8D2C2]',
    footerSub: 'text-[#8B7E66]/80',
    glass: 'bg-[#EAE6D9]/60 backdrop-blur-xl border-white/10'
  }
};

const CATEGORY_LABELS: Record<string, { label: string, icon: React.ReactNode }> = {
  'All': { label: '全部', icon: <Layers size={14} /> },
  'sans-serif': { label: '无衬线', icon: <Box size={14} /> },
  'serif': { label: '衬线', icon: <Feather size={14} /> },
  'display': { label: '展示', icon: <Palette size={14} /> },
  'handwriting': { label: '手写', icon: <Edit3 size={14} /> },
  'monospace': { label: '等宽', icon: <Terminal size={14} /> }
};

const App: React.FC = () => {
  const [appStyle, setAppStyle] = useState<AppStyle>(() => (localStorage.getItem('fc_app_style') as AppStyle) || 'classic');
  const [gridCols, setGridCols] = useState<number>(3);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(true);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fc_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  
  const [fonts, setFonts] = useState<Font[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Font[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(36);
  const [previewText, setPreviewText] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedSubset, setSelectedSubset] = useState('All');
  const [selectedLicense, setSelectedLicense] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isTypographyLabOpen, setIsTypographyLabOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAboutTeamOpen, setIsAboutTeamOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
  const [isBrandAssetsOpen, setIsBrandAssetsOpen] = useState(false);
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isDownloadContactOpen, setIsDownloadContactOpen] = useState(false);

  const [handbookInitialSection, setHandbookInitialSection] = useState('getting-started');
  const [legalType, setLegalType] = useState<LegalType>('privacy');
  const [selectedFontForDetails, setSelectedFontForDetails] = useState<Font | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'danger' } | null>(null);
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');

  const styleConfig = STYLE_CONFIG[appStyle];

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getAllFonts();
      setFonts(data);
    };
    fetch();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('fc_app_style', appStyle);
  }, [appStyle]);

  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadRequest = () => {
    setIsDownloadContactOpen(true);
  };

  const filteredFonts = useMemo(() => {
    let result = fonts.filter(font => {
      const matchesSearch = (font.family + (font.chineseName || '')).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
      const matchesFavorite = !showOnlyFavorites || favorites.includes(font.family);
      const matchesSubset = selectedSubset === 'All' || font.subsets.includes(selectedSubset);
      const matchesLicense = selectedLicense === 'All' || (font.license && font.license.includes(selectedLicense));
      return matchesSearch && matchesCategory && matchesFavorite && matchesSubset && matchesLicense;
    });

    if (sortBy === 'alphabetical') {
      result = [...result].sort((a, b) => a.family.localeCompare(b.family, 'zh'));
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    } else if (sortBy === 'variants') {
      result = [...result].sort((a, b) => b.variants.length - a.variants.length);
    }

    return result;
  }, [searchTerm, selectedCategory, selectedSubset, selectedLicense, sortBy, showOnlyFavorites, favorites, fonts]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('default');
    setPreviewText('');
  };

  const handleToggleCompare = (font: Font) => {
    const exists = compareList.find(f => f.family === font.family);
    if (exists) {
      setCompareList(prev => prev.filter(f => f.family !== font.family));
    } else {
      if (compareList.length >= 3) {
        showToast("最多对比 3 个字体", "danger");
        return;
      }
      setCompareList(prev => [...prev, font]);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSiteMapNavigation = (action: string, params?: any) => {
    switch (action) {
      case 'filter-category': setSelectedCategory(params); scrollToTop(); break;
      case 'sort-newest': setSortBy('newest'); scrollToTop(); break;
      case 'open-lab': setIsTypographyLabOpen(true); break;
      case 'toggle-favorites': setShowOnlyFavorites(true); scrollToTop(); break;
      case 'open-handbook': setHandbookInitialSection(params); setIsHandbookOpen(true); break;
      case 'open-help': setIsHelpCenterOpen(true); break;
      case 'open-feedback': setIsFeedbackOpen(true); break;
      case 'open-about': setIsAboutTeamOpen(true); break;
      case 'open-trends': setIsTrendsOpen(true); break;
      case 'open-database': setIsDatabaseOpen(true); break;
    }
  };

  const getGridClasses = () => {
    switch (gridCols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 3:
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${styleConfig.body} ${styleConfig.text}`}>
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3 font-bold text-[13px] bg-indigo-600 text-white">
          <Info size={16} /> {toast.message}
        </div>
      )}

      <div className="fixed left-6 bottom-32 z-[80] hidden xl:flex flex-col gap-3">
         {[
           { icon: <Terminal size={20}/>, label: '实验室', action: () => setIsTypographyLabOpen(true) },
           { icon: <Database size={20}/>, label: '数据库', action: () => setIsDatabaseOpen(true) },
           { icon: <TrendingUp size={20}/>, label: '趋势', action: () => setIsTrendsOpen(true) },
           { icon: <HelpCircle size={20}/>, label: '帮助', action: () => setIsHelpCenterOpen(true) }
         ].map((tool, i) => (
           <button 
             key={i} onClick={tool.action}
             className={`w-12 h-12 ${styleConfig.glass} border rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative shadow-lg`}
           >
             <span className="absolute left-14 px-3 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
               {tool.label}
             </span>
             {tool.icon}
           </button>
         ))}
      </div>

      <header className={`sticky top-0 z-[100] border-b backdrop-blur-xl transition-all h-16 flex items-center px-4 sm:px-6 ${styleConfig.nav} ring-1 ring-black/5`}>
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
            <div className="w-8 h-8 bg-indigo-600 rounded-[10px] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Type size={18} />
            </div>
            <span className="text-[18px] font-black tracking-tight">字绘.Lab</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsDiscoveryOpen(!isDiscoveryOpen)} className={`p-2 rounded-xl transition-all ${isDiscoveryOpen ? 'bg-indigo-600 text-white shadow-md' : 'opacity-40 hover:opacity-100'}`} title="发现中心">
              <Sparkles size={20} />
            </button>
            <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)} className={`p-2 transition-all active:scale-90 ${showOnlyFavorites ? 'text-rose-600' : 'opacity-40 hover:opacity-100'}`} title="收藏夹">
              <Heart size={20} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
            </button>
            <div className="w-px h-4 bg-current/10" />
            <button onClick={() => setIsSiteMapOpen(true)} className="p-2 opacity-40 hover:opacity-100 transition-all"><Menu size={20} /></button>
            {currentUser ? (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[13px] shadow-sm ml-1">
                {currentUser.username[0].toUpperCase()}
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95 ml-1">
                登录
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-grow space-y-8">
        {!showOnlyFavorites && (
          <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDiscoveryOpen ? 'grid-rows-[1fr] mb-12 opacity-100' : 'grid-rows-[0fr] mb-0 opacity-0 pointer-events-none'}`}>
            <div className="overflow-hidden">
               <div className="space-y-6 pt-2 pb-6">
                  <div className="flex items-center justify-between">
                      <h2 className="text-[14px] font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                        <Sparkles size={16} /> 灵感发现中心
                      </h2>
                      <button onClick={() => setIsDiscoveryOpen(false)} className="text-[11px] font-bold opacity-30 hover:opacity-100 flex items-center gap-1 transition-colors">
                        收起面板 <ChevronUp size={14} />
                      </button>
                  </div>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-transform duration-700 ${isDiscoveryOpen ? 'translate-y-0' : '-translate-y-4'}`}>
                      <AIPairing onImportFont={(f) => setFonts(prev => [...prev, f])} existingFontFamilies={fonts.map(f => f.family)} />
                      <FontInspiration theme={appStyle} onImportFont={(f) => setFonts(prev => [...prev, f])} existingFontFamilies={fonts.map(f => f.family)} />
                  </div>
               </div>
            </div>
          </div>
        )}

        <div className="sticky top-[72px] z-50 space-y-4">
          <div className={`${styleConfig.glass} border border-slate-200/50 rounded-2xl p-3 shadow-2xl flex flex-col xl:flex-row items-center gap-3`}>
            <div className="relative w-full xl:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="text" placeholder="搜索字体..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${styleConfig.input} bg-slate-50/50 rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
              />
            </div>
            
            <div className="relative flex-grow w-full">
               <Type className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
               <input 
                 type="text" placeholder="输入预览文字..." value={previewText} onChange={(e) => setPreviewText(e.target.value)}
                 className={`w-full ${styleConfig.input} bg-slate-50/50 rounded-xl pl-10 pr-12 py-2.5 text-[14px] outline-none transition-all`}
               />
               <button onClick={() => setShowTemplates(!showTemplates)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${showTemplates ? 'bg-indigo-600 text-white' : 'opacity-40 hover:opacity-100'}`}>
                 <BookOpen size={16} />
               </button>
            </div>

            <div className="flex w-full xl:w-auto items-center gap-2">
               <div className={`flex items-center gap-3 px-4 py-2 bg-slate-50/50 rounded-xl border border-transparent`}>
                  <Maximize2 size={14} className="opacity-30" />
                  <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <span className="text-[11px] font-mono font-bold text-indigo-600 w-6 text-right">{fontSize}</span>
               </div>

               <div className="flex bg-slate-50/50 p-1 rounded-xl border border-slate-200/50 items-center">
                  <button 
                    onClick={() => setGridCols(1)} 
                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${gridCols === 1 ? 'bg-white shadow-sm text-indigo-600' : 'opacity-30 hover:opacity-100'}`}
                    title="一列布局"
                  >
                    <Rows size={16}/>
                  </button>
                  <button 
                    onClick={() => setGridCols(2)} 
                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${gridCols === 2 ? 'bg-white shadow-sm text-indigo-600' : 'opacity-30 hover:opacity-100'}`}
                    title="二列布局"
                  >
                    <Columns2 size={16}/>
                  </button>
                  <button 
                    onClick={() => setGridCols(3)} 
                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${gridCols === 3 ? 'bg-white shadow-sm text-indigo-600' : 'opacity-30 hover:opacity-100'}`}
                    title="三列布局"
                  >
                    <Columns3 size={16}/>
                  </button>
                  <button 
                    onClick={() => setGridCols(4)} 
                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${gridCols === 4 ? 'bg-white shadow-sm text-indigo-600' : 'opacity-30 hover:opacity-100'}`}
                    title="四列布局"
                  >
                    <Columns4 size={16}/>
                  </button>
               </div>

               <button onClick={handleResetFilters} className="p-2.5 opacity-30 hover:opacity-100 hover:rotate-180 transition-all"><RefreshCw size={18} /></button>
            </div>
          </div>

          {showTemplates && (
            <PreviewTemplates theme={appStyle} onSelect={(content) => {setPreviewText(content); setShowTemplates(false);}} currentContent={previewText} />
          )}
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1 flex-grow">
              {Object.keys(CATEGORY_LABELS).map(cat => (
                <button
                  key={cat} onClick={() => setSelectedCategory(cat as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[13px] font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white/80 border-slate-200/50 opacity-60 hover:opacity-100'}`}
                >
                  {CATEGORY_LABELS[cat].icon} {CATEGORY_LABELS[cat].label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-900/5 text-[11px] font-black uppercase tracking-widest opacity-30">
              <BarChart3 size={12} /> {filteredFonts.length} 款可用
            </div>
          </div>
        </div>

        <div className={`grid gap-6 transition-all duration-500 ${getGridClasses()}`}>
          {filteredFonts.map((font) => (
            <FontCard 
              key={font.family} font={font} theme={appStyle} previewText={previewText} fontSize={fontSize} 
              onShowDetails={setSelectedFontForDetails} isFavorite={favorites.includes(font.family)}
              onToggleFavorite={(f) => setFavorites(prev => prev.includes(f.family) ? prev.filter(id => id !== f.family) : [...prev, f.family])}
              isComparing={!!compareList.find(f => f.family === font.family)} onToggleCompare={() => handleToggleCompare(font)}
              onDownloadRequest={handleDownloadRequest}
            />
          ))}
          {filteredFonts.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-20">
              <Search size={64} strokeWidth={1} />
              <p className="mt-4 text-[16px] font-black tracking-tight uppercase tracking-[0.3em]">No results found</p>
            </div>
          )}
        </div>
      </main>

      <footer className={`${styleConfig.footer} pt-16 pb-8 px-4 sm:px-6 mt-10 transition-all duration-500`}>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Type size={18} /></div>
                 <span className="text-[20px] font-black tracking-tighter">字绘.Lab</span>
               </div>
               <p className="text-[13px] leading-relaxed opacity-60 max-w-sm">
                 开源字体设计的先锋阵地。连接全球创作者，让文字在数字时代焕发全新的排版生命力。
               </p>
               <div className="flex gap-4">
                  {[Twitter, Dribbble, Github, Mail].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-xl border border-current/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all active:scale-90"><Icon size={18}/></button>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest opacity-30">实验室</h4>
                  <ul className="space-y-3 text-[13px] font-bold opacity-60">
                    <li><button onClick={() => setIsTypographyLabOpen(true)} className="hover:text-indigo-600">排版实验室</button></li>
                    <li><button onClick={() => setIsDatabaseOpen(true)} className="hover:text-indigo-600">全量数据库</button></li>
                    <li><button onClick={() => setIsTrendsOpen(true)} className="hover:text-indigo-600">趋势报告</button></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest opacity-30">资源</h4>
                  <ul className="space-y-3 text-[13px] font-bold opacity-60">
                    <li><button onClick={() => handleSiteMapNavigation('open-handbook', 'os-install')} className="hover:text-indigo-600">安装指南</button></li>
                    <li><button onClick={() => setIsBrandAssetsOpen(true)} className="hover:text-indigo-600">品牌资产</button></li>
                    <li><button onClick={() => handleSiteMapNavigation('open-handbook', 'developer')} className="hover:text-indigo-600">开发者 API</button></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest opacity-30">支持</h4>
                  <ul className="space-y-3 text-[13px] font-bold opacity-60">
                    <li><button onClick={() => setIsHelpCenterOpen(true)} className="hover:text-indigo-600">帮助中心</button></li>
                    <li><button onClick={() => setIsFeedbackOpen(true)} className="hover:text-indigo-600">意见反馈</button></li>
                    <li><button onClick={() => setIsSponsorOpen(true)} className="hover:text-indigo-600">赞助支持</button></li>
                  </ul>
               </div>
            </div>
        </div>
        <div className="max-w-[1440px] mx-auto pt-8 border-t border-current/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-black opacity-30 uppercase tracking-[0.2em]">
           <span>&copy; 2025 字绘实验室 • FontCanvas Studio</span>
           <div className="flex gap-6 mt-4 sm:mt-0">
              <button onClick={() => { setLegalType('privacy'); setIsLegalOpen(true); }}>隐私保护</button>
              <button onClick={() => { setLegalType('terms'); setIsLegalOpen(true); }}>服务条款</button>
              <button onClick={() => setIsSiteMapOpen(true)}>站点地图</button>
           </div>
        </div>
      </footer>

      {showBackToTop && (
        <button onClick={scrollToTop} className={`fixed bottom-10 right-10 w-14 h-14 ${styleConfig.glass} border rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-[80] active:scale-90 animate-in fade-in zoom-in duration-300`}>
          <ArrowUp size={24} />
        </button>
      )}

      <div className="fixed bottom-10 right-28 sm:right-32 z-[80] flex flex-col items-end gap-3">
        <button onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 active:scale-90 ${isStyleMenuOpen ? 'bg-slate-900 border-slate-800 text-white' : 'bg-indigo-600 border-indigo-500 text-white'}`}>
          <Palette size={20} />
        </button>
        {isStyleMenuOpen && (
          <div className={`flex flex-col gap-2 p-2 rounded-2xl ${styleConfig.glass} border shadow-2xl animate-in slide-in-from-bottom-4 duration-300`}>
            {(Object.keys(STYLE_CONFIG) as AppStyle[]).map(s => (
              <button
                key={s} onClick={() => { setAppStyle(s); setIsStyleMenuOpen(false); }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${appStyle === s ? 'bg-indigo-600 text-white' : 'hover:bg-current/5'}`}
              >
                {s === 'classic' && <Sun size={16} />}
                {s === 'midnight' && <Moon size={16} />}
                {s === 'frosted' && <Sparkles size={16} />}
                {s === 'nostalgic' && <Feather size={16} />}
                {STYLE_CONFIG[s].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedFontForDetails && <FontDetailsModal font={selectedFontForDetails} onClose={() => setSelectedFontForDetails(null)} previewText={previewText} isFavorite={favorites.includes(selectedFontForDetails.family)} onToggleFavorite={(f) => setFavorites(prev => prev.includes(f.family) ? prev.filter(id => id !== f.family) : [...prev, f.family])} onDownloadRequest={handleDownloadRequest} />}
      {isCompareModalOpen && <FontComparisonModal fonts={compareList} onClose={() => setIsCompareModalOpen(false)} onRemove={(f) => handleToggleCompare(f)} previewText={previewText} onDownloadRequest={handleDownloadRequest} />}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={(u) => {setCurrentUser(u); setIsLoginModalOpen(false);}} />
      <HelpCenterModal isOpen={isHelpCenterOpen} onClose={() => setIsHelpCenterOpen(false)} theme={appStyle} />
      <TypographyLabModal isOpen={isTypographyLabOpen} onClose={() => setIsTypographyLabOpen(false)} fonts={fonts} theme={appStyle} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} theme={appStyle} />
      <AboutTeamModal isOpen={isAboutTeamOpen} onClose={() => setIsAboutTeamOpen(false)} theme={appStyle} />
      <SponsorModal isOpen={isSponsorOpen} onClose={() => setIsSponsorOpen(false)} theme={appStyle} />
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} type={legalType} theme={appStyle} />
      <HandbookModal isOpen={isHandbookOpen} onClose={() => setIsHandbookOpen(false)} theme={appStyle} initialSection={handbookInitialSection} />
      <SiteMapModal isOpen={isSiteMapOpen} onClose={() => setIsSiteMapOpen(false)} theme={appStyle} onNavigate={handleSiteMapNavigation} />
      <BrandAssetsModal isOpen={isBrandAssetsOpen} onClose={() => setIsBrandAssetsOpen(false)} theme={appStyle} />
      <TypographyTrendsModal isOpen={isTrendsOpen} onClose={() => setIsTrendsOpen(false)} theme={appStyle} />
      <ContributionModal isOpen={isContributionOpen} onClose={() => setIsContributionOpen(false)} theme={appStyle} />
      <FontDatabaseModal isOpen={isDatabaseOpen} onClose={() => setIsDatabaseOpen(false)} fonts={fonts} theme={appStyle} onDownloadRequest={handleDownloadRequest} />
      <DownloadContactModal isOpen={isDownloadContactOpen} onClose={() => setIsDownloadContactOpen(false)} theme={appStyle} />
    </div>
  );
};

export default App;
