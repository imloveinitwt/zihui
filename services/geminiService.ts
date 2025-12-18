
import { GoogleGenAI, Type } from "@google/genai";
import { FontPairing, Font, Category } from "../types";

// Always initialize with named parameter and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFontPairing = async (prompt: string): Promise<FontPairing> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `请为以下描述的项目建议专业的字体搭配： "${prompt}"。
      返回字体名称（必须是流行的 Google Fonts，如 Roboto, Open Sans, Playfair Display, Montserrat 等），
      并提供中文的推荐理由和风格描述。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heading: { type: Type.STRING, description: "建议的标题字体名称" },
            body: { type: Type.STRING, description: "建议的正文字体名称" },
            reason: { type: Type.STRING, description: "为什么这些字体适合搭配在一起（中文）" },
            vibe: { type: Type.STRING, description: "搭配的整体氛围风格（中文）" },
          },
          required: ["heading", "body", "reason", "vibe"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini 错误:", error);
    return {
      heading: "Playfair Display",
      body: "Roboto",
      reason: "经典的标题衬线体与清爽易读的无衬线体正文完美契合。",
      vibe: "优雅且专业",
    };
  }
};

export const discoverFonts = async (prompt: string): Promise<Partial<Font>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `根据描述 "${prompt}"，发现并列举 3-5 个来自 Google Fonts 的字体。
      如果是中文字体，请提供其常用的中文名称（如：思源黑体）。
      请确保这些字体名称在 Google Fonts 库中真实存在。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              family: { type: Type.STRING, description: "字体家族名称" },
              chineseName: { type: Type.STRING, description: "可选的中文名称（针对中文字体）" },
              category: { type: Type.STRING, description: "分类，必须是 sans-serif, serif, display, handwriting, monospace 之一" },
              description: { type: Type.STRING, description: "简短中文介绍" },
            },
            required: ["family", "category", "description"],
          },
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Discover Fonts Error:", error);
    return [];
  }
};
