module.exports = {
	name: 'hello',
	description: 'makes the bot say hello',
  aliases: ['hi', 'hola'],
	execute(message, args) {
		const name = message.channel.author;
    message.channel.send('Hello, ' + name)
	},
};