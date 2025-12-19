
import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, AlertCircle, Sparkles, Check, Star, Smile, Frown, Meh, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

type FeedbackType = 'suggestion' | 'bug' | 'design' | 'other';

const FEEDBACK_TYPES: { id: FeedbackType; label: string; icon: React.ReactNode }[] = [
  { id: 'suggestion', label: '功能建议', icon: <Sparkles size={16} /> },
  { id: 'bug', label: '问题反馈', icon: <AlertCircle size={16} /> },
  { id: 'design', label: '设计吐槽', icon: <Smile size={16} /> },
  { id: 'other', label: '其他', icon: <MessageSquare size={16} /> },
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setContent('');
      setRating(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    // 模拟 API 调用
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    input: isDarkTheme ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600',
    typeBtn: isDarkTheme ? 'border-slate-800 hover:border-slate-600 bg-slate-900' : 'border-slate-200 hover:border-slate-300 bg-white',
    typeBtnActive: isDarkTheme ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-indigo-600 bg-indigo-50 text-indigo-700',
    label: 'text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-2 block',
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden expand-enter ${themeClasses.modal}`}>
        {!isSuccess ? (
          <>
            <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold">意见反馈</h2>
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Feedback & Suggestions</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                <X size={24} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-3">
                <span className={themeClasses.label}>反馈类型 / TYPE</span>
                <div className="grid grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-bold transition-all ${
                        type === t.id ? themeClasses.typeBtnActive : themeClasses.typeBtn
                      }`}
                    >
                      <span className="opacity-40">{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className={themeClasses.label}>体验评价 / RATING</span>
                <div className="flex gap-4 justify-between px-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className={`transition-all transform hover:scale-125 ${
                        rating >= val ? 'text-amber-400' : 'text-slate-300 opacity-40'
                      }`}
                    >
                      {val === 1 && <Frown size={28} />}
                      {val === 2 && <Meh size={28} />}
                      {val === 3 && <Smile size={28} />}
                      {val === 4 && <Star size={28} fill={rating >= 4 ? 'currentColor' : 'none'} />}
                      {val === 5 && <Heart size={28} fill={rating >= 5 ? 'currentColor' : 'none'} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className={themeClasses.label}>详细描述 / DESCRIPTION</span>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="告诉我们您的想法，或者描述您遇到的问题..."
                  className={`w-full h-32 px-4 py-3 rounded-xl border outline-none transition-all resize-none text-[14px] leading-relaxed ${themeClasses.input}`}
                />
              </div>

              <div className="space-y-3">
                <span className={themeClasses.label}>联系邮箱 / EMAIL (OPTIONAL)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="如果您希望我们回复您..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-[14px] ${themeClasses.input}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className={`w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> 发送反馈
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="p-16 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 mb-4 scale-110">
              <Check size={40} strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h3 className="text-[22px] font-bold">感谢您的声音！</h3>
              <p className={`text-[14px] opacity-60 leading-relaxed max-w-xs mx-auto`}>
                您的反馈已送达字绘实验室。我们将认真对待每一条建议，持续优化您的排版体验。
              </p>
            </div>
            <button
              onClick={onClose}
              className={`mt-4 px-8 py-3 rounded-xl border font-bold text-[14px] transition-all hover:bg-slate-50 active:scale-95 ${
                isDarkTheme ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              返回实验室
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
