module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    let user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}**`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    let dm = true, loader = client.emojis.cache.get(client.util.emoji.ddos).toString(), msg = await message.channel.send(client.embed().setDescription(`**${loader} Initializing DDoS ${loader}**`));
    try { await user.send(`You are currently under a DDoS attack all of ur infomation has been leaked out to hackers accross the world, your credit card details, your address, your pasports and your phone number. You have also been given criminal records and false hostage claims have been given to the police, be expecting a SWAT team at your house within 30 minutes, Don't tell anyone about this or else.\nFAKE BTW! Triggerd by: ${message.author.toString()}`); }
    catch (error) { dm = false; };
    setTimeout(function () { msg.edit(client.embed().setDescription(`**${loader} Target Information Acquiring.... ${loader}**`)); }, 2000);
    setTimeout(function () { msg.edit(client.embed().setDescription(`**${loader} Target Information Acquired..... ${loader}**`)); }, 5000);
    setTimeout(function () { msg.edit(client.embed().setDescription(`**${loader} Obtaining Target's IP Addresses. ${loader}**`)); }, 10000);
    setTimeout(function () { msg.edit(client.embed().setDescription(`**${loader} Obtained Target's IP Addresses.. ${loader}**`)); }, 15000);
    setTimeout(function () { msg.edit(client.embed().setDescription(`**${loader} DDoSing Target From ${Math.floor(Math.random() * 7891011) + 123456} Host Servers. ${loader}**`)); }, 20000);
    if (dm) { setTimeout(function () { msg.edit(client.embed().setDescription(`**Target ${user.toString()} has been DDoSed and all current infomation has been leaked.**`)); }, 25000); }
    else { setTimeout(function () { msg.edit(client.embed().setDescription(`**Failed to DDoSed targes, ERROR: DM's closed.**`)); }, 25000); };
    return client.log(message);
}

module.exports.code = {
    title: "ddos",
    about: "Fake DDoS attack",
    usage: ["%P%ddos [USER]"],
}