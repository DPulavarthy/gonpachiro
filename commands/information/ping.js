module.exports.run = async (client, message, args, prefix) => {
    let word, Discord = require(`discord.js`), loading = await message.channel.send(client.src.loading()), load = loading.createdTimestamp - message.createdTimestamp;
    switch (message.content.split(` `)[0].slice(prefix.length).toLowerCase()) { case `ding`: word = `🛎️ Dong!`; break; case `beep`: word = `🐉 Boop!`; break; default: word = `🏓 Pong!` };
    // client.database.data.findOne({ case: module.exports.code.title }, async (error, result) => {
    // if (error) { client.error(error); };
    // if (!result) { result = await client.src.db(message, module.exports.code.title); };
    // result.data.push(load);
    // await client.chart(module.exports.code.title, result.data, [`ms`, `minutes`]);
    await loading.delete();
    message.channel.send(client.embed().setDescription(`${client.src.code(word)}${client.src.code(`Latency is ${load} ms\nAPI Latency is ${Math.round(client.ws.ping)} ms\nServer Latency is ${message.channel.type === `dm` ? `not avaliable in DMs` : `${Math.round(message.guild.shard.ping)} ms`}`, `js`)}`));
    // message.channel.send({ files: [new Discord.MessageAttachment(`./resources/chart.png`) || null], embed: client.embed().setDescription(`${client.src.code(word)}${client.src.code(`Latency is ${load} ms\nAPI Latency is ${Math.round(client.ws.ping)} ms\nServer Latency is ${message.channel.type === `dm` ? `not avaliable in DMs` : `${Math.round(message.guild.shard.ping)} ms`}`, `js`)}`).setImage(`attachment://chart.png`) });
    // setTimeout(async () => { require(`fs`).unlinkSync(`./resources/chart.png`); }, 1000);
    return client.log(message);
    // });
}

module.exports.code = {
    title: "ping",
    about: "Latency + API Latency + Server Latency",
    usage: ["%P%ping", "%P%beep", "%P%ding"],
    alias: ["beep", "ding"],
    dm: true,
}