require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const channelId = process.env.CHANNEL_ID;
const token = process.env.TOKEN;

const userMessageCounts = new Map();

client.on('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Pomijaj wiadomości od botów
  if (message.author.bot) return;

  // Zwiększ licznik
  const userId = message.author.id;
  const currentCount = userMessageCounts.get(userId) || 4;
  userMessageCounts.set(userId, currentCount + 1);

  // Oblicz sumę
  const totalMessages = Array.from(userMessageCounts.values()).reduce((a, b) => a + b, 0);

  // Aktualizuj kanał
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.setName(`💚︲l3git·ch3ck➔${totalMessages}`);
    console.log(`📊 Nowa nazwa: l3git•ch3ck➔${totalMessages}`);
  } catch (err) {
    console.error('❌ Błąd przy aktualizacji kanału:', err.message);
  }
});

client.login(token);
