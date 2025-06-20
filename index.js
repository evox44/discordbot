require('dotenv').config();
require('./keepAlive'); // ⬅️ Keep alive serwer HTTP

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const counts = new Map();
const CHANNEL_ID = process.env.COUNTER_CHANNEL_ID;

client.on('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== CHANNEL_ID) return;
  if (message.author.bot) return; // ⬅️ Ignorujemy boty

  const userId = message.author.id;
  const current = counts.get(userId) || 0;
  counts.set(userId, current + 1);

  updateChannelName();
});

async function updateChannelName() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return;

  let totalMessages = 4; // ⬅️ Startujemy od 4

  for (const count of counts.values()) {
    totalMessages += count;
  }

  const newName = `💚・l3git•ch3ck➜${totalMessages}`;
  if (channel.name !== newName) {
    try {
      await channel.setName(newName);
      console.log(`🔁 Zaktualizowano nazwę kanału: ${newName}`);
    } catch (err) {
      console.error('❌ Błąd przy aktualizacji kanału:', err.message);
    }
  }
}

client.login(process.env.TOKEN);
