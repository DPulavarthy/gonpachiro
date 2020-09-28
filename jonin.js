let Discord = require(`discord.js`), { MongoClient } = require(`mongodb`), client = new Discord.Client();
require(`dotenv`).config();
client.src = require(`./resources/src.js`);
// client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
[`command`].forEach(handler => { require(`./handler/${handler}`)(client); }); // Command Handler

client.on(`ready`, async () => { client.src.startup([client]); }); // Start-up Function
client.on(`guildCreate`, async guild => { client.function.guildCreate(guild); });
client.on(`guildDelete`, async guild => { client.function.guildDelete(guild); });
client.on(`message`, async message => {
    if (message.author.bot) return;
    if (message.guild.id === `621352749824737291` && message.channel.id !== `621373939322716171`) return;
    if (message.content.toLowerCase() === `${client.user.username.toLowerCase()}?` || (message.channel.type !== `dm` && message.content.toLowerCase() === `${message.guild.members.cache.get(client.user.id).displayName.toLowerCase()}?`)) { return message.channel.send(`**${client.src.status()}**`); };
    client.msg(client, message, client.prefix)
    // if (client.db) { if (message.channel.type.toUpperCase() === `DM`) { client.msg(client, message, client.prefix); } else { client.database.guilds.findOne({ id: message.guild.id }, async function (error, guild) { if (error) { client.error(error); }; if (!guild) { client.msg(client, message, client.prefix); } else { client.msg(client, message, guild.prefix, guild); }; }); }; };
});
client.login(process.env.TOKEN);