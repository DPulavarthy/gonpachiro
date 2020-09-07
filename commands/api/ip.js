module.exports.run = async (client, message, args, prefix) => {
    if (!args.join(` `)) { loading.delete(); return client.src.invalid(message, module.exports.code.usage[0], module.exports.code.about, null, prefix); }
    else {
        let { body } = await require(`superagent`).get(`http://ip-api.com/json/${args.join(` `)}?fields=33292287`).catch(error => { return client.src.report(message, error); });
        if (body.status != `fail`) {
            let check = client.emojis.cache.get(client.emoji.check), cross = client.emojis.cache.get(client.emoji.cross), field = [];
            field.push(`${client.arrow} Location: ${body.city || `N/A`}, ${body.regionName || `N/A`}[${body.region || `N/A`}]`);
            field.push(`${client.arrow} Country: ${body.country || `N/A`}[${body.countryCode || `N/A`}]`);
            field.push(`${client.arrow} Continent: ${body.continent || `N/A`}[${body.continentCode || `N/A`}]`);
            field.push(`${client.arrow} Postal code: ${body.zip || `N/A`}`);
            field.push(`${client.arrow} Timezone: ${body.timezone || `N/A`}`);
            field.push(`${client.arrow} Currency: ${body.currency || `N/A`}`);
            field.push(`${client.arrow} Latitude: ${body.lat || `N/A`}`);
            field.push(`${client.arrow} Longitude: ${body.lon || `N/A`}`);
            field.push(`${client.arrow} ISP: ${body.isp || `N/A`}`);
            field.push(`${client.arrow} District: ${body.district || `N/A`}`);
            field.push(`${client.arrow} ORG: ${body.org || `N/A`}`);
            field.push(`${client.arrow} AS: ${body.as || `N/A`}`);
            field.push(`${client.arrow} ASname: ${body.asname || `N/A`}`);
            field.push(`${client.arrow} Reverse IP: ${body.reverse || `N/A`}`);
            field.push(`${client.arrow} [${body.proxy ? check : cross || `N/A`}]Proxy, VPN or Tor`);
            field.push(`${client.arrow} [${body.mobile ? check : cross || `N/A`}]Mobile`);
            field.push(`${client.arrow} [${body.hosting ? check : cross || `N//A`}]Hosting`);
            message.channel.send(client.embed().setTitle(body.query).setDescription(field.join(`\n`)))
        } else { message.channel.send(client.src.comment(client.src.comment(`Looks like \'${args.join(` `)}\' is an invalid IP.`))); };
        return client.log(message);
    }
}

module.exports.code = {
    title: "ip",
    about: "Information about [IP ADRESS]",
    usage: ["%P%ip [IP ADRESS]"],
    dm: true,
} 