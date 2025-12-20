
export interface PreviewTemplate {
  id: string;
  label: string;
  content: string;
  category: 'humanities' | 'commercial' | 'english' | 'functional' | 'lifestyle';
}

export const PREVIEW_TEMPLATES: PreviewTemplate[] = [
  // --- 人文诗词 & 文学金句 ---
  { id: 'h1', label: '兰亭序', content: '永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭。', category: 'humanities' },
  { id: 'h2', label: '秋水', content: '落霞与孤鹜齐飞，秋水共长天一色。', category: 'humanities' },
  { id: 'h3', label: '墨香', content: '纸上云烟，笔墨生香。', category: 'humanities' },
  { id: 'h4', label: '山河', content: '白日依山尽，黄河入海流。', category: 'humanities' },
  { id: 'h5', label: '汪国真', content: '既然选择了远方，便只顾风雨兼程。', category: 'humanities' },
  { id: 'h6', label: '顾城', content: '草在结它的种子，风在摇它的叶子，我们站着，不说话，就十分美好。', category: 'humanities' },
  { id: 'h7', label: '诗经', content: '青青子衿，悠悠我心。', category: 'lifestyle' },
  
  // --- 品牌排版 & 商业宣传 ---
  { id: 'c1', label: '科技感', content: '科技致美，感官觉醒。重塑数字视界的未来。', category: 'commercial' },
  { id: 'c2', label: '极简主义', content: '少即是多。Less is more.', category: 'commercial' },
  { id: 'c3', label: '电商促销', content: '年度狂欢：全场低至 3 折起，买一送一！', category: 'commercial' },
  { id: 'c4', label: '奢侈品牌', content: '源自 1984，匠心传承，诠释永恒的经典美学。', category: 'commercial' },
  { id: 'c5', label: '口号', content: '因文字而生，为创意而动。', category: 'commercial' },
  { id: 'c6', label: '房产/建筑', content: '筑梦生活，定义城市新高度。', category: 'commercial' },
  
  // --- 西文经典 (Pangrams & Quotes) ---
  { id: 'e1', label: '经典全字母', content: 'The quick brown fox jumps over the lazy dog.', category: 'english' },
  { id: 'e2', label: '酒瓶全字母', content: 'Pack my box with five dozen liquor jugs.', category: 'english' },
  { id: 'e3', label: '设计哲学', content: 'Typography is the voice of the soul.', category: 'english' },
  { id: 'e4', label: '乔布斯', content: 'Stay Hungry, Stay Foolish.', category: 'english' },
  { id: 'e5', label: '字母表', content: 'ABCDEFGHIJKLMN OPQRSTUVWXYZ abcdefghijklmn opqrstuvwxyz', category: 'english' },
  { id: 'e6', label: '包豪斯', content: 'Form Follows Function.', category: 'english' },
  
  // --- 功能性 & 界面开发 ---
  { id: 'f1', label: '全字符测试', content: 'AaBbCcDd 1234567890 !@#$%^&*()_+ {}|:"<>?~', category: 'functional' },
  { id: 'f2', label: '代码片段', content: 'const font = "Inter"; console.log(`${font} Lab`);', category: 'functional' },
  { id: 'f3', label: 'UI 状态', content: '正在下载 (85%)... 请稍后 / CANCEL / NEXT STEP', category: 'functional' },
  { id: 'f4', label: '金融数值', content: 'Total: ¥12,450.00 (+12.5%) / ID: 0987-654-321', category: 'functional' },
  { id: 'f5', label: '时间日期', content: '2025.05.20 Tuesday 13:14:59 GMT+8', category: 'functional' },
  { id: 'f6', label: '列表排列', content: '1. 界面设计\n2. 交互逻辑\n3. 品牌调性', category: 'functional' },

  // --- 治愈生活 & 社交媒体 ---
  { id: 'l1', label: '早安', content: '愿你眼中有光，心中有爱，活成自己喜欢的模样。', category: 'lifestyle' },
  { id: 'l2', label: '旅行', content: '如果不去接触未知，我们的世界将止步于此。', category: 'lifestyle' },
  { id: 'l3', label: '阅读', content: '读书，是为了遇见更好的自己。', category: 'lifestyle' },
  { id: 'l4', label: '咖啡时光', content: '生活就像一杯拿铁，苦涩中带着一丝回甘。', category: 'lifestyle' },
];
