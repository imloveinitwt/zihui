
import React, { useEffect } from 'react';
import { X, Github, Heart, Code2, Users, FilePlus, ShieldCheck, Mail, ArrowRight, Check, Terminal } from 'lucide-react';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

const ContributionModal: React.FC<ContributionModalProps> = ({ isOpen, onClose, theme = 'classic' }) => {
  const isDarkTheme = theme === 'midnight';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    stepBg: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    textMuted: isDarkTheme ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-4xl h-full max-h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        
        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black tracking-tight">贡献者指南</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">Build the Future of Typography Together</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 opacity-40 hover:opacity-100 transition-opacity">
            <X size={28} />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="space-y-16">
            <section className="space-y-4">
               <h3 className="text-[28px] font-black">为什么加入我们？</h3>
               <p className={`${themeClasses.textMuted} leading-relaxed max-w-2xl text-[16px]`}>
                 字绘.Lab 不仅仅是一个工具，它是一个由设计师、开发者和字体发烧友组成的社区。每一行代码、每一款字体、每一个翻译的改进，都在帮助全世界的创作者。
               </p>
               <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-[13px]">
                     <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center"><Heart size={16} /></div> 100% 开源精神
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-[13px]">
                     <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center"><Github size={16} /></div> 全球社区展示
                  </div>
               </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`p-8 rounded-[32px] border ${themeClasses.stepBg} space-y-6`}>
                  <div className="flex items-center gap-3">
                     <FilePlus className="text-emerald-600" />
                     <h4 className="font-black text-[18px]">提交新字体</h4>
                  </div>
                  <ul className="space-y-3">
                    {['确保字体符合 SIL OFL 开源协议', '准备高质量的预览样张 (.PNG)', '填写作者与设计愿景元数据'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px]">
                        <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                        <span className="opacity-60">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold text-[13px] hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                    <Mail size={16} /> 发送至收录邮箱
                  </button>
               </div>

               <div className={`p-8 rounded-[32px] border ${themeClasses.stepBg} space-y-6`}>
                  <div className="flex items-center gap-3">
                     <Code2 className="text-indigo-600" />
                     <h4 className="font-black text-[18px]">代码与功能贡献</h4>
                  </div>
                  <ul className="space-y-3">
                    {['Fork 我们的 GitHub 仓库', '创建新的 Feature 分支', '提交 Pull Request 并通过审核'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px]">
                        <Check size={16} className="text-indigo-600 mt-1 shrink-0" />
                        <span className="opacity-60">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-[13px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Github size={16} /> 前往 GitHub 仓库
                  </button>
               </div>
            </div>

            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <Terminal className="text-indigo-600" />
                  <h4 className="font-black text-[18px]">快速提交 PR</h4>
               </div>
               <div className={`p-6 rounded-2xl bg-slate-950 font-mono text-[13px] text-slate-300 leading-relaxed overflow-x-auto`}>
{`# 克隆仓库
git clone https://github.com/fontcanvas/fontcanvas-lab.git

# 创建功能分支
git checkout -b feat/your-awesome-feature

# 提交更改
git commit -m "feat: add amazing new feature"

# 推送并创建 PR
git push origin feat/your-awesome-feature`}
               </div>
            </section>
          </div>
        </div>

        <footer className={`p-8 border-t border-current/5 flex items-center justify-between bg-current/5 shrink-0`}>
           <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" size={18} />
              <span className="text-[12px] font-bold opacity-30">感谢所有参与构建字绘生态的伙伴。</span>
           </div>
           <button onClick={onClose} className="text-[13px] font-bold text-indigo-600 hover:underline">
              我有疑问，联系社区经理 <ArrowRight size={14} className="inline ml-1" />
           </button>
        </footer>
      </div>
    </div>
  );
};

export default ContributionModal;
