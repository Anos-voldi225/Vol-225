const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userName, userId, messageID) {
  const services = [
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = `🌹ℝᎧᎥ ᗪᗴᗰᗝᑎ 𝐀𝐈🌹 \n●═══════════●\n🌹𝐬𝐚𝐥𝐮𝐭 𝐭𝐨𝐢,
𝐩𝐨𝐮𝐫𝐪𝐮𝐨𝐢 𝐭𝐮 𝐦'𝐚𝐩𝐩𝐞𝐥𝐞𝐬🥰
𝐯𝐞𝐮𝐱 𝐭𝐮 𝐦𝐞 𝐝𝐞𝐦𝐦𝐚𝐧𝐝𝐞𝐫 𝐪𝐮𝐞𝐥𝐥𝐞 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧!`;
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Passer au service suivant
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'HAMED JUNIOR',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage("◕🌹ℝᎧᎥ ᗪᗴᗰᗝᑎ 𝐀𝐈🌹◕✖\n ●═══════════●\n𝐒𝐀𝐋𝐔𝐓 𝐭𝐨𝐢 𝐯𝐞𝐮𝐱 𝐭𝐮 𝐪𝐮𝐨𝐢!  ✰..✰", event.threadID, event.messageID);
      return;
    }

    api.getUserInfo(event.senderID, async (err, ret) => {
      if (err) {
        console.error(err);
        return;
      }
      const userName = ret[event.senderID].name;
      const { response, messageID } = await getAIResponse(input, userName, event.senderID, event.messageID);
      api.sendMessage(`✰. ◕🌹🌹VOLDIGO ANOS ◕✖ .✰:\n●═══════════●\n\n${response}\n\n╰┈┈┈➤⊹⊱✰✫✫✰⊰⊹`, event.threadID, messageID);
    });
  },
  onChat: async function ({ api, event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      api.getUserInfo(event.senderID, async (err, ret) => {
        if (err) {
          console.error(err);
          return;
        }
        const userName = ret[event.senderID].name;
        const { response, messageID } = await getAIResponse(input, userName, event.senderID, message.messageID);
        message.reply(`✰. . 🌹ℝᎧᎥ ᗪᗴᗰᗝᑎ 𝐈𝐍𝐅𝐎🌹 . .✰ \n⧠⧠⧠⧠⧠ .✰.✰. ⧠⧠⧠⧠⧠\n\n${response}\n\n⧠⧠⧠⧠⧠ .✰.✰. ⧠⧠⧠⧠⧠\n𝘀𝗲𝗻𝗱𝗲𝗿 𝗻𝗮𝗺𝗲: ${userName} 💬\n━━━━━━━━━━━━━━━━━━`, messageID);
api.setMessageReaction("💬", event.messageID, () => {}, true);

      });
    }
  }
};
