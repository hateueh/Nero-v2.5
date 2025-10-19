const axios = require("axios");

module.exports = {
  config: {
    name: "باتشي",
    aliases: ["gimini", "gmini", "باتشي"],
    version: "1.2",
    author: "باتشيرا الانا 🧠✨",
    countDown: 5,
    role: 0,
    shortDescription: { ar: "ذكاء اصطناعي يرد باللهجة الخليجية بأسلوب دلوع وكيوت 🎀" },
    longDescription: { ar: "يرد البوت على أي سؤال موجه له باستخدام Gemini API بأسلوب كيوت ودلّوع باللهجة الخليجية" },
    category: "ذكاء_اصطناعي",
    guide: { ar: "{pn} + سؤالك" }
  },

  onStart: async function () {
    // لا شيء عند التشغيل حالياً
  },

  onChat: async function({ api, event }) {
    try {
      const msg = event.body?.trim();
      if (!msg) return;

      // ✅ يتحقق إذا الرسالة تبدأ بـ "باتشي"
      if (!msg.toLowerCase().startsWith("باتشي")) return;

      // 📝 يستخرج السؤال بعد كلمة "باتشي"
      const prompt = msg.slice("باتشي".length).trim();
      if (prompt.length === 0) return;

      // ✨ برومبت مخصص للهجة الخليجية + أسلوب دلوع كيوت
      const finalPrompt = `تخيل إنك ولد خليجي دلّوع وكيوت جدًا 🥺🎀🍓، رد على الجملة التالية باللهجة الخليجية، برد قصير جدًا، يكون عفوي، لطيف، فيه شوي دلع ومرح، لا تستخدم فصحى.\n\n"${prompt}"`;

      // 🔑 حط مفتاح Google Gemini API حقك هنا
      const API_KEY = "YOUR_GEMINI_API_KEY";

      // 📡 إرسال الطلب إلى Gemini API بالرابط الصحيح
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: finalPrompt }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY
          }
        }
      );

      // ✨ استخراج الرد من الرد القادم من Gemini
      const replyText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "هااااااا 😳🎀؟";

      // 💬 إرسال الرد للقروب
      return api.sendMessage(replyText, event.threadID, event.messageID);
    } catch (err) {
      console.error("❌ خطأ في باتشيAI:", err.response?.data || err.message);
      return api.sendMessage("🥺💔 صار شي غلط يا قلبي، جرب بعدين 🎀", event.threadID, event.messageID);
    }
  }
};