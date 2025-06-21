const { REST, Routes } = require('discord.js');
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔁 Rejestracja slash komend...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), // testowo tylko dla serwera
      { body: commands }
    );
    console.log('✅ Komendy zarejestrowane pomyślnie!');
  } catch (error) {
    console.error('❌ Błąd przy rejestracji komend:', error);
  }
})();
