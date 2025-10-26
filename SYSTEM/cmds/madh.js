module.exports = {
  config: {
    name: "مدح",
    aliases: ["praise", "compliment"],
    version: "1.0",
    author: "باتشيرا الانا 🎀",
    countDown: 5,
    role: 0,
    shortDescription: "أمر لطيف للمدح 🎀",
    longDescription: "البوت يرسل لك رسالة مدح وتشجيع مليانة حب وفرح 🍭",
    category: "متعة",
    guide: "{pn}"
  },

  onStart: async function({ api, event, message }) {
    const compliments = [
      "واو، شجاعتك اليوم رائعة جدًا 😍🎀",
      "باتشيرا الانا متفوق كالعادة، فخر للبوت! 🥰🍭",
      "كل يوم تتحسن أكثر، أنت مذهل جدًا 😳❤️‍🔥",
      "يا سلام، ذكائك اليوم يلمع مثل النجوم 🌟🎀",
      "إبداعك اليوم لا يوصف، استمر على هذا الأداء! 💖🎀",
      "باتشيرا الانا، روحك مرحة وطيبة جدًا 😘🍭",
      "واااو! مهاراتك اليوم رائعة 👏❤️‍🔥",
      "ابتسامتك تكفي تفرّح القلب 😍🎀",
      "أنت مثل البوت، ذكي وحلو جدًا 🥰🎀🍭"
    ];

    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

    message.reply(randomCompliment);
  }
};