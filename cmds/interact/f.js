module.exports.run = async (client, message, args, guild) => {
    client.db._guilds.updateOne({ id: guild.id }, { $set: { f: ++guild.f } }, async (error) => {
        if (error) client.error(error)
        let embed = client.embed()
            .setAuthor(`${message.guild.name} F count: ${guild.f.toLocaleString()}`, message.guild.iconURL({ format: `png`, dynamic: true, size: 2048 }), client.util.link.support)
            .setTitle(`\uD83C\uDDEB **\`${message.guild.members.cache.get(message.author.id).displayName} has paid their respects\`**`)
            .setDescription(args[0] ? `\"${args.join(` `)}\"` : ``)
        message.channel.send(embed)
    })
}

module.exports.code = {
    title: "f",
    about: "Pay your respects",
    usage: ["%P%f"]
}