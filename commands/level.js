const level = require("../util/levels");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "level",
    description: "Gets your level",
    execute(message) {
        var a = new MessageEmbed()
            .setTitle(`${message.author.tag} Level`)
            .setDescription(level.getLevel(message.author.id))
            .setColor("00ff00");
        return message.channel.send(a);
    }
}