const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(3000, () => {
  console.log('Web server running');
});

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔧 CONFIG (PUT YOUR IDS HERE)
const DISPATCH_CHANNEL_ID = '1495187321996447907';
const POLICE_CHANNEL_ID = '1495062701854949466';
const FIRE_CHANNEL_ID = '1495062551518646313';
const AMBULANCE_CHANNEL_ID = '1495062637149556970';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== DISPATCH_CHANNEL_ID) return;

  let content = message.content;

  let targetChannel = null;
  let cleanMessage = content;

  if (content.includes('[p]')) {
    targetChannel = POLICE_CHANNEL_ID;
    cleanMessage = content.replace('[p]', '').trim();
  } else if (content.includes('[f]')) {
    targetChannel = FIRE_CHANNEL_ID;
    cleanMessage = content.replace('[f]', '').trim();
  } else if (content.includes('[a]')) {
    targetChannel = AMBULANCE_CHANNEL_ID;
    cleanMessage = content.replace('[a]', '').trim();
  }

  if (!targetChannel) return;

  const channel = await client.channels.fetch(targetChannel);

  if (!channel) return;

  await channel.send(
    `🚨 **DISPATCH**\n**Caller:** ${message.author}\n${cleanMessage}`
  );

  await message.delete();
});

client.login(process.env.TOKEN);