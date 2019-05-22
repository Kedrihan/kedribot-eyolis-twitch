#!/usr/bin/node
const tmi = require('tmi.js');
// Get authentication data
let AuthDetails = require("./auth.json");
let pendu = require("./pendu.js");
// Valid commands start with:
let commandPrefix = '!';
// Define configuration options:
let opts = {
    identity: {
        username: AuthDetails.user,
        password: AuthDetails.token
    },
    channels: [
        "#eyolis_tv"
    ],
    connection: {
        reconnect: true
    }
};

// These are the commands the bot knows (defined below):
let penduActive = 0;
let mod = ['eyolis_tv', 'xjms', 'yeasz', 'DiouL6', 'leCoqlico', 'kedribot','kedrihan_','seekertv'];
// Helper function to send the correct type of message:

// Create a client with our options:
let client = new tmi.client(opts);


// Register our event handlers (defined below):
var CooldownManager = {
    cooldownTime: 5000, // 5 seconds
    store: {
        '!pendu': 1543848572,
        '!devine': 1543848572
    },

    canUse: function (commandName) {
        // Check if the last time you've used the command + 30 seconds has passed
        // (because the value is less then the current time)
        return this.store[commandName] + this.cooldownTime < Date.now();
    },

    touch: function (commandName) {
        // Store the current timestamp in the store based on the current commandName
        this.store[commandName] = Date.now();
    }
};

client.on('message', onMessageHandler);

// Connect to Twitch:
client.connect();


// Called every time a message comes in:
async function onMessageHandler(target, context, msg, self) {
	try {
		if (self || context['message-type'] === 'whisper') {
			return;
		}
		if(mod.includes(context.username)) {
			if(msg === commandPrefix+"pendu on" && penduActive === 0) {
				penduActive = 1;
				client.say(target, "Le pendu est désormais actif ! Enjoy ! PogChamp");
			}
			if(msg === commandPrefix+"pendu off" && penduActive === 1) {
				penduActive = 0;
				client.say(target, "Le pendu est désormais désactivé ! BibleThump");
			}
		}
		if(penduActive === 1) {
			await pendu.pendu(msg, client, target, context,CooldownManager,commandPrefix);
		}
	}
	catch(err) {
		console.log(err);
		throw Error(err);
	}
}
