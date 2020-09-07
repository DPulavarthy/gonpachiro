module.exports.run = async (client, message, args) => {
    if (!args.join(" ")) { message.channel.send(`Invite code required`); return client.log(message); };
    if (args.join(" ").includes(`discord.gg`) || args.join(" ").includes(`discordapp.com`)) { message.channel.send(`Invalid input, invite code only`); return client.log(message); };
    client.fetchInvite(args[0]).then(async invite => {
        let field = [];
        field.push(`${client.arrow} Server Name: ${invite.guild.name}`);
        field.push(`${client.arrow} Server ID: ${invite.guild.id}`);
        field.push(`${client.arrow} Channel Name: ${invite.channel.name}`);
        field.push(`${client.arrow} Channel ID: ${invite.channel.id}`);
        field.push(`${client.arrow} Invite Link: https://discord.gg/${invite.code}`);
        const embed = client.embed()
            .setAuthor(invite.guild.name, null, `https://discord.gg/${invite.code}`)
            .setThumbnail(invite.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .setDescription(field.join(`\n`))
        message.channel.send(embed);
        return client.log(message);
    }).catch(error => {
        message.channel.send(client.src.comment(`I was unable to find a guild with that invite, ERROR: ${error}`));
        return client.log(message);
    })
}

module.exports.code = {
    title: "inviteinfo",
    about: "Informationa about the server",
    usage: ["%P%inviteinfo [SERVER_INIVTE_CODE]"],
    alias: ["ii"],
    dm: true,
}