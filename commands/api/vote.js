module.exports.run = async (client, message, args) => {
    let field = [], user = await client.src.userlist(message, args), DBL = require(`dblapi.js`), dbl = new DBL(client.key.dbl, client), loading = await message.channel.send(client.src.loading());
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    try {
        dbl.isWeekend().then(weekend => {
            dbl.hasVoted(user.id).then(voted => {
                dbl.getBot(client.util.id.client).then(async data => {
                    field.push(`${client.arrow} ${user.username} voted: ${voted ? `Yes` : `No`}`);
                    field.push(`${client.arrow} ${client.user.username}'s total votes: ${parseInt(data.points).toLocaleString()}`);
                    field.push(`${client.arrow} ${client.user.username}'s monthly votes: ${parseInt(data.monthlyPoints).toLocaleString()}`);
                    field.push(`${client.arrow} Is weekend: ${weekend ? `Yes` : `No`}`);
                    field.push(`${client.arrow} Multiplier active: ${weekend ? `Yes` : `No`}`);
                    field.push(`${client.arrow} [Vote for ${client.user.username}](${client.util.link.vote})`);
                    loading.edit(client.embed().setTitle(`${client.user.username}'s Vote Info`).setDescription(field))
                    return client.log(message);
                })

            })
        })
    } catch (error) { loading.delete(); message.channel.send(client.src.comment(`ERROR: ${error}`)); return client.log(message); };
}

module.exports.code = {
    title: "vote",
    about: "Vote info for %B%",
    usage: ["%P%vote"],
}