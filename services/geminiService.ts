import { GoogleGenAI } from "@google/genai";
import { Product, Transaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBusinessInsight = async (
  transactions: Transaction[],
  products: Product[],
  query: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Harap konfigurasi API Key untuk menggunakan fitur AI.";
  }

  // Summarize data to send to Gemini (prevent token overflow)
  const salesSummary = transactions.map(t => ({
    date: t.date,
    total: t.total,
    items: t.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
  })).slice(-50); // Last 50 transactions

  const inventorySummary = products.map(p => `${p.name} (Stock: ${p.stock})`).join(', ');

  const prompt = `
    Anda adalah asisten bisnis pintar untuk sebuah aplikasi kasir bernama "KasirPintar".
    
    Data Penjualan Terakhir:
    ${JSON.stringify(salesSummary)}

    Data Inventaris:
    ${inventorySummary}

    Pertanyaan User: "${query}"

    Tugas:
    Berikan analisis bisnis, saran, atau jawaban yang relevan berdasarkan data di atas.
    Gunakan bahasa Indonesia yang profesional namun ramah.
    Jika diminta saran promosi, berikan ide kreatif.
    Jika diminta analisis performa, gunakan data penjualan.
    Jawab dengan singkat dan padat (maksimal 2 paragraf).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Maaf, saya tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Coba lagi nanti.";
  }
};