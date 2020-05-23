module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let field = ``;
    field += `${client.arrow} Age: 500+ [Deceased]\n`;
    field += `${client.arrow} Bot version created: ${client.user.createdAt.toDateString()}\n`;
    field += `${client.arrow} Birthday: July 22\n`;
    field += `${client.arrow} Height: 194cm (including ears)\n`;
    field += `${client.arrow} Weight: 56kg\n`;
    field += `${client.arrow} Type: ${client.emojis.cache.get(client.util.emoji.bio).toString()} Biological [BIO]\n`;

    const embed = client.send.embed()
        .setAuthor(`About ${client.user.username}`, client.util.link.logo, client.util.link.support)
        .setDescription(field)
        .addField(`Overview`, `I am [${client.user.username}](${client.util.link.info}), a discord bot made by [${client.util.name.creator}](${client.util.name.creator_link}) and [${client.util.name.co_creator}](${client.util.name.co_creator_link}), I am a multi-purpose bot for a shrine maiden at Yae Village. A bot for GIFs, Weather, Management, Info, osu!, Google searches, and many more features. If you liked ${client.user.username}, [vote](${client.util.link.vote}) or [donate](${client.util.link.donate}), click [here](${client.util.link.website}) if you want to know [more information](https://jonin.gq/info.html) about me or my [devs](https://jonin.gq/about-us.html). `, false)
        .addField(`Other Information`, `I have hierarchies for users, everyone is a villager, if you are a supporter you can become a shrine maiden, gate keeper, or alder! Gonpachiro users are approved users for secret features for ${client.user.username} but above them are devs, and finally at the top are owners, below is a tree visualizing the status of my members.`, false)
        .addField(`Hierarchy`, `\`\`\`fix\n.\n├── Owners\n│   ├── Developers\n│   ├── Moderators\n│   └── Gonpachiro\n└── Supporters\n    ├── Yae Village Alder\n    ├── Yae Village Gate Keeper\n    ├── Yae Village Shrine Maiden\n    └── Yae Villager (Default)\n\`\`\``, false)
    await message.channel.send(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "about",
    description: "About /BOT/",
    group: "helpers",
    usage: ["/PREFIX/about"],
    accessableby: "Villagers",
    aliases: ["about"]
}