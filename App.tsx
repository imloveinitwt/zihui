
// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Type, List, Heart, X, Maximize2, RefreshCw, Layers, Database, LogOut, User as UserIcon, Columns2, Columns3, Columns4, Sun, Moon, Sparkles, Feather, Box, Palette, Terminal, Edit3, GripVertical, Filter, ArrowUpDown, ChevronDown, ChevronUp, Check, Scale, BookOpen, Github, Twitter, Dribbble, Globe, Shield, ExternalLink, Zap, ArrowUp, Mail, Send, Activity, BarChart3, Clock, HelpCircle, FileText, Code2, Users, Download, ShieldCheck, HeartHandshake, Info, MessageSquare, TrendingUp } from 'lucide-react';
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
  'All': { label: '全部类型', icon: <Layers size={14} /> },
  'sans-serif': { label: '无衬线', icon: <Box size={14} /> },
  'serif': { label: '衬线体', icon: <Feather size={14} /> },
  'display': { label: '展示体', icon: <Palette size={14} /> },
  'handwriting': { label: '手写体', icon: <Edit3 size={14} /> },
  'monospace': { label: '等宽体', icon: <Terminal size={14} /> }
};

const App: React.FC = () => {
  const [appStyle, setAppStyle] = useState<AppStyle>(() => (localStorage.getItem('fc_app_style') as AppStyle) || 'classic');
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
  const [gridCols, setGridCols] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(36);
  const [previewText, setPreviewText] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedSubset, setSelectedSubset] = useState('All');
  const [selectedLicense, setSelectedLicense] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  
  // 模态框可见性状态
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

  const [handbookInitialSection, setHandbookInitialSection] = useState('getting-started');
  const [legalType, setLegalType] = useState<LegalType>('privacy');
  const [selectedFontForDetails, setSelectedFontForDetails] = useState<Font | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'danger' } | null>(null);
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [pingData, setPingData] = useState<number[]>(Array.from({length: 12}, () => Math.floor(Math.random() * 80) + 20));

  const aiPairingRef = useRef<HTMLDivElement>(null);
  const filterSectionRef = useRef<HTMLDivElement>(null);

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

    const pingInterval = setInterval(() => {
      setPingData(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 30]);
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(pingInterval);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
      result = [...result].sort((a, b) => a.family.localeCompare(b.family));
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
    setSelectedSubset('All');
    setSelectedLicense('All');
    setSortBy('default');
    setPreviewText('');
  };

  const handleToggleCompare = (font: Font) => {
    const exists = compareList.find(f => f.family === font.family);
    if (exists) {
      setCompareList(prev => prev.filter(f => f.family !== font.family));
      showToast(`已移除 ${font.chineseName || font.family}`, 'info');
    } else {
      if (compareList.length >= 3) {
        showToast("最多对比 3 个字体", "danger");
        return;
      }
      setCompareList(prev => [...prev, font]);
      showToast(`已添加 ${font.chineseName || font.family}`, 'success');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.includes('@')) {
      showToast("请输入有效的邮箱地址", "danger");
      return;
    }
    showToast("订阅成功！感谢关注字绘实验室周刊。", "success");
    setSubscriberEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAIPairing = () => {
    aiPairingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const applyFooterFilter = (cat: string, subset: string = 'All') => {
    setSelectedCategory(cat as any);
    setSelectedSubset(subset);
    setShowOnlyFavorites(false);
    scrollToTop();
    showToast(`分类已切换: ${subset !== 'All' ? subset : (cat === 'All' ? '全部' : CATEGORY_LABELS[cat]?.label || cat)}`, 'info');
  };

  const openLegal = (type: LegalType) => {
    setLegalType(type);
    setIsLegalOpen(true);
  };

  const openHandbook = (section: string = 'getting-started') => {
    setHandbookInitialSection(section);
    setIsHandbookOpen(true);
  };

  const handleSiteMapNavigation = (action: string, params?: any) => {
    switch (action) {
      case 'filter-category':
        applyFooterFilter(params);
        break;
      case 'sort-newest':
        setSortBy('newest');
        scrollToTop();
        break;
      case 'scroll-ai':
        scrollToAIPairing();
        break;
      case 'open-lab':
        setIsTypographyLabOpen(true);
        break;
      case 'toggle-favorites':
        setShowOnlyFavorites(true);
        scrollToTop();
        break;
      case 'open-handbook':
        openHandbook(params);
        break;
      case 'open-help':
        setIsHelpCenterOpen(true);
        break;
      case 'open-feedback':
        setIsFeedbackOpen(true);
        break;
      case 'open-about':
        setIsAboutTeamOpen(true);
        break;
      case 'open-sponsor':
        setIsSponsorOpen(true);
        break;
      case 'open-legal':
        openLegal(params);
        break;
      case 'open-trends':
        setIsTrendsOpen(true);
        break;
      case 'open-contribution':
        setIsContributionOpen(true);
        break;
      case 'open-database':
        setIsDatabaseOpen(true);
        break;
      default:
        showToast("无法识别的导航动作", "danger");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col ${styleConfig.body} ${styleConfig.text}`}>
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3 font-bold text-[14px] ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 
          toast.type === 'danger' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={18} /> : <Activity size={18} />}
          {toast.message}
        </div>
      )}

      {/* 顶部导航 */}
      <header className={`sticky top-0 z-[60] border-b backdrop-blur-xl transition-all h-16 flex items-center px-6 ${styleConfig.nav} ring-1 ring-black/5`}>
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={scrollToTop}>
            <div className="w-8 h-8 bg-indigo-600 rounded-[10px] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Type size={18} />
            </div>
            <span className="text-[18px] font-bold tracking-tight">字绘.Lab</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDatabaseOpen(true)}
              className="p-2 text-current opacity-60 hover:opacity-100 transition-all"
              title="全量数据库"
            >
              <Database size={20} />
            </button>
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)} 
              className={`p-2 transition-all ${showOnlyFavorites ? 'text-rose-600 scale-110' : 'text-current opacity-60 hover:opacity-100'}`}
              title="收藏夹"
            >
              <Heart size={20} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
            </button>
            <div className="w-px h-4 bg-current/10 mx-1" />
            {currentUser ? (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-[13px] shadow-sm" title={currentUser.username}>
                {currentUser.username[0].toUpperCase()}
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-[10px] text-[13px] font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95">
                登录
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-10 space-y-10 flex-grow">
        {!showOnlyFavorites && (
          <div ref={aiPairingRef} className="grid lg:grid-cols-2 gap-8">
            <AIPairing onImportFont={(f) => setFonts(prev => [...prev, f])} existingFontFamilies={fonts.map(f => f.family)} />
            <FontInspiration theme={appStyle} onImportFont={(f) => setFonts(prev => [...prev, f])} existingFontFamilies={fonts.map(f => f.family)} />
          </div>
        )}

        {/* 筛选与搜索栏 */}
        <div ref={filterSectionRef} className="sticky top-20 z-40 space-y-4">
          <div className={`${styleConfig.nav} backdrop-blur-xl border border-slate-200/50 rounded-[10px] p-4 shadow-xl flex flex-col xl:flex-row items-center gap-4 ring-1 ring-black/5`}>
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="搜索字体家族..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${styleConfig.input} bg-white/50 rounded-[10px] pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-indigo-500 transition-all shadow-sm`}
              />
            </div>
            <div className="relative flex-grow w-full">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="输入预览文字..." value={previewText} onChange={(e) => setPreviewText(e.target.value)}
                className={`w-full ${styleConfig.input} bg-white/50 rounded-[10px] pl-10 pr-12 py-2.5 text-[14px] outline-none focus:border-indigo-500 transition-all shadow-sm`}
              />
              <button onClick={() => setShowTemplates(!showTemplates)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${showTemplates ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}>
                <BookOpen size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className={`flex items-center gap-2 ${styleConfig.input} bg-white/50 px-3 py-2.5 rounded-[10px] shadow-sm`}>
                <Maximize2 size={14} className="text-slate-400" />
                <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <span className="text-[13px] font-mono text-indigo-600 w-8 text-right font-bold">{fontSize}</span>
              </div>
              <button onClick={handleResetFilters} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-all active:rotate-180">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {showTemplates && <PreviewTemplates theme={appStyle} onSelect={(content) => setPreviewText(content)} currentContent={previewText} />}
          
          <div className="flex flex-wrap gap-2">
            {Object.keys(CATEGORY_LABELS).map(cat => (
              <button
                key={cat} onClick={() => setSelectedCategory(cat as any)}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-[10px] border text-[13px] font-bold transition-all ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white/80 backdrop-blur-sm border-slate-200/50 text-slate-600 hover:border-slate-300'}`}
              >
                {CATEGORY_LABELS[cat].icon} {CATEGORY_LABELS[cat].label}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid gap-8 ${gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {filteredFonts.map((font) => (
            <FontCard 
              key={font.family} font={font} theme={appStyle} previewText={previewText} fontSize={fontSize} 
              onShowDetails={setSelectedFontForDetails} isFavorite={favorites.includes(font.family)}
              onToggleFavorite={(f) => setFavorites(prev => prev.includes(f.family) ? prev.filter(id => id !== f.family) : [...prev, f.family])}
              isComparing={!!compareList.find(f => f.family === font.family)} onToggleCompare={() => handleToggleCompare(font)}
            />
          ))}
          {filteredFonts.length === 0 && (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
              <Search size={80} strokeWidth={1} />
              <p className="mt-4 text-[18px] font-black uppercase tracking-widest">未找到匹配字体</p>
            </div>
          )}
        </div>
      </main>

      {/* 汉化页脚 */}
      <footer className={`${styleConfig.footer} pt-24 pb-12 px-6 mt-20 transition-all duration-500 relative overflow-hidden`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-current/10 to-transparent" />
        
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            {/* 品牌定位 */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 space-y-8 group">
              <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                  <Type size={22} />
                </div>
                <span className={`text-[24px] font-black tracking-tighter ${appStyle === 'midnight' ? 'text-white' : 'text-slate-900'}`}>字绘.Lab</span>
              </div>
              <div className="space-y-4">
                <p className={`text-[14px] leading-relaxed font-medium opacity-60 ${styleConfig.footerSub}`}>
                  基于现代排版美学与 AI 技术，致力于打造全球领先的开源字体发现平台。连接文字背后的灵魂，探索设计的无限可能。
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-0.5 h-12 bg-indigo-500/30 rounded-full" />
                  <p className={`text-[13px] font-bold italic opacity-40 group-hover:opacity-100 transition-all duration-700 leading-relaxed ${styleConfig.footerSub}`}>
                    “好的设计，是让文字在视网膜上起舞。”
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { icon: <Twitter size={18} />, color: 'hover:text-sky-500', label: '推特' },
                  { icon: <Dribbble size={18} />, color: 'hover:text-rose-500', label: '追波' },
                  { icon: <Github size={18} />, color: 'hover:text-slate-900', label: '代码仓库' },
                  { icon: <Mail size={18} />, color: 'hover:text-indigo-600', label: '邮件联系' }
                ].map((social, i) => (
                  <a key={i} href="#" className={`w-10 h-10 rounded-xl border border-current/10 flex items-center justify-center opacity-40 hover:opacity-100 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl ${social.color}`} title={social.label}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* 发现功能 */}
            <div className="space-y-6">
              <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40`}>内容探索</h4>
              <ul className="space-y-4">
                {[
                  { label: '全量数据库', icon: <Database size={14} />, action: () => setIsDatabaseOpen(true) },
                  { label: '中文字库专区', icon: <Box size={14} />, action: () => applyFooterFilter('All', 'chinese-simplified') },
                  { label: 'AI 配对实验室', icon: <Sparkles size={14} />, action: scrollToAIPairing },
                  { label: '2025 排版趋势', icon: <TrendingUp size={14} />, action: () => setIsTrendsOpen(true) },
                  { label: '最新发布字体', icon: <Zap size={14} />, action: () => { setSortBy('newest'); scrollToTop(); } }
                ].map(link => (
                  <li key={link.label}>
                    <button 
                      onClick={link.action} 
                      className={`text-[14px] font-bold transition-all hover:text-indigo-600 flex items-center gap-2.5 opacity-60 hover:opacity-100 ${styleConfig.footerSub}`}
                    >
                      <span className="opacity-40">{link.icon}</span> {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 专业资源 */}
            <div className="space-y-6">
              <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40`}>相关资源</h4>
              <ul className="space-y-4">
                {[
                  { label: '安装指南手册', icon: <Download size={14} />, action: () => openHandbook('os-install') },
                  { label: '排版实验室', icon: <Terminal size={14} />, action: () => setIsTypographyLabOpen(true) },
                  { label: '开源授权百科', icon: <ShieldCheck size={14} />, action: () => openHandbook('license-wiki') },
                  { label: '品牌物料包', icon: <Palette size={14} />, action: () => setIsBrandAssetsOpen(true) },
                  { label: '开发者 API', icon: <Code2 size={14} />, action: () => openHandbook('developer') }
                ].map(link => (
                  <li key={link.label}>
                    <button 
                      onClick={link.action || (() => showToast(`"${link.label}" 正在构建中，敬请期待...`, 'info'))}
                      className={`text-[14px] font-bold transition-all hover:text-indigo-600 flex items-center gap-2.5 opacity-60 hover:opacity-100 ${styleConfig.footerSub}`}
                    >
                      <span className="opacity-40">{link.icon}</span> {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 支持与账号 */}
            <div className="space-y-6">
              <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40`}>支持与互动</h4>
              <ul className="space-y-4">
                {[
                  { label: '我的收藏夹', icon: <Heart size={14} />, action: () => { setShowOnlyFavorites(true); scrollToTop(); } },
                  { label: '帮助中心', icon: <HelpCircle size={14} />, action: () => setIsHelpCenterOpen(true) },
                  { label: '贡献者指南', icon: <Users size={14} />, action: () => setIsContributionOpen(true) },
                  { label: '意见反馈', icon: <MessageSquare size={14} />, action: () => setIsFeedbackOpen(true) },
                  { label: '赞助实验室', icon: <HeartHandshake size={14} />, action: () => setIsSponsorOpen(true) }
                ].map(link => (
                  <li key={link.label}>
                    <button 
                      onClick={link.action || (() => showToast(`模块正在建设，感谢关注。`, 'info'))} 
                      className={`text-[14px] font-bold transition-all hover:text-indigo-600 flex items-center gap-2.5 opacity-60 hover:opacity-100 ${styleConfig.footerSub}`}
                    >
                      <span className="opacity-40">{link.icon}</span> {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 状态监控 */}
            <div className="space-y-8">
              <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] opacity-40`}>运行状态</h4>
              <div className={`p-5 rounded-2xl border ${appStyle === 'midnight' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4 shadow-sm group/status`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">正常运行</span>
                  </div>
                  <BarChart3 size={12} className="opacity-20 group-hover/status:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-end gap-1 h-8">
                  {pingData.map((h, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${h > 80 ? 'bg-rose-500/40' : 'bg-indigo-500/40'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">
                   <span>延迟: 28毫秒</span>
                   <span>可用率: 100.0%</span>
                </div>
              </div>
              <div className="relative pt-2">
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" value={subscriberEmail} onChange={(e) => setSubscriberEmail(e.target.value)} 
                    placeholder="订阅动态报告" 
                    className={`w-full ${styleConfig.input} px-4 py-2.5 rounded-xl text-[12px] outline-none border border-current/10 focus:border-indigo-600 transition-all shadow-inner`} 
                  />
                  <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* 版权与法律链接 */}
          <div className="pt-12 border-t border-current/5 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-[13px] font-bold ${styleConfig.footerSub}`}>
              <span className="opacity-40">&copy; 2025 字绘.Lab (FontCanvas)</span>
              <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5" onClick={(e) => {e.preventDefault(); openLegal('privacy')}}><Shield size={14} /> 隐私保护</a>
              <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5" onClick={(e) => {e.preventDefault(); openLegal('terms')}}><FileText size={14} /> 协议条款</a>
              <a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5" onClick={(e) => {e.preventDefault(); setIsSiteMapOpen(true)}}><ExternalLink size={14} /> 站点地图</a>
              <span className="flex items-center gap-1.5 opacity-10 font-mono text-[11px] select-none">
                版本哈希: fc-v2.5.3-release
              </span>
            </div>
            
            <div className={`flex items-center gap-6 text-[13px] font-bold ${styleConfig.footerSub}`}>
              <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors opacity-60 hover:opacity-100 group">
                <Globe size={16} className="group-hover:rotate-180 transition-transform duration-700" /> <span>简体中文</span>
              </button>
              <div className="w-px h-4 bg-current/20" />
              <div className="flex items-center gap-2 opacity-30">
                <span>精心设计，献给字体爱好者</span>
                <Heart size={16} className="text-rose-500 fill-current animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 回到顶部 */}
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-32 right-10 w-14 h-14 ${styleConfig.glass} border rounded-full shadow-2xl flex items-center justify-center text-current hover:scale-110 transition-all z-[70] active:scale-90 animate-in fade-in zoom-in duration-300`}
          title="回到顶部"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* 对比悬浮窗 */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-in slide-in-from-bottom-6 duration-500">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-3 flex items-center gap-6 ring-1 ring-white/10">
            <div className="flex -space-x-2">
              {compareList.map((f, i) => (
                <div key={f.family} className="relative group">
                  <div className={`w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[13px] shadow-lg ${i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                    {f.family[0].toUpperCase()}
                  </div>
                  <button onClick={() => handleToggleCompare(f)} className="absolute -top-1 -right-1 bg-white text-slate-900 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="text-white">
                <p className="text-[12px] font-black uppercase tracking-wider">对比库</p>
                <p className="text-[11px] text-white/40">{compareList.length}/3 已选</p>
              </div>
              {compareList.length >= 2 && (
                <button onClick={() => setIsCompareModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg">
                  <Scale size={16} className="inline mr-2" /> 开启对比
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 风格球 */}
      <div className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-3">
        {isStyleMenuOpen && (
          <div className={`flex flex-col gap-2 mb-2 menu-enter p-2 rounded-2xl ${styleConfig.glass} border shadow-2xl`}>
            {(Object.keys(STYLE_CONFIG) as AppStyle[]).map(s => (
              <button
                key={s} onClick={() => { setAppStyle(s); setIsStyleMenuOpen(false); }}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${appStyle === s ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-600/10 text-current'}`}
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
        <button onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 active:scale-90 ${isStyleMenuOpen ? 'bg-slate-900 border-slate-800 text-white' : 'bg-indigo-600 border-indigo-500 text-white'}`}>
          {isStyleMenuOpen ? <X size={24} /> : <Palette size={24} />}
        </button>
      </div>

      {selectedFontForDetails && <FontDetailsModal font={selectedFontForDetails} onClose={() => setSelectedFontForDetails(null)} previewText={previewText} isFavorite={favorites.includes(selectedFontForDetails.family)} onToggleFavorite={(f) => setFavorites(prev => prev.includes(f.family) ? prev.filter(id => id !== f.family) : [...prev, f.family])} />}
      {isCompareModalOpen && <FontComparisonModal fonts={compareList} onClose={() => setIsCompareModalOpen(false)} onRemove={(f) => handleToggleCompare(f)} previewText={previewText} />}
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
      <FontDatabaseModal isOpen={isDatabaseOpen} onClose={() => setIsDatabaseOpen(false)} fonts={fonts} theme={appStyle} />
    </div>
  );
};

export default App;
