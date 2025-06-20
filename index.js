require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const keepAlive = require('./keepAlive');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const UPDATE_INTERVAL = 10 * 60 * 1000;

let messageCount = 0;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  setInterval(updateChannelName, UPDATE_INTERVAL);
});

client.on('messageCreate', message => {
  if (message.channel.id === CHANNEL_ID && !message.author.bot) {
    messageCount++;
  }
});

async function updateChannelName() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const newName = `💚︲l3git·ch3ck➔${messageCount}`;
    await channel.setName(newName);
    console.log(`🔄 Nazwa zaktualizowana: ${newName}`);
  } catch (err) {
    console.error('❌ Błąd przy zmianie nazwy kanału:', err.message);
  }
}

keepAlive();
client.login(TOKEN);
