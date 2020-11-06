const server = require('./server.js');
const dotenv = require('dotenv');
const fs = require('fs');
const Discord = require('discord.js');
const prefix = 'dbs!';

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
dotenv.config();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
	console.log('Starter Bot is alive.');
  bot.user.setActivity('Github Universe', { type: 'WATCHING'}).catch(console.error);
});

bot.on('guildCreate', guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

bot.on('guildDelete', guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

bot.on('message', message => {

	if (message.author.bot) return;
  
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	try {
		command.execute(message, args);
	}
  
	catch (error) {
		console.error(error);
		message.reply('oh no. there was a critical error.');
	}

});

bot.login(process.env.DISCORD_TOKEN);