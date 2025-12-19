
import { Trend } from '../types';

const TRENDS_DATA: Trend[] = [
  {
    id: 'dynamic',
    title: '动力学可变性 (Dynamic Variablity)',
    desc: '不仅是粗细的变化，轴向动画将使字体在交互中像液体一样流动。',
    tag: 'Interactive',
    color: 'from-indigo-600 to-blue-500',
    cases: [
      {
        title: '生物感应导航',
        brand: 'AeroMotion App',
        description: '当用户心率升高时，字体轴自动向 Ultra-Bold 偏移，增强视觉压迫感。',
        features: ['呼吸感字重', '实时交互轴', '流畅变形'],
        parameters: { 'Weight Axis': '100-900', 'Optical Size': '6pt-72pt', 'Fluidity': '0.8' },
        previewColor: 'bg-indigo-600'
      },
      {
        title: '流体反馈界面',
        brand: 'AquaOS',
        description: '点击按钮时，文字产生类似于水滴落入水面的涟漪扩散效果。',
        features: ['贝塞尔变形', '动态字距', '碰撞检测'],
        parameters: { 'Slant': '-10deg to 10deg', 'Softness': '1.2', 'Speed': '300ms' }
      }
    ]
  },
  {
    id: 'retro',
    title: '复古极繁主义 (Retro Maximalism)',
    desc: '回归 70 年代的衬线美学，结合极高对比度和夸张的连笔。',
    tag: 'Visual',
    color: 'from-rose-600 to-pink-500',
    cases: [
      {
        title: '经典重构封面',
        brand: 'Vogue Lab Edition',
        description: '将 18 世纪的排版规范与荧光色碰撞，创造出具有冲突感的高端时尚视觉。',
        features: ['极高对比度', '艺术化连笔', '装饰性字形'],
        parameters: { 'Contrast': 'Max', 'Spacing': '-0.05em', 'Ligatures': 'All' },
        previewColor: 'bg-rose-500'
      }
    ]
  },
  {
    id: 'ai',
    title: 'AI 生成伪字形 (AI Artifacts)',
    desc: '故意保留 AI 生成过程中的“瑕疵”，创造出超越人类传统逻辑的怪诞笔画。',
    tag: 'Future',
    color: 'from-amber-600 to-orange-500',
    cases: [
      {
        title: '未知维度身份',
        brand: 'Parallel Music Fest',
        description: '利用生成式对抗网络产生的非对称笔画，打破平衡美学，塑造绝对的独特性。',
        features: ['非对称结构', '液态边缘', '随机生成'],
        parameters: { 'Distortion': 'High', 'Complexity': 'Level 4', 'Style': 'Generative' },
        previewColor: 'bg-amber-500'
      }
    ]
  },
  {
    id: 'pixel',
    title: '无边界像素 (Borderless Pixels)',
    desc: '高分辨率屏幕下的低分辨率致敬，将像素风推向艺术排版的中心。',
    tag: 'Art',
    color: 'from-emerald-600 to-teal-500',
    cases: [
      {
        title: '新复古数字界面',
        brand: 'PixelMind Studio',
        description: '在大屏幕上展示巨大的、清晰的单色像素块，利用排列组合模拟现代主义网格。',
        features: ['硬边缘', '网格对齐', '高饱和度单色'],
        parameters: { 'Grid Unit': '4px', 'Anti-alias': 'None', 'Theme': 'Cyber' },
        previewColor: 'bg-emerald-600'
      }
    ]
  }
];

export const contentService = {
  async getTrends(): Promise<Trend[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(TRENDS_DATA), 200);
    });
  },
  async getTrendById(id: string): Promise<Trend | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(TRENDS_DATA.find(t => t.id === id)), 100);
    });
  }
};
