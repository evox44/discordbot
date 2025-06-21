require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const keepAlive = require('./keep_alive');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let messageCount = 6; // startowy licznik

client.once('ready', async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

 let status = 'gg/soulstore'; // tutaj zmieniasz treść statusu

 client.user.setPresence({
    activities: [{ name: status, type: 3 }], // 3 = WATCHING
    status: 'online'
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.users.size) return; // ⬅️ Jeśli nie ma żadnej wzmianki, przerwij

  const channelId = process.env.CHANNEL_ID;
  if (!channelId) {
    console.error('❌ Brakuje CHANNEL_ID w .env!');
    return;
  }

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      console.error('❌ Nie znaleziono kanału!');
      return;
    }

    messageCount++; // inkrementuj licznik
    const newName = `💚︲l3git·ch3ck➔${messageCount}`;
    await channel.setName(newName);
    console.log(`✅ Zmieniono nazwę kanału na: ${newName}`);
  } catch (error) {
    console.error('❌ Błąd przy aktualizacji kanału:', error.message);
  }
});

keepAlive(); // render.com
client.login(process.env.TOKEN);
