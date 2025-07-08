require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, ActivityType, Events } = require('discord.js');
const keepAlive = require('./keep_alive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const COUNTER_FILE = 'counter.json';
const legitChannelId = '1391340475700744363'; // ID kanału LEGITCHECKI
const allowedUserId = '1058743816921825342';  // ID dozwolonego użytkownika

// Wczytaj messageCount z pliku lub ustaw na 0, jeśli brak pliku
let messageCount = 3;
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

// Funkcja: inkrementuj licznik i zapisz do pliku
function incrementMessageCountAndSave() {
  messageCount++;
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ messageCount }, null, 2));
}

// Bot gotowy
client.once('ready', async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  // Statusy
  const statuses = [
    { name: '.gg/7hVSYGBzcD', type: ActivityType.Watching },
    { name: 'Evox N1tros | Fast and Ch3ap!', type: ActivityType.Playing },
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

// Obsługa wiadomości
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Tylko kanał LEGITCHECKI
  if (message.channel.id !== legitChannelId) return;

  // Musi być wzmianka i tylko konkretny użytkownik
  if (!message.mentions.users.has(allowedUserId)) return;

  try {
    const channel = await client.channels.fetch(legitChannelId);
    if (!channel) {
      console.error('❌ Nie znaleziono kanału!');
      return;
    }

    incrementMessageCountAndSave();

    const newName = `〢✅﹕vouches➔${messageCount}`;
    await channel.setName(newName);
    console.log(`🟢 Zmieniono nazwę kanału na: ${newName}`);
  } catch (error) {
    console.error('❌ Błąd przy aktualizacji kanału:', error.message);
  }
});

// Powiadomienie o roli
const roleToWatch = '1391335956732186777';
const channelsToPing = [
  '1391348902057218158', // ToS
  '1391340691816448000', // Are We Legit
  '1392059729827860502', // Stock Evox
];

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const oldRoles = new Set(oldMember.roles.cache.keys());
  const newRoles = new Set(newMember.roles.cache.keys());

  if (!oldRoles.has(roleToWatch) && newRoles.has(roleToWatch)) {
    for (const channelId of channelsToPing) {
      try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) continue;

        const sentMessage = await channel.send(`<@${newMember.id}>`);

        setTimeout(() => {
          sentMessage.delete()
            .then(() => console.log('✅ Wiadomość usunięta.'))
            .catch(err => console.error('❌ Błąd przy usuwaniu wiadomości:', err.message));
        }, 500); // 0.5 sekundy

      } catch (error) {
        console.error(`❌ Błąd przy pingowaniu na kanale ${channelId}:`, error.message);
      }
    }
  }
});

// 🔷🔷🔷 KONIEC DODATKU 🔷🔷🔷
keepAlive(); // render.com
client.login(process.env.DISCORD_TOKEN);
