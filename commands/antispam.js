const {MessageEmbed} = require("discord.js");
const {writeFileSync} = require("fs");
const {join} = require("path");

module.exports = {
    name: "antispam",
    description: "Configures Anti Spam for this server",
    execute(message) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.channel.send("Acces denied!");
        }
        if (!message.content.split(" ")[1]) {
            var a = new MessageEmbed()
                .setTitle("Argument required!")
                .setColor("ff0000")
                .setDescription("Usage: `/antispam enable` or `/antispam disable`");
            return message.channel.send(a);
        }
        if (message.content.split(" ")[1] == "enable") {
            var anti = require("../database/antispam.json");
            anti.guilds.push(message.guild.id);
            writeFileSync(join(__dirname, "../database", "antispam.json"), JSON.stringify(anti));
            var b = new MessageEmbed()
                .setTitle("Succes!")
                .setColor("00ff00")
                .setDescription("Succesfully enabled Anti Spam on this server.");
            return message.channel.send(b);
        }
        else if (message.content.split(" ")[1] == "disable") {
            var anti = require("../database/antispam.json");
            var i = 0;
            anti.guilds.forEach(g => {
                if (g == message.guild.id) {
                    //currently database will not remove but only overwrite
                    anti.guilds[i] = "0";
                }
                i++;
            });
            writeFileSync(join(__dirname, "../database", "antispam.json"), JSON.stringify(anti));
            var b = new MessageEmbed()
                .setTitle("Succes!")
                .setColor("00ff00")
                .setDescription("Succesfully disabled Anti Spam on this server.");
            return message.channel.send(b);
        }
        else {
            var a = new MessageEmbed()
                .setTitle("Incorrect argument given!")
                .setColor("ff0000")
                .setDescription("Usage: `/antispam enable` or `/antispam disable`");
            return message.channel.send(a);
        }
    }
}