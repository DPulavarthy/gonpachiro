module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    if (!args.join(" ")) {
        return message.channel.send(`Invite code required`);
    }
    if (args.join(" ").includes(`discord.gg`) || args.join(" ").includes(`discordapp.com`)) {
        return message.channel.send(`Invalid input, invite code only`)
    }
    client.fetchInvite(args[0]).then(async invite => {
        let field = ``;

        field += `${client.arrow} Server Name: ${invite.guild.name}\n`;
        field += `${client.arrow} Server ID: ${invite.guild.id}\n`;
        field += `${client.arrow} Channel Name: ${invite.channel.name}\n`;
        field += `${client.arrow} Channel ID: ${invite.channel.id}\n`;
        field += `${client.arrow} Invite Link https://discord.gg/${invite.code}\n`;
        const embed = client.send.embed()
            .setAuthor(`Invite info for ${invite.guild.name}`, invite.guild.iconURL({ format: "png", dynamic: true, size: 2048 }), `https://discord.gg/${invite.code}`)
            .setThumbnail(invite.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .setDescription(field)
        await message.channel.send(embed);
        return client.send.log(message);
    }).catch(error => {
        client.send.report(message, error);
        return client.send.log(message);
    })
}

module.exports.code = {
    name: "inviteinfo",
    description: "Get the info for [INVITE_LINK]",
    group: "information",
    usage: ["/PREFIX/invite [INVITE_LINK]"],
    accessableby: "Villagers",
    aliases: ["inviteinfo", "ii"]
}