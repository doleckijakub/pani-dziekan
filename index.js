require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
	intents: [ GatewayIntentBits.Guilds ],
});

const init = async () => {
	await client.login();

	const output_channel = await client.channels.fetch("1159599712530354186");

	setInterval(() => {
		output_channel.send("test")
			.then(message => console.log(`Message ${message.id} sent`))
			.catch(console.error);
	}, 20 * 1000);
};

init();
