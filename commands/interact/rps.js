module.exports.run = async (client, message, args, prefix) => {

    let input = args[0];
    if (!input) { return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else {
        react = getNum(input) || parseInt(args[0]);
        let emoji = Math.floor((Math.random() * 3) + 1);
        try {
            if (react === emoji) {
                const embed = client.embed()
                    .setAuthor(`A tie!`, `https://i.imgur.com/Cxihfti.png`, client.util.link.support)
                if (emoji === 1) {
                    embed.setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ⛰️\n${client.user.username} - ⛰️`);
                } else if (emoji === 2) {
                    embed.setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - 📰\n${client.user.username} - 📰`);
                } else if (emoji === 3) {
                    embed.setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ✂️\n${client.user.username} - ✂️`);
                }
                message.channel.send(embed);
                return client.log(message);
            } else {
                winType(react, emoji);
            }
        } catch (error) {
            client.src.report(message, error);
            return client.log(message);
        }
    }


    function winType(user, bot) {
        const embed = client.embed()
        if (user === 1 && bot === 2) {
            embed
                .setAuthor(`Winner: ${client.user.tag}`, client.user.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ⛰️\n${client.user.username} - 📰`);
        } else if (user === 1 && bot === 3) {
            embed
                .setAuthor(`Winner: ${message.guild.members.cache.get(message.author.id).displayName}`, message.author.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ⛰️\n${client.user.username} - ✂️`);
        } else if (user === 2 && bot === 1) {
            embed
                .setAuthor(`Winner: ${message.guild.members.cache.get(message.author.id).displayName}`, message.author.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - 📰\n${client.user.username} - ⛰️`);
        } else if (user === 2 && bot === 3) {
            embed
                .setAuthor(`Winner: ${client.user.tag}`, client.user.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - 📰\n${client.user.username} - ✂️`);
        } else if (user === 3 && bot === 1) {
            embed
                .setAuthor(`Winner: ${client.user.tag}`, client.user.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ✂️\n${client.user.username} - ⛰️`);
        } else if (user === 3 && bot === 2) {
            embed
                .setAuthor(`Winner: ${message.guild.members.cache.get(message.author.id).displayName}`, message.author.displayAvatarURL(), client.util.link.support)
                .setDescription(`${message.guild.members.cache.get(message.author.id).displayName} - ✂️\n${client.user.username} - 📰`);
        } else {
            if (input > 3 || input < 1) {
                message.channel.send(client.src.error(`Your input must be in the range of 1 to 3`));
                return client.log(message);
            } else {
                message.channel.send(client.src.error(`ERROR: Something went wrong (${client.config.prefix}${client.src.clean(module.exports.code.name)})`));
                return client.log(message);
            }
        }
        message.channel.send(embed);
        return client.log(message);
    }

    function getNum(input) {
        let output = false;
        if (input === `⛰️` || input.toLowerCase() === `mountain` || input.toLowerCase() === `rock` || input.toLowerCase() === `r` || input.toLowerCase() === `m`) {
            output = 1;
        } else if (input === `📰` || input.toLowerCase() === `paper` || input.toLowerCase() === `newspaper` || input.toLowerCase() === `p` || input.toLowerCase() === `n`) {
            output = 2;
        } else if (input === `✂️` || input.toLowerCase() === `scissors` || input.toLowerCase() === `s`) {
            output = 3;
        }
        return output;
    }
}

module.exports.code = {
    title: "rps",
    about: "A game of rps with the bot",
    usage: ["%P%rps [(1)(⛰️)(rock) or (2)(📰)(paper) or (3)(✂️)(scissors)]"],
    dm: true,
}