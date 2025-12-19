
import { Font } from "../types";
import { MOCK_FONTS } from "../constants";

const STORAGE_KEY = "fc_custom_fonts";
const ORDER_KEY = "fc_font_order";

export const dbService = {
  /**
   * 获取所有字体（合并预设与自定义）
   */
  async getAllFonts(): Promise<Font[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customFontsJson = localStorage.getItem(STORAGE_KEY);
        const customFonts: Font[] = customFontsJson ? JSON.parse(customFontsJson) : [];
        
        // 合并，确保 family 唯一，自定义覆盖预设（如果同名）
        const mockMap = new Map(MOCK_FONTS.map(f => [f.family, f]));
        customFonts.forEach(f => mockMap.set(f.family, f));
        
        const allFonts = Array.from(mockMap.values());
        
        // 应用持久化的排序
        const orderJson = localStorage.getItem(ORDER_KEY);
        if (orderJson) {
          const order: string[] = JSON.parse(orderJson);
          const orderedFonts: Font[] = [];
          
          // 按顺序添加存在的字体
          order.forEach(family => {
            const font = mockMap.get(family);
            if (font) {
              orderedFonts.push(font);
              mockMap.delete(family);
            }
          });
          
          // 将剩下的（新加入的）字体附加在最后
          return resolve([...orderedFonts, ...Array.from(mockMap.values())]);
        }
        
        resolve(allFonts);
      }, 300);
    });
  },

  /**
   * 保存排序
   */
  async saveFontOrder(order: string[]): Promise<void> {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  },

  /**
   * 保存或更新字体
   */
  async saveFont(font: Font): Promise<void> {
    return new Promise((resolve) => {
      const customFontsJson = localStorage.getItem(STORAGE_KEY);
      const customFonts: Font[] = customFontsJson ? JSON.parse(customFontsJson) : [];
      
      const index = customFonts.findIndex(f => f.family === font.family);
      if (index >= 0) {
        customFonts[index] = font;
      } else {
        customFonts.push(font);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customFonts));
      setTimeout(resolve, 200);
    });
  },

  /**
   * 删除字体
   */
  async deleteFont(family: string): Promise<void> {
    return new Promise((resolve) => {
      const customFontsJson = localStorage.getItem(STORAGE_KEY);
      const customFonts: Font[] = customFontsJson ? JSON.parse(customFontsJson) : [];
      
      const filtered = customFonts.filter(f => f.family !== family);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      
      // 同时从排序缓存中移除
      const orderJson = localStorage.getItem(ORDER_KEY);
      if (orderJson) {
        const order: string[] = JSON.parse(orderJson);
        localStorage.setItem(ORDER_KEY, JSON.stringify(order.filter(id => id !== family)));
      }
      
      setTimeout(resolve, 200);
    });
  },

  /**
   * 重置数据库
   */
  async resetDatabase(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ORDER_KEY);
    return Promise.resolve();
  }
};
