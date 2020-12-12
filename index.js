/**
 * Module Imports
 */
const { Client, Collection, MessageEmbed, Message } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/EvobotUtil");
const {activities_list, BANNED_GUILDS} = require("./config.json");
const levels = require("./util/levels");
const modules = require("./database/modules.json");

const AntiSpam = require('discord-anti-spam');
const { msg } = require("./util/levels");
//antispam config
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  kickThreshold: 10, // Amount of messages sent in a row that will cause a ban.
  banThershold: 9999999, //i don't want anyone banned for now
  maxInterval: 10000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
  kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
  maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 9999999, //i don't want anyone banned for now
  exemptPermissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'KICK_MEMBERS']
});

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  for(var i = 0; i < BANNED_GUILDS.length; i++) {
    if (message.content.startsWith(PREFIX)) {
      if (BANNED_GUILDS[i] == message.guild.id) {
        var c = new MessageEmbed()
          .setTitle("Server Banned!")
          .setColor("#ff0000")
          .setDescription("This discord server is banned by owner of bot. This means that bot won't work here.");
        return message.channel.send(c);
      }
    }
  }

  //Anti spam in guilds, that enabled that

  var enable = false;
  var protectGuilds = require("./database/antispam.json");
  protectGuilds.guilds.forEach(g => {
    if (g == message.guild.id) {
      enable = true;
    }
  });
  if (enable) {
    antiSpam.message(message);
  }

  //ping pong
  if (message.content.toLowerCase().startsWith("ping")) {
    var a = new MessageEmbed()
      .setTitle("Pong!")
      .setColor("00ff00");
    return message.channel.send(a);
  } else if (message.content.toLowerCase().startsWith("pong")) {
    var a = new MessageEmbed()
      .setTitle("Ping!")
      .setColor("00ff00");
    return message.channel.send(a);
  }

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
  command.execute(message, args);
  } catch (error) {
  console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }

  //Leveling
  levels.msg(message);
});

require("./dashboard/server");