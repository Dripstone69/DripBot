// PACKAGES
const Discord = require("discord.js")

const { ReactionCollector } = require('discord.js-collector')

const fs = require("fs")

const moment = require("moment")

var log = require('fancy-log')

var util = require('util')

const gottem = require('djs-meme')

const chalk = require("chalk")

const mongoose = require("mongoose")

const mongoCurrency = require('discord-mongo-currency');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const {
    connect
} = require('mongoose');


// INITIALIZING CLIENT
const bot = new Discord.Client({
    device: 'DESKTOP',
    intents: ['131071'],
    autoReconnect: true
});


const client = new Discord.Client({
    device: 'DESKTOP',
    intents: ['131071'],
    autoReconnect: true
});

bot.login("bot token here");

mongoose.connect('mongo connection URL here', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


mongoCurrency.connect('mongo connection URL here');


bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = require("fs").readdirSync(`./commands`);
["eventHandler", "commandHandler"]
    .filter(Boolean)
    .forEach(h => {
      require(`./handlers/${h}`)(bot);
});


const Errorhandler = require("discord-error-handler");
const handle  = new Errorhandler(client, {
  webhook: {id: `webhook id here`, token: `webhook token here`},
  stats: true, 
})  


client.on('messageCreate', async message => {
  try{
    if (message.author.bot) return;
    if(message.content.startsWith("db.start")) { 
        message.chanel.send("ddd"); ///create a error
    }
    if(message.content.startsWith("db.report")) {
    	handle.report(client , message);
    }
  }catch(error){  
    handle.createrr(client, message.guild.id, message.content, error)
  } 
});


process.on('unhandledRejection', error => { 
  handle.createrr(client,undefined, undefined, error)
});


// INITIALIZING DATA
const BOT_VERSION = Bot version here
const BOT_TOKEN = Your bot token here
const GUILD_ID = Guild ID for logging
const BOT_PREFIX = Bot prefix here
const APIKEY_YOUTUBE = Youtube ApiKey here
const MUSICBOT_LANGUAGE = language here //en, fr
const ERROR_LOG_CHANNEL = Error log channel ID here
const MONGO_CONNECTION_URL = Mongo Connection URL here

// STARTUP LOGGING
bot.on("ready", () => {
    log(chalk.red.bold("——————————[Basic Info]——————————"))
    log(
        chalk.white(`${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1 ? "Users:" : "User:"}`),
        chalk.red(`${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
        chalk.white("||"),
        chalk.white(`${bot.guilds.cache.size > 1 ? "Servers:" : "Server:"}`),
        chalk.red(`${bot.guilds.cache.size}`),
    )
    log("")
    log(chalk.red.bold("——————————[Statistics]——————————"))
    log(
        chalk.white(`Running on Node`),
        chalk.green(process.version),
        chalk.white('on'),
        chalk.green(`${process.platform} ${process.arch}`)
    )
    log(
        chalk.white('Memory:'),
        chalk.green(`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}`),
        chalk.white('MB')
    )
    log(
        chalk.white('RSS:'),
        chalk.green(`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}`),
        chalk.white('MB')
    )
    log("")
    log(chalk.red.bold("——————————[Connections]——————————"))
    log(
        chalk.white("✅   Successfully Connected To"), 
        chalk.red(`${bot.user.tag} v` + BOT_VERSION), 
        chalk.white('('), 
        chalk.green(bot.user.id), 
        chalk.white(')')),
    log(
        chalk.white("✅   Successfully Connected To"), 
        chalk.red(`Mongoose Data Base`)),
    log("")
    log(chalk.red.bold("——————————[Other Information]——————————"))
    log(
    	chalk.white("Copyright ©"),
    	chalk.red("Gameunity 2021-2022.")
    )
});

// SET ACTIVITY AND JOIN VOICECHAT
bot.once("ready", () => {
    const activity = ["https://dripbot.gameunity.gq/changelogs"];
    let i = 0;
    setInterval(() => {
        const index = Math.floor(i);
        bot.user.setActivity(activity[index], { type: "STREAMING", url: "https://www.twitch.tv/dripstone69" });
        i = i + 1;
        if (i === activity.length) i = i - activity.length;
    }, 10000);
});


// MEME COMMAND
bot.on("messageCreate", async message => {
    if (message.content.startsWith("db.meme")) {
        const Meme = await gottem.meme();
        return message.channel.send({ content: Meme });
    };
});

// HARDLOCK CHANNEL COMMAND
bot.on("messageCreate", (message) => {
    if(message.content === "db.hardlock") {
        if(!message.member.hasPermission("MANAGE_CHANNELS")){
  			return message.reply("You don't have permission to do that.");
		}
    	const channel = message.channel
    	message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
    }
})

// SOFTLOCK CHANNEL COMMAND
bot.on("messageCreate", (message) => {
    if(message.content === "db.softlock") {
        if(!message.member.hasPermission("MANAGE_CHANNELS")){
  			return message.reply("You don't have permission to do that.");
		}
    	message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
    }
})

// UNLOCK CHANNEL COMMAND
bot.on("messageCreate", (message) => {
    if(message.content === "db.unlock") {
        if(!message.member.hasPermission("MANAGE_CHANNELS")){
  			return message.reply("You don't have permission to do that.");
		}
    	message.channel.updateOverwrite(message.channel.guild.roles.everyone, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
    }
})

// EVAL COMMAND
bot.on("messageCreate", (message) => {
    if (message.content.startsWith("db.eval")) {
        const args = message.content.split("db.eval")
        if(message.author.id != "774217476073848862") return message.reply({ content: "You cant use that! Missing Permissions: ```EXECUTE_OWNER_COMMANDS```" });
        var result = message.content.split(" ").slice(1).join(" ")
        let evaled = eval(result);
        const evalEmbed = new Discord.MessageEmbed()
    	.setDescription("Eval Command executed:\n")
    	.addField("📥 Input", `\`\`\`\n${args.join(" ")}\n\`\`\``)
    	.addField( "📤 Output", `\`\`\`js\n${evaled}\n\`\`\``)

		message.channel.send({ embeds: [evalEmbed] })
        }
})

// RESTART COMMAND || OWNER ONLY
bot.on("messageCreate", async(message) => {
    if(message.content.startsWith("db.restart")) {
        if(message.author.id !== '774217476073848862') return message.channel.send({ content: 'Restarting.. please wait.'}).then((msg)=> {
            setTimeout(function(){
                msg.edit({ content: 'Just kidding lmao. Only the owner can do that.' });
            }, 1000)
});
        bot.user.setActivity("Restarting.")
    	await message.channel.send({ content: "Restarting.. please wait." })
    	process.exit()
    }
})


bot.on("messageDelete", (message) => {
    
    const messageDeleteEmbed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("Message Deleted:")
    .setDescription(`**Content:** \n"${message.cleanContent}"\n \n **Channel:** \n${message.channel.name}\n \n **Server:** \n ${message.guild}\n \n **Author:** \n<@${message.author.id}>`)
    .setFooter(`Message Deletion Logger | DripBot`, "https://cdn.discordapp.com/avatars/820392195789029416/d843f6044509f785bb83e81a0bd70533.png?size=4096")
    
    bot.channels.cache.get("964127708042915860").send({embeds: [messageDeleteEmbed]})
})

bot.on('messageCreate', message => {
  	if (message.author.bot) return;
  	let {guild} = message;
    const messageEmbed = new Discord.MessageEmbed()
    .setColor("AQUA")
    .setTitle("New Message")
    .setDescription(`**Guild:** \n${guild.name}\n \n **Channel:** \n # ${message.channel.name}\n \n **Content:** \n"${message.content}"\n \n **Author:** \n <@${message.author.id}>`)
	bot.channels.cache.get("967043849539162202").send({embeds: [messageEmbed]})
});
