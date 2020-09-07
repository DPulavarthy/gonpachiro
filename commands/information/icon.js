module.exports.run = async (client, message) => {
    const embed = client.embed()
        .setTitle(message.guild.name)
        .setDescription(message.guild.iconURL().toLowerCase().substring(message.guild.iconURL().lastIndexOf(`/`) + 1, message.guild.iconURL().lastIndexOf(`/`) + 3) === `a_` ? `[GIF](${message.guild.iconURL({ format: "gif", dynamic: true, size: 2048 })}) **|** [WEBP](${message.guild.iconURL({ size: 2048 })})` : `[PNG](${message.guild.iconURL({ format: "png", dynamic: true, size: 2048 })}) **|** [JPG](${message.guild.iconURL({ format: "jpg", dynamic: true, size: 2048 })}) **|** [JPEG](${message.guild.iconURL({ format: "jpeg", dynamic: true, size: 2048 })}) **|** [WEBP](${message.guild.iconURL({ format: "webp", dynamic: true, size: 2048 })})`)
        .setImage(message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
    message.channel.send(embed);
    return client.log(message);
}

module.exports.code = {
    title: "icon",
    about: "Get the server icon",
    usage: ["%P%icon"],
}