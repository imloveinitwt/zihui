
import React, { useEffect } from 'react';
import { X, Shield, FileText, CheckCircle, Scale, ScrollText, ShieldCheck } from 'lucide-react';

export type LegalType = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType;
  theme?: string;
}

const LEGAL_CONTENT = {
  privacy: {
    title: '隐私保护政策',
    subtitle: 'Privacy Protection Policy',
    icon: <ShieldCheck size={20} />,
    sections: [
      {
        title: '1. 信息搜集',
        content: '字绘.Lab 致力于保护您的隐私。我们仅在您主动注册账户、订阅周刊或提交反馈时搜集必要的信息（如用户名、电子邮箱）。我们不会在未经您许可的情况下搜集您的个人敏感数据。'
      },
      {
        title: '2. 数据使用',
        content: '搜集的信息仅用于：验证您的身份以提供个性化收藏功能；发送您订阅的周刊动态；改进我们的字体推荐算法以及响应您的技术支持请求。'
      },
      {
        title: '3. Cookie 与 追踪',
        content: '我们使用本地存储（LocalStorage）来保存您的应用偏好设置（如主题风格、字体对比列表）。我们不使用第三方追踪 Cookie 进行广告投放。'
      },
      {
        title: '4. 第三方服务',
        content: '本站集成了 Google Fonts API 用于字体预览渲染，以及 Gemini API 用于 AI 配对建议。这些服务可能会根据其自身的隐私政策搜集非身份标识的技术信息。'
      },
      {
        title: '5. 数据安全',
        content: '我们采用行业标准的加密技术保护您的数据。虽然没有绝对安全的互联网传输，但我们会持续优化安全架构以防范非法访问。'
      }
    ]
  },
  terms: {
    title: '用户服务协议',
    subtitle: 'Terms of Service',
    icon: <ScrollText size={20} />,
    sections: [
      {
        title: '1. 服务说明',
        content: '字绘.Lab (FontCanvas) 是一个字体预览、对比与发现平台。我们提供字体信息的聚合展示与在线测试环境。'
      },
      {
        title: '2. 知识产权',
        content: '本站收录的字体多为开源或第三方授权免费商用字体。字体的所有权与最终解释权归原作者或其所属机构所有。用户在使用字体时，必须严格遵守各字体对应的开源协议（如 SIL OFL）。'
      },
      {
        title: '3. 用户行为规范',
        content: '用户不得利用本站服务进行任何非法活动，包括但不限于利用 AI 顾问生成违规内容、对本站进行恶意攻击或未经许可抓取核心数据。'
      },
      {
        title: '4. 免责声明',
        content: '由于技术限制或字体源更新，本站展示的字体信息可能存在细微滞后。我们不对因使用或无法使用本站服务而导致的任何直接或间接损失承担法律责任。'
      },
      {
        title: '5. 协议变更',
        content: '我们保留随时修改本协议的权利。重大变更将通过站内公告或订阅邮件通知。继续使用本服务即表示您接受修订后的条款。'
      }
    ]
  }
};

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type, theme = 'classic' }) => {
  const isDarkTheme = theme === 'midnight';
  const content = LEGAL_CONTENT[type];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const themeClasses = {
    modal: isDarkTheme ? 'bg-slate-950 text-white' : 'bg-white text-slate-900',
    header: isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100',
    card: isDarkTheme ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100',
    text: isDarkTheme ? 'text-slate-400' : 'text-slate-600',
    accent: 'bg-indigo-600',
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className={`relative w-full max-w-3xl max-h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col expand-enter ${themeClasses.modal}`}>
        
        {/* Header */}
        <header className={`p-8 border-b ${themeClasses.header} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${themeClasses.accent} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {content.icon}
            </div>
            <div>
              <h2 className="text-[18px] font-bold">{content.title}</h2>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">{content.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
            <X size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
          <div className="space-y-8">
            <div className="prose prose-slate max-w-none">
              <p className={`text-[15px] font-medium italic ${themeClasses.text} border-l-4 border-indigo-500/30 pl-4 py-2`}>
                最后更新日期：2025年5月10日
              </p>
            </div>

            {content.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-[16px] font-bold flex items-center gap-2">
                   <CheckCircle size={16} className="text-indigo-600" />
                   {section.title}
                </h3>
                <p className={`text-[14px] leading-relaxed ${themeClasses.text}`}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className={`p-8 rounded-2xl border ${themeClasses.card} space-y-4`}>
             <div className="flex items-center gap-3">
                <Scale className="text-indigo-600" size={20} />
                <h4 className="text-[15px] font-bold">合规说明</h4>
             </div>
             <p className={`text-[13px] ${themeClasses.text}`}>
               本站坚持透明化、合规化运营。如果您对以上条款有任何疑问，或者认为本站内容侵犯了您的合法权益，请通过 <strong>legal@fontcanvas.lab</strong> 与我们联系。
             </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-current/5 flex justify-center bg-current/5">
           <button 
             onClick={onClose}
             className="px-12 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-[14px] hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
           >
             我已阅读并知晓
           </button>
        </footer>
      </div>
    </div>
  );
};

export default LegalModal;
