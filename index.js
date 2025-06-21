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








// PONIZEJ PARTNERSTWA (slash)! --------------------------------------------------------------------------------------------------------------------------------








const { REST, Routes, SlashCommandBuilder, Collection } = require('discord.js');

// PARTNER CONFIG
const PARTNER_CHANNEL_ID = '1382320420098670773';
const PARTNER_VALUE = 0.40; // zł za partnerstwo
const userStats = new Map(); // { userId: { count: 0, earnings: 0 } }

client.commands = new Collection();

// Slash command - rejestracja
const commands = [
  new SlashCommandBuilder()
    .setName('partnerstwa')
    .setDescription('Sprawdź ile partnerstw zrobił dany użytkownik i ile zarobił')
    .addUserOption(option =>
      option.setName('użytkownik')
        .setDescription('Użytkownik do sprawdzenia')
        .setRequired(true))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  try {
    const CLIENT_ID = client.user.id;
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash komenda /partnerstwa zarejestrowana');
  } catch (err) {
    console.error('❌ Błąd przy rejestracji komend:', err);
  }
});









// KOMENDA PARTNERSTWA NIZEJ----------------------------------------------------------------------------------------------------------------------





client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'partnerstwa') {
    const user = interaction.options.getUser('użytkownik');
    const stats = userStats.get(user.id) || { count: 0, earnings: 0 };

    await interaction.reply({
      embeds: [{
        color: 0x00ff99,
        title: `📊 Partnerstwa użytkownika ${user.tag}`,
        fields: [
          { name: 'Liczba partnerstw', value: `${stats.count}`, inline: true },
          { name: 'Zarobki', value: `${stats.earnings.toFixed(2)} PLN`, inline: true }
        ],
        timestamp: new Date()
      }],
      ephemeral: true
    });
  }
});
