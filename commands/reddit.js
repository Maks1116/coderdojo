const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");
const { MEME_SUBREDDITS } = require("../config.json");

module.exports = {
    name: "reddit",
    cooldown: 2,
    aliases: ["red", "meme"],
    description: "Gets random meme from reddit",
    execute(message, args) {
        var enabled = false;
        var db = require("../database/reddit.json");
        db.guilds.forEach(g => {
            if (g == message.guild.id) enabled = true;
        });
        if (enabled) {
            var random = MEME_SUBREDDITS[Math.floor(Math.random() * MEME_SUBREDDITS.length)];
        randomPuppy(random).then(img => {
            var embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Random meme")
            .setFooter(`Downloaded from: r/${random} subreddit`)
            .setImage(img)
            .setDescription("URL to image: " + img)
        return message.channel.send(embed);
        });
        }
        else {
            var a = new MessageEmbed()
                .setTitle("Module Reddit is disabled here!")
                .setColor("ff0000");
            return message.channel.send(a);
        }
    }
}