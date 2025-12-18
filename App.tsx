
// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Type, LayoutGrid, List, ArrowUp, Github, Sparkles, Loader2, Heart, FolderHeart, ChevronDown, Scale, X, Maximize2, Info, Quote, Calendar, Globe, Box, Hash, Download, Languages, Settings2, Palette, Terminal, Zap, Filter, MousePointer2, RefreshCw, Feather, Layers, MousePointerClick, Star, Bold, Italic, ShieldCheck, Trash2, ChevronRight, Save, User as UserIcon, LogOut, Cloud, Building2, Bookmark, Library, Wand2, Database, Plus, Edit3, ExternalLink, FileJson, RotateCcw, Layout, Columns2, Columns3, Columns4 } from 'lucide-react';
import { Font, Category, User } from './types';
import { MOCK_FONTS } from './constants';
import { dbService } from './services/dbService';
import FontCard from './components/FontCard';
import AIPairing from './components/AIPairing';
import FontInspiration from './components/FontInspiration';
import FontDetailsModal from './components/FontDetailsModal';
import LoginModal from './components/LoginModal';

type AppStyle = 'classic' | 'midnight' | 'frosted' | 'nostalgic';

const STYLE_CONFIG: Record<AppStyle, { body: string, nav: string, text: string, cardBorder: string, label: string }> = {
  'classic': {
    body: 'bg-[#FAFBFF]',
    nav: 'bg-white/80 border-slate-100',
    text: 'text-slate-900',
    cardBorder: 'border-slate-100',
    label: '极简实验室'
  },
  'midnight': {
    body: 'bg-slate-950',
    nav: 'bg-slate-900/80 border-slate-800',
    text: 'text-slate-50',
    cardBorder: 'border-slate-800',
    label: '黑洞模式'
  },
  'frosted': {
    body: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50',
    nav: 'bg-white/40 border-white/40',
    text: 'text-indigo-950',
    cardBorder: 'border-white/60',
    label: '毛玻璃幻境'
  },
  'nostalgic': {
    body: 'bg-[#F4F1EA]',
    nav: 'bg-[#EAE6D9]/80 border-[#D8D2C2]',
    text: 'text-[#4A453A]',
    cardBorder: 'border-[#D8D2C2]',
    label: '复古羊皮纸'
  }
};

const CATEGORY_LABELS: Record<string, { label: string, icon: React.ReactNode }> = {
  'All': { label: '全部类型', icon: <Layers size={14} /> },
  'sans-serif': { label: '无衬线', icon: <Box size={14} /> },
  'serif': { label: '衬线体', icon: <Feather size={14} /> },
  'display': { label: '展示体', icon: <Palette size={14} /> },
  'handwriting': { label: '手写体', icon: <Quote size={14} /> },
  'monospace': { label: '等宽体', icon: <Terminal size={14} /> }
};

const LANGUAGE_FILTERS = [
  { id: 'all', label: '全部语言', icon: <Globe size={14} /> },
  { id: 'zh', label: '中文字体', icon: <span className="font-black text-[12px]">中</span> },
  { id: 'en', label: '英文字体', icon: <span className="font-black text-[12px]">EN</span> }
];

const App: React.FC = () => {
  // --- 全局风格状态 ---
  const [appStyle, setAppStyle] = useState<AppStyle>(() => (localStorage.getItem('fc_app_style') as AppStyle) || 'classic');
  const [showStylePicker, setShowStylePicker] = useState(false);

  // --- 账户状态 ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fc_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDBOpen, setIsDBOpen] = useState(false);

  // 获取当前存储作用域前缀
  const getStorageKey = (key: string, user = currentUser) => user ? `user_${user.username}_${key}` : `guest_${key}`;

  // --- 字体数据管理 ---
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFonts = async () => {
    setLoading(true);
    const data = await dbService.getAllFonts();
    setFonts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('favorites', currentUser));
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  const [fontSize, setFontSize] = useState<number>(36);
  const [previewText, setPreviewText] = useState<string>('');
  
  // --- 布局列数状态 (默认 3) ---
  const [gridCols, setGridCols] = useState<number>(() => {
    const saved = localStorage.getItem(getStorageKey('pref_grid_cols', currentUser));
    return saved ? Number(saved) : 3;
  });

  // --- UI 筛选状态 ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'zh' | 'en'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'danger' } | null>(null);
  const [selectedFontForDetails, setSelectedFontForDetails] = useState<Font | null>(null);

  const styleConfig = STYLE_CONFIG[appStyle];

  // 提取动态品牌列表
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(fonts.map(f => f.source || '其他'))).filter(Boolean);
    return ['All', ...uniqueBrands];
  }, [fonts]);

  // --- 持久化与同步 ---
  useEffect(() => {
    localStorage.setItem('fc_app_style', appStyle);
  }, [appStyle]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('favorites'), JSON.stringify(favorites));
  }, [favorites, currentUser]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('pref_grid_cols'), gridCols.toString());
  }, [gridCols, currentUser]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setToast({ message, type });
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedLanguage('all');
    setSelectedBrand('All');
    setFontSize(36);
    setSearchTerm('');
    setPreviewText('');
    setShowOnlyFavorites(false);
    showToast("筛选已全部重置", "info");
  };

  const isChineseFont = (font: Font) => {
    const keywords = ['SC', 'ZCOOL', 'Ma Shan', 'Zhi Mang', 'Long Cang', 'Liu Jian'];
    return font.chineseName || keywords.some(k => font.family.includes(k));
  };

  const filteredFonts = useMemo(() => {
    return fonts.filter(font => {
      const matchesSearch = (font.family + (font.chineseName || '')).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || font.category === selectedCategory;
      const matchesFavorite = !showOnlyFavorites || favorites.includes(font.family);
      const matchesBrand = selectedBrand === 'All' || (font.source || '其他') === selectedBrand;
      let matchesLanguage = true;
      if (selectedLanguage === 'zh') matchesLanguage = isChineseFont(font);
      if (selectedLanguage === 'en') matchesLanguage = !isChineseFont(font);
      return matchesSearch && matchesCategory && matchesFavorite && matchesLanguage && matchesBrand;
    });
  }, [searchTerm, selectedCategory, showOnlyFavorites, favorites, fonts, selectedLanguage, selectedBrand]);

  const toggleFavorite = (font: Font) => {
    const isFav = favorites.includes(font.family);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f !== font.family));
      showToast(`已移除: ${font.chineseName || font.family}`, "info");
    } else {
      setFavorites(prev => [...prev, font.family]);
      showToast(`已加入收藏馆`, "success");
    }
  };

  // --- 账户登录/注销处理 ---
  const handleLogin = (user: User, isNewUser: boolean) => {
    const guestScope = 'guest_';
    const guestFavs = JSON.parse(localStorage.getItem(`${guestScope}favorites`) || '[]');
    
    if (guestFavs.length > 0) {
      if (window.confirm("发现您在游客模式下有收藏的字体，是否合并到您的账户中？")) {
        const userScope = `user_${user.username}_`;
        const userFavs = JSON.parse(localStorage.getItem(`${userScope}favorites`) || '[]');
        const mergedFavs = Array.from(new Set([...userFavs, ...guestFavs]));
        localStorage.setItem(`${userScope}favorites`, JSON.stringify(mergedFavs));
        setFavorites(mergedFavs);
        localStorage.removeItem(`${guestScope}favorites`);
        showToast("游客数据已合并", "success");
      }
    }

    setCurrentUser(user);
    localStorage.setItem('fc_active_user', JSON.stringify(user));
    setIsLoginModalOpen(false);
    
    const userScope = `user_${user.username}_`;
    const userCols = localStorage.getItem(`${userScope}pref_grid_cols`);
    if (userCols) setGridCols(Number(userCols));
    
    showToast(`欢迎回来，${user.username}！`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fc_active_user');
    setFavorites([]);
    showToast("已安全退出", "info");
  };

  // --- 数据库管理操作 ---
  const handleSaveFont = async (font: Font) => {
    await dbService.saveFont(font);
    await fetchFonts();
    showToast(`字体库已更新: ${font.family}`, "success");
  };

  const handleDeleteFont = async (family: string) => {
    if (MOCK_FONTS.some(f => f.family === family)) {
      showToast("预设字体无法彻底删除", "info");
      return;
    }
    await dbService.deleteFont(family);
    await fetchFonts();
    showToast(`已从库中移除: ${family}`, "danger");
  };

  const handleResetDB = async () => {
    if (window.confirm("确定要重置数据库吗？这会清除所有自定义字体。")) {
      await dbService.resetDatabase();
      await fetchFonts();
      showToast("数据库已重置为出厂状态", "info");
    }
  };

  const handleExportDB = () => {
    const blob = new Blob([JSON.stringify(fonts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fontcanvas_db_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast("数据库快照导出成功", "success");
  };

  // 根据 gridCols 计算 Grid 样式类
  const gridClassName = useMemo(() => {
    switch (gridCols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; // 默认：移动1/平板2/桌面3
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  }, [gridCols]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${styleConfig.body} ${styleConfig.text}`}>
      {/* 顶部导航 */}
      <header className={`backdrop-blur-xl border-b py-4 px-6 md:px-10 sticky top-0 z-[60] w-full transition-all duration-500 ${styleConfig.nav}`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl rotate-3 transition-transform hover:rotate-0 cursor-pointer ${appStyle === 'midnight' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
              <Type size={20} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">字绘<span className="text-indigo-600">.Lab</span></h1>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1 text-nowrap">FontCanvas Discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDBOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${appStyle === 'midnight' ? 'bg-white/10 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
            >
              <Database size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">数据管理</span>
              <div className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-black">{fonts.length}</div>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowStylePicker(!showStylePicker)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${appStyle === 'classic' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/10 border-white/10 text-white/80'}`}
              >
                <Wand2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">{styleConfig.label}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showStylePicker ? 'rotate-180' : ''}`} />
              </button>
              {showStylePicker && (
                <div className="absolute top-full right-0 mt-3 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-1 w-48 animate-in slide-in-from-top-2">
                  {(Object.keys(STYLE_CONFIG) as AppStyle[]).map(s => (
                    <button key={s} onClick={() => { setAppStyle(s); setShowStylePicker(false); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-black transition-all ${appStyle === s ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <div className={`w-3 h-3 rounded-full ${s === 'midnight' ? 'bg-slate-900' : s === 'classic' ? 'bg-slate-200 border border-slate-300' : s === 'frosted' ? 'bg-blue-300' : 'bg-[#D8D2C2]'}`} />
                      {STYLE_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)} className={`group flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all ${showOnlyFavorites ? 'bg-indigo-600 text-white shadow-lg' : 'bg-current/5 hover:bg-current/10 border border-current/10'}`}>
              <Heart size={15} fill={showOnlyFavorites ? "currentColor" : "none"} /> 
              <span className="hidden sm:inline">收藏馆</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded-lg text-[10px] ${showOnlyFavorites ? 'bg-white/20' : 'bg-current/10 opacity-70'}`}>{favorites.length}</span>
            </button>
            
            <div className="h-6 w-px bg-current/10 hidden sm:block" />
            
            {currentUser ? (
              <div className="flex items-center gap-3 group relative">
                <div className={`w-10 h-10 ${currentUser.avatarColor} rounded-2xl flex items-center justify-center text-white font-black text-[14px] shadow-lg cursor-pointer`}>{currentUser.username.charAt(0).toUpperCase()}</div>
                <button onClick={handleLogout} className="p-3 opacity-40 hover:opacity-100 hover:text-red-500 rounded-xl transition-all"><LogOut size={18} /></button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all shadow-xl ${appStyle === 'midnight' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
                <UserIcon size={16} /> 登录
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast 提示 */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-5 fade-in duration-300">
           <div className={`px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-3 backdrop-blur-xl border border-white/20 ${toast.type === 'success' ? 'bg-indigo-600/90 text-white' : toast.type === 'danger' ? 'bg-red-600/90 text-white' : 'bg-slate-900/90 text-white'}`}>
              {toast.type === 'success' ? <Star size={18} className="fill-current" /> : <Info size={18} />}
              <span className="text-[14px] font-black tracking-tight">{toast.message}</span>
           </div>
        </div>
      )}

      {/* 数据库管理模态框 */}
      {isDBOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" onClick={() => setIsDBOpen(false)} />
          <div className="relative bg-white w-full max-w-6xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100"><Database size={24} /></div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">库管理仪表盘</h2>
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1">FontCanvas Data Management System</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={handleExportDB} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-all font-black text-[12px]"><FileJson size={16} /> 导出 JSON</button>
                   <button onClick={handleResetDB} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all font-black text-[12px]"><RotateCcw size={16} /> 重置库</button>
                   <button onClick={() => setIsDBOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-all text-slate-400"><X size={20} /></button>
                </div>
             </div>
             
             <div className="flex-grow overflow-auto p-8 no-scrollbar">
                <table className="w-full text-left border-separate border-spacing-y-2">
                   <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-6 py-4">字体家族 / Family</th>
                         <th className="px-6 py-4">分类 / Category</th>
                         <th className="px-6 py-4">品牌来源 / Source</th>
                         <th className="px-6 py-4">授权方式 / License</th>
                         <th className="px-6 py-4">最后修改 / Modified</th>
                         <th className="px-6 py-4 text-right">管理操作 / Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {fonts.map(font => (
                         <tr key={font.family} className="group bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all rounded-2xl">
                            <td className="px-6 py-5 rounded-l-2xl">
                               <div className="flex flex-col">
                                  <span className="text-[14px] font-black text-slate-900">{font.chineseName || font.family}</span>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{font.family}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{font.category}</span>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[12px] font-bold text-slate-600">{font.source || '未知来源'}</span>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{font.license || 'OFL'}</span>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[12px] font-mono text-slate-400">{font.lastModified}</span>
                            </td>
                            <td className="px-6 py-5 text-right rounded-r-2xl space-x-2">
                               <button onClick={() => { setSelectedFontForDetails(font); setIsDBOpen(false); }} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                               <button onClick={() => handleDeleteFont(font.family)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />

      <div className="w-full flex-grow">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 lg:py-16 space-y-12">
          {!showOnlyFavorites && (
            <section className="grid md:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in duration-700">
              <AIPairing onImportFont={handleSaveFont} existingFontFamilies={fonts.map(f => f.family)} />
              <FontInspiration onImportFont={handleSaveFont} existingFontFamilies={fonts.map(f => f.family)} />
            </section>
          )}

          {/* 筛选控制栏 */}
          <div className="sticky top-[88px] z-40 space-y-5">
             <div className={`backdrop-blur-2xl rounded-[3rem] border shadow-xl p-5 flex flex-col xl:flex-row items-center gap-5 transition-all duration-500 ${appStyle === 'midnight' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-white/60'}`}>
                <div className="flex items-center gap-4 flex-grow w-full">
                  <div className="relative flex-grow group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-current opacity-40" size={20} />
                    <input type="text" placeholder="发现字体家族..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full bg-current/5 border border-current/10 rounded-[1.5rem] pl-14 pr-6 py-4 text-[14px] font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${appStyle === 'midnight' ? 'placeholder:text-white/20' : 'placeholder:text-slate-400'}`} />
                  </div>
                  <div className="relative flex-grow group">
                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-current opacity-40" size={20} />
                    <input type="text" placeholder="键入文字预览效果..." value={previewText} onChange={(e) => setPreviewText(e.target.value)} className={`w-full bg-current/5 border border-current/10 rounded-[1.5rem] pl-14 pr-6 py-4 text-[14px] font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${appStyle === 'midnight' ? 'placeholder:text-white/20' : 'placeholder:text-slate-400'}`} />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full xl:w-auto shrink-0 px-2">
                  <div className="flex items-center gap-4 bg-current/5 border border-current/10 px-5 py-3 rounded-[1.5rem] flex-grow xl:flex-grow-0">
                    <Maximize2 size={16} className="opacity-40" />
                    <input type="range" min="12" max="144" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24 xl:w-36 h-1.5 bg-current/10 rounded-full accent-indigo-600 cursor-pointer appearance-none" />
                    <span className="text-[14px] font-black text-indigo-600 font-mono w-10 text-right">{fontSize}</span>
                  </div>

                  {/* 多列布局切换器 - 初始高亮 3 COL */}
                  <div className={`flex items-center gap-1 p-1 rounded-2xl shadow-inner border shrink-0 ${appStyle === 'midnight' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    {[1, 2, 3, 4].map(num => (
                      <button 
                        key={num}
                        onClick={() => setGridCols(num)}
                        className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center relative group/btn ${gridCols === num ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:bg-current/5'}`}
                        title={`${num} 列布局`}
                      >
                        {num === 1 && <List size={18} />}
                        {num === 2 && <Columns2 size={18} />}
                        {num === 3 && <Columns3 size={18} />}
                        {num === 4 && <Columns4 size={18} />}
                        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">{num} COL</span>
                      </button>
                    ))}
                  </div>

                  <button onClick={resetFilters} className="w-12 h-12 flex items-center justify-center opacity-40 hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50 rounded-[1.5rem] transition-all border border-transparent hover:border-indigo-100"><RefreshCw size={20} /></button>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex flex-col xl:flex-row gap-4">
                  <div className={`backdrop-blur-md rounded-[1.75rem] border p-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shadow-sm flex-grow ${appStyle === 'midnight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white/60'}`}>
                    <div className="flex items-center gap-2 px-4 opacity-40 shrink-0"><Building2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">品牌系列</span></div>
                    {brands.map(brand => (
                      <button key={brand} onClick={() => setSelectedBrand(brand)} className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.4rem] text-[12px] font-black transition-all whitespace-nowrap ${selectedBrand === brand ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-60 hover:opacity-100 hover:bg-white/10'}`}>
                        {brand === 'All' ? '全部品牌' : brand}
                      </button>
                    ))}
                  </div>
                  <div className={`backdrop-blur-md rounded-[1.75rem] border p-1.5 flex gap-1.5 shadow-sm shrink-0 ${appStyle === 'midnight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white/60'}`}>
                    {LANGUAGE_FILTERS.map(lang => (
                      <button key={lang.id} onClick={() => setSelectedLanguage(lang.id)} className={`flex items-center gap-2.5 px-6 py-2.5 rounded-[1.4rem] text-[13px] font-black transition-all whitespace-nowrap ${selectedLanguage === lang.id ? (appStyle === 'midnight' ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-900 text-white shadow-lg') : 'opacity-60 hover:opacity-100 hover:bg-white/10'}`}>{lang.icon}<span>{lang.label}</span></button>
                    ))}
                  </div>
                </div>
                <div className={`backdrop-blur-md rounded-[1.75rem] border p-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shadow-sm w-full ${appStyle === 'midnight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white/60'}`}>
                  <div className="flex items-center gap-2 px-4 opacity-40 shrink-0"><Bookmark size={16} /><span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">分类偏好</span></div>
                  {Object.keys(CATEGORY_LABELS).map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[1.4rem] text-[13px] font-black transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-60 hover:opacity-100 hover:bg-white/10'}`}>{CATEGORY_LABELS[cat].icon}<span>{CATEGORY_LABELS[cat].label}</span></button>
                  ))}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <span className="text-[12px] font-black uppercase tracking-widest opacity-40">当前结果:</span>
                <span className={`px-3 py-1 rounded-lg border text-indigo-600 font-black text-[14px] shadow-sm ${appStyle === 'midnight' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>{filteredFonts.length} 款字体</span>
             </div>
          </div>

          {/* 动态网格容器 - 优化动画切换 */}
          <div className={`grid gap-8 lg:gap-10 transition-all duration-500 ease-in-out ${gridClassName}`}>
            {filteredFonts.map(font => (
              <FontCard key={font.family} font={font} previewText={previewText} fontSize={fontSize} isFavorite={favorites.includes(font.family)} onToggleFavorite={toggleFavorite} onSelect={() => {}} onShowDetails={(f) => setSelectedFontForDetails(f)} />
            ))}
          </div>

          {filteredFonts.length === 0 && (
             <div className={`py-32 text-center rounded-[4rem] border-4 border-dashed flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700 ${appStyle === 'midnight' ? 'bg-slate-900/40 border-slate-800' : 'bg-white/60 border-slate-100'}`}>
                <div className="w-24 h-24 bg-current/5 opacity-10 rounded-full flex items-center justify-center mb-8"><Search size={48} /></div>
                <h3 className="text-3xl font-black tracking-tight">未能找到匹配的字体</h3>
                <button onClick={resetFilters} className={`mt-10 px-10 py-4 rounded-[1.5rem] font-black text-[14px] transition-all shadow-2xl uppercase tracking-widest ${appStyle === 'midnight' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>重置所有筛选</button>
             </div>
          )}
        </div>
      </div>
      
      {selectedFontForDetails && (
        <FontDetailsModal font={selectedFontForDetails} previewText={previewText} isFavorite={favorites.includes(selectedFontForDetails.family)} onToggleFavorite={toggleFavorite} onClose={() => setSelectedFontForDetails(null)} />
      )}
    </div>
  );
};

export default App;
