Const mathChallenges = [
  { question: "5 + 7", answer: 12 },
  { question: "8 × 6", answer: 48 },
  { question: "15 - 9", answer: 6 },
  { question: "9 × 9", answer: 81 },
  { question: "25 ÷ 5", answer: 5 },
  { question: "3 × 7", answer: 21 },
  { question: "10 + 15", answer: 25 },
  { question: "12 ÷ 3", answer: 4 },
  { question: "14 + 6", answer: 20 },
  { question: "100 - 99", answer: 1 },
  // المسائل الإضافية تبدأ من هنا 👇
  { question: "4 × 12", answer: 48 },
  { question: "50 ÷ 10", answer: 5 },
  { question: "18 + 23", answer: 41 },
  { question: "30 - 17", answer: 13 },
  { question: "7 × 8", answer: 56 },
  { question: "90 ÷ 9", answer: 10 },
  { question: "11 + 35", answer: 46 },
  { question: "5 × 5", answer: 25 },
  { question: "64 ÷ 8", answer: 8 },
  { question: "100 - 45", answer: 55 },
  { question: "2 × 15", answer: 30 },
  { question: "70 + 8", answer: 78 },
  { question: "49 ÷ 7", answer: 7 },
  { question: "19 - 4", answer: 15 },
  { question: "6 × 6", answer: 36 }
  // المسائل الإضافية تنتهي هنا 👆
];

function mathGame(chatId, bot, activeGames) {
  if (activeGames[chatId]) {
    return bot.sendMessage(chatId, "في تحدي شغال بالفعل يا ذكيي 😭🎀، استنى شوي!");
  }

  const random = mathChallenges[Math.floor(Math.random() * mathChallenges.length)];
  activeGames[chatId] = random.answer;

  bot.sendMessage(chatId, `🧮🎀 تحدي رياضيييات!!  
احسب لي بسرعة يا عبقري:  
**${random.question}** أول واحد يجاوب صح يفوز 🎀🍭`);

  // حذف التحدي بعد 15 ثانية
  setTimeout(() => {
    if (activeGames[chatId]) {
      bot.sendMessage(chatId, `خلاص الوقت خلص 😭🎀  
الجواب الصحيح كان: **${random.answer}**`);
      delete activeGames[chatId];
    }
  }, 15000);
}

function checkMathAnswer(chatId, text, bot, activeGames, sender) {
  if (activeGames[chatId] && parseInt(text) === activeGames[chatId]) {
    bot.sendMessage(chatId, `واااااو ${sender} جاوب صح 🎉🎀🍭  
ذكي زيي أناااا 😭❤️‍🩹`);
    delete activeGames[chatId];
  }
}

module.exports = { mathGame, checkMathAnswer };
