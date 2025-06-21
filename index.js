require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const keepAlive = require('./keep_alive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const COUNTER_FILE = 'counter.json';
const legitChannelId = '1382320412016513024'; // ID kanału LEGITCHECKI

// Wczytaj messageCount z pliku lub ustaw na 0, jeśli brak pliku
let messageCount = 0;
if (fs.existsSync(COUNTER_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE));
    if (typeof data.messageCount === 'number') {
      messageCount = data.messageCount;
    }
  } catch (err) {
    console.error('❌ Błąd przy wczytywaniu counter.json:', err.message);
  }
}

client.once('ready', async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  const statuses = [
    { name: '.gg/soulstore', type: ActivityType.Watching },
    { name: 'SoulStore | N4jtaniej i Najszybciej!', type: ActivityType.Playing },
  ];

  let index = 0;
  setInterval(() => {
    const status = statuses[index];
    client.user.setPresence({
      activities: [status],
      status: 'online',
    });
    index = (index + 1) % statuses.length;
  }, 7000); // co 7 sekund
});

client.on('messageCreate', async (message) => {
  // 🟨 Ignoruj boty
  if (message.author.bot) return;

  // ✅ Tylko kanał LEGITCHECKI
  if (message.channel.id !== legitChannelId) return;

  // ✅ Musi być wzmianka
  if (!message.mentions.users.size) return;

  try {
    const channel = await client.channels.fetch(legitChannelId);
    if (!channel) {
      console.error('❌ Nie znaleziono kanału!');
      return;
    }

    messageCount++;
    const newName = `💚︲l3git·ch3ck➔${messageCount}`;

    await channel.setName(newName);
    console.log(`✅ Zmieniono nazwę kanału na: ${newName}`);

    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ messageCount }, null, 2));
  } catch (error) {
    console.error('❌ Błąd przy aktualizacji kanału:', error.message);
  }
});

keepAlive(); // render.com
client.login(process.env.DISCORD_TOKEN);
