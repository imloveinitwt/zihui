
import { Font } from "../types";
import { MOCK_FONTS } from "../constants";

const STORAGE_KEY = "fc_custom_fonts";

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
        resolve(Array.from(mockMap.values()));
      }, 300);
    });
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
      setTimeout(resolve, 200);
    });
  },

  /**
   * 重置数据库
   */
  async resetDatabase(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    return Promise.resolve();
  }
};
