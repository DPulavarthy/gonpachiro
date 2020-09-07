module.exports.run = async (client, message, args) => {
    const nekos = require('nekos.life');
    const neko = new nekos();
    let user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    neko.sfw.slap().then(gif => { message.channel.send(client.embed().setDescription(message.author.id === user.id ? `${message.author.toString()} is slapping themselves` : `${message.author.toString()} slapped ${user.toString()}`).setImage(gif.url)); return client.log(message); });
}

module.exports.code = {
    title: "slap",
    about: "hmm.. slap, the only solution",
    usage: ["%P%slap (USER)"],
}