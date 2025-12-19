
import React, { useState, useEffect } from 'react';
import { X, Heart, Coffee, Trophy, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const SPONSOR_TIERS = [
  {
    id: 'coffee',
    name: '一杯咖啡',
    price: '￥18',
    icon: <Coffee size={24} />,
    color: 'text-amber-500',
    borderColor: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    benefits: ['获得“早起咖啡”专属勋章', '个人中心展示赞助状态', '感谢名单收录']
  },
  {
    id: 'supporter',
    name: '核心支持者',
    price: '￥99',
    icon: <Heart size={24} />,
    color: 'text-indigo-600',
    borderColor: 'border-indigo-600/20',
    bg: 'bg-indigo-600/5',
    isPopular: true,
    benefits: ['所有预览插件永久使用', '新字体发布 48小时 优先下载', '加入私人社群', '1对1 排版方案咨询']
  },
  {
    id: 'partner',
    name: '战略伙伴',
    price: '￥299',
    icon: <Trophy size={24} />,
    color: 'text-rose-600',
    borderColor: 'border-rose-600/20',
    bg: 'bg-rose-600/5',
    benefits: ['首页底部品牌 Logo 展示', '企业级字体合规审计', '年度字体趋势定制报告', '高级技术支持']
  }
];

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const [selectedTier, setSelectedTier] = useState('supporter');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSponsor = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const currentTier = SPONSOR_TIERS.find(t => t.id === selectedTier)!;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    card: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200',
    subText: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
    label: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 block',
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        {!isSuccess ? (
          <div className="flex flex-col md:flex-row h-full">
            {/* 左侧：等级选择 */}
            <div className={`w-full md:w-[450px] p-8 md:p-12 space-y-8 border-b md:border-b-0 md:border-r ${isDarkTheme ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Star size={20} fill="currentColor" />
                  <span className="text-[12px] font-black uppercase tracking-widest">支持我们</span>
                </div>
                <h2 className="text-[28px] font-black leading-tight">赞助实验室</h2>
                <p className={`text-[14px] ${themeClasses.subText}`}>您的每一份支持，都将用于维护服务器和收录更多优质开源字体。</p>
              </div>

              <div className="space-y-4">
                {SPONSOR_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all relative group ${
                      selectedTier === tier.id 
                        ? `${tier.borderColor} ${tier.bg} shadow-lg ring-2 ring-current ring-offset-2 ${isDarkTheme ? 'ring-offset-slate-950' : 'ring-offset-white'}` 
                        : 'border-transparent hover:bg-slate-500/5'
                    }`}
                  >
                    {tier.isPopular && (
                      <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">最受欢迎</span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <div className={`flex items-center gap-3 font-bold ${selectedTier === tier.id ? tier.color : 'opacity-40'}`}>
                        {tier.icon} {tier.name}
                      </div>
                      <span className="text-[18px] font-black">{tier.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className={`p-4 rounded-xl border border-dashed ${isDarkTheme ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'} flex items-start gap-3`}>
                <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
                <p className="text-[11px] opacity-50 leading-relaxed font-medium">所有赞助均为自愿行为。我们将通过透明的财务公示向社区展示资金用途。</p>
              </div>
            </div>

            {/* 右侧：详情与操作 */}
            <div className="flex-grow p-8 md:p-12 flex flex-col bg-current/5">
              <div className="flex-grow space-y-8">
                <div className="space-y-4">
                  <h3 className={themeClasses.label}>赞助权益</h3>
                  <div className="space-y-3">
                    {currentTier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={`w-5 h-5 rounded-full ${currentTier.bg} ${currentTier.color} flex items-center justify-center`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className="text-[14px] font-bold">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={themeClasses.label}>支付方式</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} hover:border-indigo-500`}>
                       <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><Zap size={18} fill="currentColor" /></div>
                       <span className="text-[12px] font-bold">微信支付</span>
                    </button>
                    <button className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} hover:border-indigo-500`}>
                       <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white"><Sparkles size={18} fill="currentColor" /></div>
                       <span className="text-[12px] font-bold">支付宝</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button
                  onClick={handleSponsor}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-[15px] flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50`}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>确认赞助 {currentTier.price} <ArrowRight size={18} /></>
                  )}
                </button>
                <p className="text-center text-[11px] opacity-30 font-bold uppercase tracking-widest">安全 SSL 加密交易</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-500/20 relative z-10 scale-110">
                <Heart size={48} fill="currentColor" className="animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20" />
            </div>
            <div className="space-y-3">
              <h3 className="text-[32px] font-black tracking-tighter">感谢您的每一分温暖！</h3>
              <p className={`text-[16px] max-w-sm mx-auto opacity-60 leading-relaxed font-medium`}>
                您的慷慨赞助已收到。每一份暖意都是字绘实验室前行的动力。我们将在 24 小时内为您点亮专属勋章。
              </p>
            </div>
            <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
               <div className="text-left">
                  <p className="text-[11px] font-black opacity-30 uppercase tracking-widest">您的专属订单号</p>
                  <p className="text-[14px] font-mono font-bold">字绘-赞助-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
               </div>
            </div>
            <button
              onClick={onClose}
              className="px-12 py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-2xl font-bold text-[14px] transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              返回主页
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorModal;
