module.exports.run = async (client, message, args, guild) => {
    let [user, status] = [await client.src.userlist(message, args)]
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id)
    switch (user.presence.status.toUpperCase()) {
        case `ONLINE`: {
            status = String.fromCodePoint(128994)
            break
        }
        case `IDLE`: {
            status = String.fromCodePoint(128993)
            break
        }
        case `DND`: {
            status = String.fromCodePoint(128308)
            break
        }
        case `STREAMING`: {
            status = String.fromCodePoint(128995)
            break
        }
        case `OFFLINE`: {
            status = String.fromCodePoint(9898)
            break
        }
    }
    let field = []
    field.push()
    message.channel.send(client.comment(`${status} ${user.tag}`).setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: guild.premium ? 4096 : 2048 })).setDescription(user.displayAvatarURL().toLowerCase().substring(user.displayAvatarURL().lastIndexOf(`/`) + 1, user.displayAvatarURL().lastIndexOf(`/`) + 3) === `a_` ? `[GIF](${user.displayAvatarURL({ format: "gif", dynamic: true, size: guild.premium ? 4096 : 2048 })}) **|** [WEBP](${user.avatarURL({ size: guild.premium ? 4096 : 2048 })})` : `[PNG](${user.avatarURL({ format: "png", dynamic: true, size: guild.premium ? 4096 : 2048 })}) **|** [JPG](${user.avatarURL({ format: "jpg", dynamic: true, size: guild.premium ? 4096 : 2048 })}) **|** [JPEG](${user.avatarURL({ format: "jpeg", dynamic: true, size: guild.premium ? 4096 : 2048 })}) **|** [WEBP](${user.avatarURL({ format: "webp", dynamic: true, size: guild.premium ? 4096 : 2048 })})`))
}

module.exports.code = {
    title: "pfp",
    about: "Get the profile picture of (USER)",
    usage: ["%P%pfp (USER)"],
}