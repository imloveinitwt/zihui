
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Filter, ArrowUpDown, Download, ExternalLink, Hash, Database, CheckCircle2, Shield, Layout, Settings2, FileJson, Info, CheckSquare, Square, Trash2, Layers, Globe, Zap, Eye, ChevronDown } from 'lucide-react';
import { Font } from '../types';

interface FontDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fonts: Font[];
  theme?: string;
}

const FontDatabaseModal: React.FC<FontDatabaseModalProps> = ({ isOpen, onClose, fonts, theme = 'classic' }) => {
  // 基础状态
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Font>('family');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 过滤状态
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLicense, setFilterLicense] = useState('All');
  const [filterSubset, setFilterSubset] = useState('All');
  
  // 选择与交互
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(new Set());
  const [previewText, setPreviewText] = useState('文字是连接灵魂的桥梁');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(['family', 'category', 'license', 'subsets', 'version']));

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = 'unset';
      setSelectedFamilies(new Set());
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // 计算过滤与排序后的数据
  const filteredFonts = useMemo(() => {
    let result = fonts.filter(f => {
      const matchesSearch = (f.family + (f.chineseName || '')).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'All' || f.category === filterCategory;
      const matchesLic = filterLicense === 'All' || (f.license || 'SIL OFL').includes(filterLicense);
      const matchesSub = filterSubset === 'All' || f.subsets.includes(filterSubset);
      return matchesSearch && matchesCat && matchesLic && matchesSub;
    });
    
    return result.sort((a, b) => {
      const valA = (a[sortKey] || '').toString();
      const valB = (b[sortKey] || '').toString();
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB, 'zh')
        : valB.localeCompare(valA, 'zh');
    });
  }, [fonts, searchTerm, sortKey, sortOrder, filterCategory, filterLicense, filterSubset]);

  const toggleSort = (key: keyof Font) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedFamilies.size === filteredFonts.length) {
      setSelectedFamilies(new Set());
    } else {
      setSelectedFamilies(new Set(filteredFonts.map(f => f.family)));
    }
  };

  const toggleSelect = (family: string) => {
    const next = new Set(selectedFamilies);
    if (next.has(family)) next.delete(family);
    else next.add(family);
    setSelectedFamilies(next);
  };

  const toggleColumn = (col: string) => {
    const next = new Set(visibleColumns);
    if (next.has(col)) {
      if (next.size > 1) next.delete(col);
    } else {
      next.add(col);
    }
    setVisibleColumns(next);
  };

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    filterBar: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/50 border-slate-200',
    tableHeader: isDarkTheme ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500',
    row: isDarkTheme ? 'border-slate-800 hover:bg-slate-900/50' : 'border-slate-100 hover:bg-slate-50',
    rowSelected: isDarkTheme ? 'bg-indigo-500/10' : 'bg-indigo-50',
    input: isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900',
    select: isDarkTheme ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600',
  };

  const columnLabelMap: Record<string, string> = {
    'family': '字体家族',
    'category': '分类',
    'license': '授权协议',
    'subsets': '语言支持',
    'version': '版本号',
    'designer': '设计师'
  };

  return (
    <div className="fixed inset-0 z-[240] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-[90vw] h-full max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        
        {/* 页头 */}
        <header className={`p-8 border-b ${themeClasses.header} shrink-0`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Database size={24} />
              </div>
              <div>
                <h2 className="text-[20px] font-black tracking-tight">字体全量数据库</h2>
                <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">全局元数据仓库与管理工作台</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  className={`p-3 rounded-xl border transition-all ${showColumnSettings ? 'bg-indigo-600 border-indigo-600 text-white' : themeClasses.select}`}
                  title="列设置"
                >
                  <Settings2 size={20} />
                </button>
                {showColumnSettings && (
                  <div className={`absolute right-0 mt-2 w-48 p-4 rounded-2xl shadow-2xl z-50 border menu-enter ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-3 block">显示列配置</span>
                    <div className="space-y-2">
                      {Object.keys(columnLabelMap).map(col => (
                        <button key={col} onClick={() => toggleColumn(col)} className="flex items-center gap-2 w-full text-[12px] font-bold opacity-70 hover:opacity-100">
                          {visibleColumns.has(col) ? <CheckSquare size={14} className="text-indigo-600" /> : <Square size={14} />}
                          {columnLabelMap[col]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
                <X size={28} />
              </button>
            </div>
          </div>

          {/* 高级过滤器 */}
          <div className={`p-4 rounded-2xl border ${themeClasses.filterBar} flex flex-wrap items-center gap-4`}>
            <div className="relative flex-grow min-w-[240px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="快速检索元数据..."
                 className={`w-full pl-12 pr-4 py-2.5 rounded-xl border outline-none focus:border-indigo-600 transition-all text-[13px] ${themeClasses.input}`}
               />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="opacity-30" />
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-[12px] font-bold outline-none ${themeClasses.select}`}
                >
                  <option value="All">全部类型</option>
                  <option value="sans-serif">无衬线体</option>
                  <option value="serif">衬线体</option>
                  <option value="display">展示体</option>
                  <option value="handwriting">手写体</option>
                </select>
              </div>
              
              <select 
                value={filterLicense} 
                onChange={(e) => setFilterLicense(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-[12px] font-bold outline-none ${themeClasses.select}`}
              >
                <option value="All">全部授权</option>
                <option value="OFL">SIL OFL 开源</option>
                <option value="Apache">Apache 2.0</option>
                <option value="Commercial">免费商用</option>
              </select>

              <select 
                value={filterSubset} 
                onChange={(e) => setFilterSubset(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-[12px] font-bold outline-none ${themeClasses.select}`}
              >
                <option value="All">语言支持</option>
                <option value="chinese-simplified">简体中文</option>
                <option value="latin">拉丁文</option>
              </select>
            </div>

            <div className="w-px h-8 bg-current/10 mx-2" />

            <div className="flex items-center gap-2">
              <Eye size={14} className="opacity-30" />
              <input 
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="行内预览文字..."
                className={`px-4 py-2 rounded-xl border text-[12px] font-medium outline-none focus:border-indigo-600 ${themeClasses.input}`}
              />
            </div>
          </div>
        </header>

        {/* 表格内容 */}
        <div className="flex-grow overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className={`sticky top-0 z-10 ${themeClasses.tableHeader} border-b border-current/5`}>
              <tr className="text-[11px] font-black uppercase tracking-widest">
                <th className="p-6 w-12">
                   <button onClick={toggleSelectAll} className="text-indigo-600">
                     {selectedFamilies.size === filteredFonts.length && filteredFonts.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                   </button>
                </th>
                {visibleColumns.has('family') && (
                  <th className="p-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('family')}>
                    <div className="flex items-center gap-2">字体家族 <ArrowUpDown size={12} /></div>
                  </th>
                )}
                <th className="p-6">行内预览</th>
                {visibleColumns.has('category') && (
                  <th className="p-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('category')}>
                    <div className="flex items-center gap-2">分类 <ArrowUpDown size={12} /></div>
                  </th>
                )}
                {visibleColumns.has('license') && (
                  <th className="p-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('license')}>
                    <div className="flex items-center gap-2">授权 <ArrowUpDown size={12} /></div>
                  </th>
                )}
                {visibleColumns.has('subsets') && <th className="p-6">字符集</th>}
                {visibleColumns.has('version') && <th className="p-6">版本</th>}
                <th className="p-6 text-right w-32">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {filteredFonts.map((font) => (
                <tr 
                  key={font.family} 
                  className={`group transition-colors ${themeClasses.row} ${selectedFamilies.has(font.family) ? themeClasses.rowSelected : ''}`}
                  onClick={() => toggleSelect(font.family)}
                >
                  <td className="p-6" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(font.family)} className="text-indigo-600">
                      {selectedFamilies.has(font.family) ? <CheckSquare size={18} /> : <Square size={18} className="opacity-20 group-hover:opacity-100" />}
                    </button>
                  </td>
                  {visibleColumns.has('family') && (
                    <td className="p-6">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[15px]">{font.chineseName || font.family}</span>
                          {font.variants.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[9px] font-black">可变字重</span>
                          )}
                        </div>
                        <span className="text-[12px] opacity-40 font-mono uppercase tracking-widest">{font.family}</span>
                      </div>
                    </td>
                  )}
                  <td className="p-6">
                    <div 
                      className="text-[18px] truncate max-w-[200px] text-slate-800"
                      style={{ fontFamily: `"${font.family}", sans-serif` }}
                    >
                      {previewText}
                    </div>
                  </td>
                  {visibleColumns.has('category') && (
                    <td className="p-6">
                      <span className="px-2 py-1 rounded-lg bg-current/5 text-[11px] font-bold opacity-60">
                        {font.category === 'sans-serif' ? '无衬线' : font.category === 'serif' ? '衬线' : '展示/手写'}
                      </span>
                    </td>
                  )}
                  {visibleColumns.has('license') && (
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-emerald-500" />
                        <span className="text-[12px] font-medium opacity-70 whitespace-nowrap">{font.license || 'SIL OFL 开源'}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has('subsets') && (
                    <td className="p-6">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {font.subsets.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase">
                            {s === 'chinese-simplified' ? '简体' : '拉文'}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  {visibleColumns.has('version') && (
                    <td className="p-6">
                      <span className="text-[12px] font-mono opacity-40">{font.version}</span>
                    </td>
                  )}
                  <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-indigo-500 hover:text-white rounded-xl transition-all" title="查看原始元数据">
                        <FileJson size={14} />
                      </button>
                      <a href={`https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`} target="_blank" className="p-2 hover:bg-indigo-500 hover:text-white rounded-xl transition-all" title="查看官方源">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFonts.length === 0 && (
            <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
              <Search size={64} strokeWidth={1} />
              <p className="mt-4 text-[18px] font-black tracking-tight">未找到匹配项</p>
              <button onClick={() => { setSearchTerm(''); setFilterCategory('All'); setFilterLicense('All'); }} className="mt-4 text-[13px] font-bold text-indigo-600 underline">清除所有过滤器</button>
            </div>
          )}
        </div>

        {/* 批量操作与底部栏 */}
        <div className="relative shrink-0">
          {selectedFamilies.size > 0 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 animate-in slide-in-from-bottom-4 duration-500 z-50">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 px-6 flex items-center gap-6 ring-1 ring-white/10">
                <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
                   <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-[13px]">
                     {selectedFamilies.size}
                   </div>
                   <span className="text-white text-[13px] font-bold">已选择项</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold transition-all">
                    <Layers size={16} /> 批量对比
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold transition-all">
                    <FileJson size={16} /> 导出元数据
                  </button>
                  <button onClick={() => setSelectedFamilies(new Set())} className="p-2.5 text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className={`p-8 border-t border-current/5 flex items-center justify-between bg-current/5`}>
            <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">检索结果</span>
                <span className="text-[18px] font-black">{filteredFonts.length} <span className="text-[12px] opacity-40 font-bold">条结果</span></span>
              </div>
              <div className="hidden md:flex flex-col border-l border-current/5 pl-10">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">选中占比</span>
                <span className="text-[18px] font-black">{((selectedFamilies.size / (fonts.length || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="hidden lg:flex flex-col border-l border-current/5 pl-10">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">引擎版本</span>
                <span className="text-[18px] font-black flex items-center gap-1">
                  <Zap size={14} className="text-amber-500" /> V8 极速检索
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className={`px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-[14px] hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 active:scale-95`}>
                <Download size={18} /> 导出结果 (.CSV)
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default FontDatabaseModal;
