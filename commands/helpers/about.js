module.exports.run = async (client, message, args, prefix) => {
    let field = [];
    field.push(`${client.arrow} Age: 500+ [Deceased]`);
    field.push(`${client.arrow} Bot version created: ${client.user.createdAt.toDateString()}`);
    field.push(`${client.arrow} Birthday: July 22`);
    field.push(`${client.arrow} Height: 194cm (including ears)`);
    field.push(`${client.arrow} Weight: 56kg`);
    field.push(`${client.arrow} Type: ${client.emojis.cache.get(client.util.emoji.bio).toString()} Biological [BIO]`);

    const embed = client.embed()
        .setAuthor(`About ${client.user.username}`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support)
        .setDescription(field)
        .addField(`Overview`, `I am [${client.user.username}](${client.util.link.info}), a discord bot made by [${client.users.cache.get(client.util.id.creator.id).tag}](${client.util.id.creator.link}) and [${client.users.cache.get(client.util.id.cocreator.id).tag}](${client.util.id.cocreator.link}), I am a multi-purpose bot for a shrine maiden at Yae Village. A bot for GIFs, Weather, Management, Info, osu!, Google searches, and many more features. If you liked ${client.user.username}, [vote](${client.util.link.vote}) or [donate](${client.util.link.donate}), click [here](${client.util.link.website}) if you want to know more information about me or my devs.`, false)
        .addField(`Other Information`, `I have hierarchies for users, everyone is a villager, if you are a supporter you can become a shrine maiden, gate keeper, or alder! Gonpachiro users are approved users for secret features for ${client.user.username} but above them are devs, and finally at the top are owners, below is a tree visualizing the status of my members.`, false)
        .addField(`Donate`, `Commands take a lot of time to create and maintain especially by one person, [Donating to ${client.user.username}](${client.util.link.donate}) is one of the best ways to support us. Once you donate and join the [support server](${client.util.link.support}), we can give you a higher role on ${client.user.username} and gives access to special commands and allows you to show your support on the \`${prefix}jonin?\` command.`, false)
        .addField(`Hierarchy`, `\`\`\`fix\n.\n├── Owners\n│   ├── Developers\n│   ├── Moderators\n│   └── Gonpachiro\n└── Supporters\n    ├── Yae Village Alder\n    ├── Yae Village Gate Keeper\n    ├── Yae Village Shrine Maiden\n    └── Yae Villager (Default)\n\`\`\``, false)
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "about",
    about: "About %B%",
    usage: ["%P%about"],
    dm: true,
    cooldown: 30,
}