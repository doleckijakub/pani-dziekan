require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const htmlparser = require("htmlparser");
const { fetchUrl } = require("fetch");
const fs = require("fs");

const client = new Client({
	intents: [ GatewayIntentBits.Guilds ],
});

const init = async () => {
	await client.login();

//	const output_channel = await client.channels.fetch("1159599712530354186");

	const walk_html = els => {
		if(els) for(let el of els) {
			if(el.attribs?.class == "activity_block") {
				switch(el.attribs["data-typename"]) {
					case "laboratorium": {
						console.log(
							"@LB",
							el.children[1].children[0].raw, // #
							el.attribs["data-weekdaytext"], // day 
							"[",
							el.attribs["data-starttime"], // start
							"-",
							el.attribs["data-endtime"], // end
							"] w tym",
							el.attribs["data-breaktime"], // break
							"przerwy",
							el.children[3].children[1].children[0].raw, // subject
							el.children[3].children[4].children[1].children[1].children[0].children[0].raw, //teacher
							el.children[5].children[1].children[0].raw, // room
						);
					} break;
					case "konwersatorium": {
						console.log(
							"@KW",
							el.children[1].children[0].raw, // #
							el.attribs["data-weekdaytext"], // day 
							"[",
							el.attribs["data-starttime"], // start
							"-",
							el.attribs["data-endtime"], // end
							"] w tym",
							el.attribs["data-breaktime"], // break
							"przerwy",
							el.children[3].children[1].children[0].raw, // subject
							el.children[3].children[4].children[1].children[1].children[0].children[0].raw, //teacher
							el.children[5].children[1].children[0].raw, // room
						);
					} break;
					case "wykład": {
						console.log(
							"@Student",
							el.attribs["data-weekdaytext"], // day 
							"[",
							el.attribs["data-starttime"], // start
							"-",
							el.attribs["data-endtime"], // end
							"] w tym",
							el.attribs["data-breaktime"], // break
							"przerwy",
							el.children[1].children[1].children[0].raw, // subject
							el.children[1].children[4].children[1].children[1].children[0].children[0].raw, //teacher
							el.children[3].children[1].children[0].raw, // room
						);
					} break;
					default: throw el.attribs["data-typename"];
				}
			} else {
				walk_html(el.children);
			}
		}
	};

	const parser = new htmlparser.Parser(new htmlparser.DefaultHandler((err, dom) => {
		if (err) throw err;

		walk_html(dom); // console.log(dom);
	}));

	const parse_timetable = async () => {
		await fetchUrl("http://moria.umcs.lublin.pl/students/842", (error, meta, body) => {
			parser.parseComplete(body.toString());
		});
	}

//	setInterval(() => {
		parse_timetable();

//		output_channel.send("test")
//			.then(message => console.log(`Message ${message.id} sent`))
//			.catch(console.error);
//	}, 20 * 1000);
};

init();
