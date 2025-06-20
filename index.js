require("dotenv").config();
require("./keep_alive"); // Render keep-alive

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = process.env.CHANNEL_ID;
let messageCounts = {};

client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  updateChannelName();
  setInterval(updateChannelName, 10_000);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  const id = msg.author.id;

  // START z 5, potem +1 przy każdej wiadomości
  if (!messageCounts[id]) {
    messageCounts[id] = 5;
  } else {
    messageCounts[id] += 1;
  }

  console.log(`💬 ${msg.author.username}: ${messageCounts[id]} wiadomości`);
});

async function updateChannelName() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return;

    const total = Object.values(messageCounts).reduce((a, b) => a + b, 0);
    const newName = `💚︲l3git·ch3ck➔${total}`;

    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`#️⃣ Zmieniono nazwę kanału na: ${newName}`);
    }
  } catch (err) {
    console.error("❌ Błąd przy aktualizacji kanału:", err.message);
  }
}

client.login(process.env.TOKEN);
