require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const keepAlive = require('./keep_alive');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let messageCount = 6; // startowy licznik

client.once('ready', async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  const statuses = [
    { name: '.gg/soulstore', type: ActivityType.Watching },
    { name: 'SoulStore | Najt4niej i Najszybciej!', type: ActivityType.Playing },
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
  if (message.author.bot) return;
  if (!message.mentions.users.size) return; // jeśli nie ma wzmianki, przerywamy

  const channelId = '1382320412016513024'; // <-- ustawione na sztywno
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.error('❌ Nie znaleziono kanału!');
      return;
    }

    messageCount++;
    const newName = `💚︲l3git·ch3ck➔${messageCount}`;
    await channel.setName(newName);
    console.log(`✅ Zmieniono nazwę kanału na: ${newName}`);
  } catch (error) {
    console.error('❌ Błąd przy aktualizacji kanału:', error.message);
  }
});

keepAlive(); // render.com
client.login(process.env.DISCORD_TOKEN);
