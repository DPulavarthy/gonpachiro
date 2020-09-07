module.exports.run = async (client, message, args, prefix) => {
    let loading = await message.channel.send(client.src.loading());
    client.database.guilds.find().toArray(async function (error, result) {
        if (error) { client.error(error); };
        let list = [];
        result.forEach(guild => {
            let total = 0, deploy = 0;
            guild.data.forEach(valk => { if (!valk.battle) { deploy++; total += valk.rank; }; });
            list.push({ id: guild.id, success: guild.attacked.length, rank: total, ready: `${deploy}/${guild.data.length}` });
        })
        if (list.length < 1) { loading.edit(client.src.comment(`No servers are ranked.`)); return client.log(message); };
        list.sort(function (a, b) { return b.rank - a.rank });
        switch (args.join(` `).toUpperCase()) {
            case `TOP`:
                let field = [];
                if (list.length > 10) { for (let i = 0; i < 10; i++) { field.push(`${i + 1}.) ${client.guilds.cache.get(list[i].id).name} [${list[i].id}]: Rank [${list[i].rank}]\nSuccessful Attacks Today [${list[i].success}] Valks Ready For Deployment [${list[i].ready}]\n`); }; }
                else { for (let i = 0; i < list.length; i++) { field.push(`${i + 1}.) ${client.guilds.cache.get(list[i].id).name} [${list[i].id}]: Rank [${list[i].rank}]\nSuccessful Attacks Today [${list[i].success}] Valks Ready For Deployment [${list[i].ready}]\n`); }; };
                loading.delete();
                message.channel.send(client.src.code(field.join(`\n`)));
                client.log(message);
                break;
            default:
                let i = 0, next = true, index = 0;
                while (next) {
                    if (i >= list.length) { loading.edit(client.src.comment(`${message.guild.name} does not have a game setup, run \'${prefix}setup\' to begin the game.`)); return client.log(message); };
                    if (list[i].id === message.guild.id) { index = i; next = false; };
                    i++;
                }
                if (index > 10) {
                    let field = [];
                    for (let i = 10; i >= 0; i--) {
                        let loc = index - i;
                        field.push(`${loc + 1}.) ${client.guilds.cache.get(list[loc].id).name} [${list[loc].id}]: Rank [${list[loc].rank}]\nSuccessful Attacks Today [${list[loc].success}] Valks Ready For Deployment [${list[loc].ready}]\n`);
                    }
                    loading.delete();
                    message.channel.send(client.src.code(field.join(`\n`)));
                } else {
                    let field = [];
                    for (let i = 0; i < list.length; i++) {
                        field.push(`${i + 1}.) ${client.guilds.cache.get(list[i].id).name} [${list[i].id}]: Rank [${list[i].rank}]\nSuccessful Attacks Today [${list[i].success}] Valks Ready For Deployment [${list[i].ready}]\n`);
                    }
                    loading.delete();
                    message.channel.send(client.src.code(field.join(`\n`)));
                }
                return client.log(message);
        }
    })
}

module.exports.code = {
    title: "rank",
    about: "Find top ranked guilds or guilds with similar total ranks",
    usage: ["%P%rank", "%P%rank top"],
}