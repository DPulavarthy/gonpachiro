module.exports.run = async (client, message, args) => {
    if (!args.join(` `)) {
        let field = [];
        client.keys.forEach(key => field.push(`${client.arrow} \`${key.case}\` = ${key.data}`));
        message.channel.send(client.embed().setAuthor(`${client.user.username}'s Keys`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(field.join(`\n`)));
        return client.log(message);
    } else {
        let body = client.keys.get(args.join(` `).toUpperCase());
        if (!body) { message.channel.send(client.src.comment(`No key found for \`${args.join(` `)}\``)); return client.log(message); }
        else { message.channel.send(client.embed().setAuthor(`${client.user.username}'s Key`, client.user.avatarURL({ format: "png", dynamic: true, size: 2048 }), client.util.link.support).setDescription(`\`${body.case}\` = ${body.data}`)); return client.log(message); };
    }
}

module.exports.code = {
    title: "key",
    about: "Information on some of the formatting for %B%'s commands",
    usage: ["%P%key (TYPE)"],
    alias: ["legend"],
}