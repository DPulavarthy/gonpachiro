module.exports.run = async (client, message, args, guild) => {
    let field = [];
    field.push(`\u279c Age: 500+ [Deceased]`)
    field.push(`\u279c Bot version created: ${client.user.createdAt.toDateString()}`)
    field.push(`\u279c Birthday: July 22`)
    field.push(`\u279c Height: 194cm (including ears)`)
    field.push(`\u279c Weight: 56kg`)
    field.push(`\u279c Type: Biological [BIO]`)

    let embed = client.embed()
        .setAuthor(`About ${client.user.username}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support)
        .setDescription(field)
        .addField(`Overview`, `I am [${client.user.username}](${client.util.link.info}), a discord bot made by [${client.users.cache.get(client.util.id.creator.id).tag}](${client.util.id.creator.link}) and [${client.users.cache.get(client.util.id.cocreator.id).tag}](${client.util.id.cocreator.link}), I am a multi-purpose bot for a shrine maiden at Yae Village. A bot for GIFs, Weather, Management, Info, osu!, Google searches, and many more features. If you liked me, [vote](${client.util.link.vote}) or [donate](${client.util.link.donate}), click [here](${client.util.link.website}) if you want to know more information about me or my devs.`)
        .addField(`Other Information`, `I have hierarchies for users, everyone is a villager, if you are a supporter you can become a shrine maiden, gate keeper, or alder! Developers users are approved users for secret features for ${client.user.username}. The approved users of ${client.user.username} have the option to make the bot leave any server deemed unsafe, such as using ${client.user.username} to search for NSFW content when not intended. The author of those messages also has a chance of being blacklisted from using ${client.user.username}'s commands.`)
        .addField(`Support`, `If you have any issues or problems you can ask in the [support server](${client.util.link.support}): [${client.util.link.support}](${client.util.link.support}). If you trigger any command or event that deletes data, it will be deleted instantly and **CANNOT** be restored.`)
        .addField(`Nitro`, `The nitro mockup allows users without nitro to use animated or external emojis. You can view this server's emoji list by using the \`${guild.prefix}ael\` command, if wanted you can enable this feature by running \`${guild.prefix}nitro on\``)
        .addField(`Donate`, `Commands take a lot of time to create and maintain especially by one person, [Donating to ${client.user.username}](${client.util.link.donate}) is one of the best ways to support us. Once you donate and join the [support server](${client.util.link.support}), we can give you a higher role on ${client.user.username} and gives access to special commands and allows you to show your support on the \`${guild.prefix}jonin?\` command.`)
        .addField(`Hierarchy`, client.src.code(`.\n├── Developers\n│   └── Moderators\n└── Supporters\n    ├── Yae Village Alder\n    ├── Yae Village Gate Keeper\n    ├── Yae Village Shrine Maiden\n    └── Yae Villager (Default)`, `fix`))
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "about",
    about: "About %B%",
    usage: ["%P%about"],
}