module.exports.run = async (client, message) => {
    let field = [];
    field.push(`${client.arrow} [Support Server](${client.util.link.support})`);
    field.push(`${client.arrow} [Donate](${client.util.link.donate})`);
    field.push(`${client.arrow} [Vote](${client.util.link.vote})`);
    field.push(`${client.arrow} [Website](${client.util.link.website})`);
    field.push(`${client.arrow} [Twitter](${client.util.id.creator.link})`);
    message.channel.send(client.embed().setAuthor(`Thanks for Supporting`, client.util.link.logo, client.util.link.support).setDescription(field.join(`\n`)));
    return client.log(message);
}

module.exports.code = {
    title: "support",
    about: "%B%'s support links",
    usage: ["%P%support"],
}