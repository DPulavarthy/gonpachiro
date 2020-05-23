const Pokedex = require('pokedex'),
    pokedex = new Pokedex();
let pokemon = ``;
const { get } = require(`superagent`);

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let loading = await message.channel.send(client.send.loading());

    try {
        if (!args[0]) {
            await loading.delete();
            await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
            return client.send.log(message);
        }
        pokemon = args.join(" ").toLowerCase();
        if (parseInt(args.join(" "))) {
            pokemon = parseInt(args.join(" "));
        }
        pokemon = await data(pokedex.pokemon(pokemon));
        if (!pokemon) { return loading.edit(client.send.embed().setTitle(`Pokemon ${args.join(" ")} was not found: ${error}`)); }
        let { body } = await get(`https://some-random-api.ml/pokedex?pokemon=${pokemon}`);
        if (body.error == 404) { return loading.edit(client.send.embed().setTitle(`Pokemon ${args.join(" ")} was not found: ${body.error}`)); }
        let gifBody = await get(`https://i.some-random-api.ml/pokemon/${pokemon}.gif`),
            imageURL,
            general = ``,
            family = ``,
            info = ``,
            stats = ``;

        if (gifBody.body.error) {
            imageURL = `https://i.some-random-api.ml/pokemon/${pokemon}.png`;
        }
        else {
            imageURL = `https://i.some-random-api.ml/pokemon/${pokemon}.gif`;
        }
        general += `${client.arrow} Name: ${body.name || `N/A`}\n`;
        general += `${client.arrow} ID: #${body.id || `N/A`}\n`;
        general += `${client.arrow} Type: ${body.type || `N/A`}\n`;
        general += `${client.arrow} Generation: ${body.generation || `N/A`}`;

        family += `${client.arrow} Species: ${body.species || `N/A`}\n`;
        family += `${client.arrow} Evolution Stage: ${body.family.evolutionStage || `N/A`}\n`;
        family += `${client.arrow} Evolution Line: ${body.family.evolutionLine || `N/A`}`;

        info += `${client.arrow} Abilities: ${body.abilities || `N/A`}\n`;
        info += `${client.arrow} Height: ${body.height || `N/A`}\n`;
        info += `${client.arrow}  Weight: ${body.weight || `N/A`}\n`;
        info += `${client.arrow} Base experience: ${body.base_experience || `N/A`}\n`;
        info += `${client.arrow} Gender: ${body.gender || `N/A`}\n`;
        info += `${client.arrow} Egg groups: ${body.egg_groups || `N/A`}`;

        stats += `${client.arrow} HP: ${body.stats.hp || `N/A`}\n`;
        stats += `${client.arrow} Attack: ${body.stats.attack || `N/A`}\n`;
        stats += `${client.arrow} Defense: ${body.stats.defense || `N/A`}\n`;
        stats += `${client.arrow} Special Attack: ${body.stats.sp_atk || `N/A`}\n`;
        stats += `${client.arrow} Special Defense: ${body.stats.sp_def || `N/A`}\n`;
        stats += `${client.arrow} Speed: ${body.stats.speed || `N/A`}\n`;
        stats += `${client.arrow} Total: ${body.stats.total || `N/A`}`;


        const embed = client.send.embed()
            .setThumbnail(imageURL)
            .addField(`General Information`, general, false)
            .addField(`Family`, family, false)
            .addField(`Information`, info, false)
            .addField(`Stats`, stats, false)
        await loading.edit(embed);
        return client.send.log(message);
    } catch (error) {
        await loading.delete();
        return client.send.report(message, error);
    }

    async function data(poke) {
        try {
            if (poke.name) {
                return poke.name;
            }
        } catch (error) {
            await loading.delete();
            return client.send.report(message, error, `Pokemon not found`);
        }
    }
}

module.exports.code = {
    name: "pokedex",
    description: "Information for [POKEMON]",
    group: "api",
    usage: ["/PREFIX/pokedex [POKEMON]"],
    accessableby: "Villagers",
    aliases: ["pokedex", "pokemon", "pk"]
}