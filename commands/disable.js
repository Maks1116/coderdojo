const {MessageEmbed} = require("discord.js");
const {writeFileSync} = require("fs");
const {join} = require("path");
       
module.exports = {
    name: "disable",
    description: "Disables specific module of the bot",
    execute(message) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            var c = new MessageEmbed()
                .setTitle("Missing permissions!")
                .setDescription("You don't have `manage channels` permission, whitch is required to do that.")
                .setColor("ff0000");
            return message.channel.send(c);
        }
        if (!message.content.split(" ")[1]) {
            var a = new MessageEmbed()
                .setTitle("Argument required!")
                .setColor("ff0000")
                .setDescription("Here are modules:\n`reddit` `antispam`\nTo enable one of them, type /enable [module name]");
            return message.channel.send(a);
        }

        else if (message.content.split(" ")[1] == "antispam") {
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

        else if (message.content.split(" ")[1] == "reddit") {
            var db = require("../database/reddit.json");
            var i = 0;
            db.guilds.forEach(g => {
                if (g == message.guild.id) {
                    //currently database will not remove but only overwrite
                    db.guilds[i] = "0";
                }
                i++;
            });
            writeFileSync(join(__dirname, "../database", "reddit.json"), JSON.stringify(db)); //flushing changes
            var b = new MessageEmbed()
                .setTitle("Succes!")
                .setColor("00ff00")
                .setDescription("Succesfully disabled reddit on this server.");
            return message.channel.send(b);
        }
    }
}