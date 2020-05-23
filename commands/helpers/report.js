const reported = new Set();

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.join(" ")) return message.channel.send(`You did not send any message to report`);
    if (reported.has(message.author.id)) return message.channel.send(`Please wait 5 minutes to send another report!`);
    if (!client.send.approve(message.author.id, `APPROVED`)) { reported.add(message.author.id); }

    const embed = client.send.embed()
        .setAuthor(`New Report!`, client.util.link.logo, client.util.link.support)
        .setThumbnail(client.util.link.pfp)
        .addField(`Source`,
            `Guild Name: \`` + message.guild.name + `\`\n` +
            `Guild ID: \`` + message.guild.id + `\`\n` +
            `Channel Name: \`` + message.channel.name + `\`\n` +
            `Channel ID: \`` + message.channel.id + `\``, false)
    if (message.author.id === message.guild.owner.user.id) {
        embed
            .addField(`User Information`,
                `User Tag: \`` + message.author.tag + `\`\n` +
                `User ID: \`` + message.author.id + `\`\n` +
                `User Created At: \`` + message.author.createdAt.toDateString() + `\``, false)
    } else {
        embed
            .addField(`User Information`,
                `User Tag: \`` + message.author.tag + `\`\n` +
                `User ID: \`` + message.author.id + `\`\n` +
                `User Created At: \`` + message.author.createdAt.toDateString() + `\``, false)
            .addField(`Owner Information`,
                `User Tag: \`` + message.guild.owner.user.tag + `\`\n` +
                `User ID: \`` + message.guild.owner.user.id + `\`\n` +
                `User Created At: \`` + message.guild.owner.user.createdAt.toDateString() + `\``, false)
    }
    embed.addField(`Report`, `\`\`\`fix\n${args.join(" ")}\n\`\`\``, false)
    await client.channels.cache.get(client.util.id.reporting).send(embed);
    await message.channel.send(embed);
    embed
        .setDescription(`Thanks for reporting, your report has been recieved and will soon be checked by the devs, you will not be able to send another report for 5 minutes`, false)
        .addField(`Server`, `If you want to know when your report has been resolved, join the support server [here](${client.util.link.support})`, false)
    await message.author.send(embed).catch(error => client.send.report(message, error, `DM to ${message.author.tag} falied`));
    setTimeout(() => {
        reported.delete(message.author.id);
    }, 300000);
    return client.send.log(message);
}

module.exports.code = {
    name: "report",
    description: "Report a problem (Limited to 1 report per 5 min/ nullified if approved)",
    group: "helpers",
    usage: ["/PREFIX/source"],
    accessableby: "Villagers",
    aliases: ["report"]
}