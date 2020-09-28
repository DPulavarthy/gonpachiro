let client;
let { writeFileSync } = require(`fs`);

module.exports = {
    startup(input) {
        client = input
    },
    async status() {
        await client.user.setActivity(`Just Started Up. What Did I Miss? | ${client.prefix}help`, { type: `LISTENING` });
        setInterval(async () => {
            let key = [
                { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.creator.id).tag} Develop Me`, },
                { type: `WATCHING`, data: `${client.users.cache.get(client.util.id.cocreator.id).tag} Break Me`, },
                { type: `WATCHING`, data: `${client.channels.cache.size.toLocaleString()} Channels`, },
                { type: `WATCHING`, data: `${client.users.cache.size.toLocaleString()} Villagers`, },
                { type: `WATCHING`, data: `${client.guilds.cache.size.toLocaleString()} Guilds`, },
                { type: `WATCHING`, data: `The Yae Village Shrine Maidens`, },
                { type: `WATCHING`, data: `The Yae Village Gate Keepers`, },
                { type: `WATCHING`, data: `The Yae Village Alders`, },
                { type: `PLAYING`, data: `With ${client.lines.toLocaleString()} Lines Of Code`, },
                { type: `PLAYING`, data: `I am Darkbolt Jonin`, },
                { type: `PLAYING`, data: `Not from Narutoï¿½`, },
                { type: `PLAYING`, data: `I am Yae Sakura`, },
                { type: `PLAYING`, data: `Approved by De~Yuo!`, },
                { type: `PLAYING`, data: `jonin.gq`, },
            ];
            let rand = Math.floor(Math.random() * key.length);
            await client.user.setActivity(`${key[rand].data} | ${client.prefix}help`, { type: key[rand].type });
        }, 60 * 1000);
    },
    async guildCreate(guild) {
        let field = [];
        field.push(`${client.arrow} Guild Name: ${guild.name}`);
        field.push(`${client.arrow} Guild ID: ${guild.id}`);
        field.push(`${client.arrow} Members: ${guild.memberCount - 1}`);
        field.push(`${client.arrow} Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
        field.push(`${client.arrow} Bots: ${guild.members.cache.filter(member => member.user.bot).size - 1}`);
        field.push(`${client.arrow} Owner Name: ${guild.owner.user.tag}`);
        field.push(`${client.arrow} Owner ID: ${guild.owner.user.id}`);
        const embed = client.embed().setAuthor(`New Guild Acclaimed!`).setDescription(field.join(`\n`));
        client.channels.cache.get(client.util.id.guilds).send(embed);
    },
    async guildDelete(guild) {
        let field = [];
        field.push(`${client.arrow} Guild Name: ${guild.name}`);
        field.push(`${client.arrow} Guild ID: ${guild.id}`);
        field.push(`${client.arrow} Members: ${guild.memberCount - 1}`);
        field.push(`${client.arrow} Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
        field.push(`${client.arrow} Bots: ${guild.members.cache.filter(member => member.user.bot).size - 1}`);
        field.push(`${client.arrow} Owner Name: ${guild.owner.user.tag}`);
        field.push(`${client.arrow} Owner ID: ${guild.owner.user.id}`);
        const embed = client.embed().setAuthor(`Guild Lost!`).setDescription(field.join(`\n`));
        client.channels.cache.get(client.util.id.guilds).send(embed);
    },
}