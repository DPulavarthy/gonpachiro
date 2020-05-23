module.exports.run = async (client, message, args, guilds, con) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    let input = args.join(" ");
    if (!input) {
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return send.log(message);
    } else {
        let { body } = await require(`superagent`).get(`http://ip-api.com/json/${input}?fields=33292287`);
        try {
            if (body.status != `fail`) {
                let check = client.emojis.cache.get(client.util.emoji.check),
                    cross = client.emojis.cache.get(client.util.emoji.cross),
                    field = ``;

                field += `${client.arrow} Location: ${body.city || `N/A`}, ${body.regionName || `N/A`}[${body.region || `N/A`}]\n`;
                field += `${client.arrow} Country: ${body.country || `N/A`}[${body.countryCode || `N/A`}]\n`;
                field += `${client.arrow} Continent: ${body.continent || `N/A`}[${body.continentCode || `N/A`}]\n`;
                field += `${client.arrow} Postal code: ${body.zip || `N/A`}\n`;
                field += `${client.arrow} Timezone: ${body.timezone || `N/A`}\n`;
                field += `${client.arrow} Currency: ${body.currency || `N/A`}\n`;
                field += `${client.arrow} Latitude: ${body.lat || `N/A`}\n`;
                field += `${client.arrow} Longitude: ${body.lon || `N/A`}\n`;
                field += `${client.arrow} ISP: ${body.isp || `N/A`}\n`;
                field += `${client.arrow} District: ${body.district || `N/A`}\n`;
                field += `${client.arrow} ORG: ${body.org || `N/A`}\n`;
                field += `${client.arrow} AS: ${body.as || `N/A`}\n`;
                field += `${client.arrow} ASname: ${body.asname || `N/A`}\n`;
                field += `${client.arrow} Reverse IP: ${body.reverse || `N/A`}\n`;
                field += `${client.arrow} [${body.proxy ? check : cross || `N/A`}]Proxy, VPN or Tor\n`;
                field += `${client.arrow} [${body.mobile ? check : cross || `N/A`}]Mobile\n`;
                field += `${client.arrow} [${body.hosting ? check : cross || `N//A`}]Hosting\n`;

                const embed = client.send.embed()
                    .setTitle(body.query)
                    .setDescription(field)
                message.channel.send(embed)
            } else {
                message.channel.send(`Invalid IP`);
            }
            return client.send.log(message);
        } catch (error) {
            client.send.report(message, error);
            return client.send.log(message);
        }
    }
}


module.exports.code = {
    name: "ip",
    description: "Information about [IP ADRESS]",
    group: "api",
    usage: ["/PREFIX/ip [IP ADRESS]"],
    accessableby: "Villagers",
    aliases: ["ip"]
} 