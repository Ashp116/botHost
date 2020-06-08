const botSettings = require("./botSettings.json");
const discord = require("discord.js");
const fs = require("fs");
const querystring = require('querystring');
const fetch = require('node-fetch');
const rbx = require('noblox.js');
const bot = new discord.Client({disableEveryone: true});
const prefix = botSettings.prefix
const snekfetch = require("snekfetch")
const Permissions = botSettings.Permissions
const express = require('express')
const bodyparser = require('body-parser')
const http = require('http')
 
const app = express()
/* At the top, with other redirect methods before other routes */

bot.commands = new discord.Collection();

let uniqueCodes = []
var port = 3000
app.use(bodyparser.text(), bodyparser.json())

app.post('/verifyConnectrix', (request, response) => {
  console.log(request.body)
   console.log(request.body.toString())
    uniqueCodes.push(request.body.toString())
    console.log(uniqueCodes)
})
app.delete('/delete', (request, response) => {
    console.log(request.body)
    uniqueCodes.splice(request.body)
    console.log(uniqueCodes)
})

app.listen(port)

fs.readdir("./Commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles <= 0) {
      console.log("No commands to load");
      return;
    }
    console.log(`Loading ${jsfiles.length} commands!`);
    jsfiles.forEach((f, i) => {
      let props = require(`./Commands/${f}`);
      console.log(`${i+1}: ${f} loaded!`)

      bot.commands.set(props.help.name, props);
    });
});

function login() {
  rbx.cookieLogin("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_E86DC4E1C61EA99EDF59A014493EA62A93FA2C556080DC030266E8CD44810A6901A0EC33A86CD0C5436F75BC207B829634596C9AA9D9DBAC42C601482AF988C88E070CEDD69C42C0F8C0DE399F42086FCA2988F623A209F3F29CC524AA1D34C4EF65D8EC7D587F2E1C09943D95E0DD24D752DB9D9EBB86542DFC2CF2B7B5558470C15C89936572942F0D5ABDCAB28E920FCCAD4BFDEBD0C91EE28B4B57D498FB6CEFD59B6482D27B7AE7E0F2848AE1094C88E58DAFE21F87A9EDBB6D5365F066CBE465B534F902360D423E7921608E932F76BF7D6FAF7B36C35787653AD1FC38853264DC7C8CBB3FC76DC6A597FA83B011A3D459B5B19C18922DD74F78A5AC921FA27D009996296A22FFF805DD5BC04397719EDEE488D623F9E7D191121408A764E46CC7");

}

// sends a mesg to the console if the bot is ready
bot.on("ready", async () => {
  console.log(`Bot is ready! ${bot.user.username}`);
  console.log(bot.commands)
  try {
    let link = await bot.generateInvite(Permissions);
    console.log(link);
  } catch (e) {
    console.log(e.stack);
  }


});







bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  
  if (!command.startsWith(prefix)) return;
  let cmd = bot.commands.get(command.slice(prefix.length))
   if (cmd) cmd.run(bot, message,messageArray,uniqueCodes);
});



bot.on("guildCreate", guild => {
  let channel = bot.guild.channels.get(guild.systemChannelID);
  channel.send("Joined")
});

bot.on("guildMemberAdd", member => {
  let file = bot.commands.get("welcomeMsg");
  if (file) file.run(bot, member)
});


bot.login(botSettings.token);



