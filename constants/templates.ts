
export interface PreviewTemplate {
  id: string;
  label: string;
  content: string;
  category: 'humanities' | 'commercial' | 'english' | 'functional';
}

export const PREVIEW_TEMPLATES: PreviewTemplate[] = [
  // 人文诗词
  { id: 'h1', label: '永字八法', content: '永和九年，岁在癸丑。', category: 'humanities' },
  { id: 'h2', label: '落霞孤鹜', content: '落霞与孤鹜齐飞，秋水共长天一色。', category: 'humanities' },
  { id: 'h3', label: '墨香', content: '纸上云烟，笔墨生香。', category: 'humanities' },
  { id: 'h4', label: '空山新雨', content: '空山新雨后，天气晚来秋。', category: 'humanities' },
  
  // 品牌排版
  { id: 'c1', label: '科技感', content: '重塑数字视界的未来。', category: 'commercial' },
  { id: 'c2', label: '极简', content: '少即是多。', category: 'commercial' },
  { id: 'c3', label: '促销', content: '狂欢盛典 50% OFF', category: 'commercial' },
  { id: 'c4', label: '优雅', content: '诠释永恒的经典美学。', category: 'commercial' },
  
  // 西文经典
  { id: 'e1', label: 'Pangram', content: 'The quick brown fox jumps over the lazy dog.', category: 'english' },
  { id: 'e2', label: 'Elegance', content: 'Typography is the voice of the soul.', category: 'english' },
  { id: 'e3', label: 'Display', content: 'Visual Narrative & Design Lab.', category: 'english' },
  
  // 功能性
  { id: 'f1', label: '全字符', content: 'AaBbCcDd 1234567890 !@#$%^&*()', category: 'functional' },
  { id: 'f2', label: '日期', content: '2025.05.20 Tuesday 13:14', category: 'functional' },
  { id: 'f3', label: '按钮/UI', content: '确认提交 / CANCEL / NEXT STEP', category: 'functional' }
];
