module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading());
    const embed = client.send.embed()
        .setTitle(message.guild.name)
        .setDescription(`[PNG](${message.guild.iconURL({ format: "png", dynamic: true, size: 2048 })}) **|** [JPG](${message.guild.iconURL({ format: "jpg", dynamic: true, size: 2048 })}) **|** [JPEG](${message.guild.iconURL({ format: "jpeg", dynamic: true, size: 2048 })}) **|** [WEBP](${message.guild.iconURL({ format: "webp", dynamic: true, size: 2048 })})`)
        .setImage(message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
    await loading.edit(embed);
    return client.send.log(message);
}

module.exports.code = {
    name: "icon",
    description: "Get the server icon",
    group: "information",
    usage: ["/PREFIX/icon"],
    accessableby: "Villagers",
    aliases: ["icon"]
}