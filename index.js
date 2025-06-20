require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const keepAlive = require('./keep_alive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const channelId = process.env.COUNTER_CHANNEL_ID;
let messageCount = 0;

client.on('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // 🔒 IGNORUJEMY wiadomości od botów
  if (message.author.bot) return;

  messageCount++;

  const displayCount = messageCount + 4; // ➕ Zawsze +4

  try {
    const channel = await client.channels.fetch(channelId);
    if (channel) {
      await channel.setName(`💚・l3git•ch3ck➜${displayCount}`);
      console.log(`🔢 Zaktualizowano nazwę kanału: ${displayCount}`);
    }
  } catch (error) {
    console.error('❌ Błąd przy aktualizacji kanału:', error.message);
  }
});

client.login(process.env.TOKEN);
keepAlive();
