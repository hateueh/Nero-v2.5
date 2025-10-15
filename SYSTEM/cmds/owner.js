module.exports = {
    config: {
        name: "من_انت",
        aliases: ["معلومات عنك" ],
        version: "1.1", 
        author: "باتشيرا الانا",
        countDown: 5,
        role: 0,
        shortDescription: { ar: "معلومات عن صانع البوت" },
        longDescription: { ar: "يعرض معلومات تعريفية عن البوت وصانعه مع دعم متعدد اللغات" },
        category: "عام",
        guide: { ar: "{pn}" }
    },

    langs: {
        ar: {
            botInfo: `
🌟 〘 Bachi BOT 〙 🌟
━━━━━━━━━━━━━━━━━━

👑 صانع البوت: باتشيرا الانا
🤖 الاسم: Bachi

أنا بوت تفاعلي أستطيع التفاعل مع الرسائل 💬  
كما أوفر أدوات قوية للمشرفين ⚔️

✨ الميزات الرئيسية:
🚀 **أداء عالي:** يعمل البوت بكفاءة وسرعة بفضل بيئة Node.js.  
🐐 **توافق مع GoatBot:** تم تصميمي لأكون متوافقًا مع أوامر ومشاريع GoatBot القديمة، مما يسهل عملية النقل والتحديث.  
🛠️ **أدوات إدارة متكاملة:** أوامر قوية للمشرفين مثل (ban)، (warn)، (restart).  
⚙️ **قابلية للتخصيص:** يمكنك تعديل الإعدادات بسهولة عبر ملفات config.  
🎉 **أوامر ترفيهية:** لإضفاء جو من المرح على المحادثة.  
📞 **نظام تواصل:** يمكن للأعضاء التواصل مع الإدارة بسرية تامة.  
🔒 **حماية الكود:** تم تشفير الملفات الأساسية لحماية حقوق المطور.

━━━━━━━━━━━━━━━━━━
⚡ تم البرمجة بكل حب 💖 من قبل باتشيرا الانا
            `
        }
    },

    onStart: async function({ api, event, getLang }) {
        try {
            const botInfo = getLang("botInfo");
            return api.sendMessage(botInfo, event.threadID, event.messageID);
        } catch (error) {
            console.error("Error in owner command:", error);
            return api.sendMessage("⚠️ حدث خطأ أثناء تنفيذ الأمر. حاول مرة أخرى لاحقًا.", event.threadID, event.messageID);
        }
    }
};