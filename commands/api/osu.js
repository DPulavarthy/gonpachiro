const osu = require(`node-osu`);

module.exports.run = async (client, message, args, prefix) => {
    const osuApi = new osu.Api(client.key.osu, { notFoundAsError: false, completeScores: false, parseNumeric: false });
    let loading = await message.channel.send(client.src.loading()), direct;
    if (args[0]) { direct = args[0].toUpperCase(); };
    if (!direct || (direct != `U` && direct != `B`) || !args.slice(1).join(` `)) { loading.delete(); return client.src.require(message, module.exports.code.usage[0], module.exports.code.description, `Beatmap ID:`, prefix, `https://i.imgur.com/dyed9No.gif`); };
    switch (direct) {
        case `U`:
            osuApi.getUser({ u: args.slice(1).join(` `) }).then(async user => {
                try {
                    let field = [];
                    field.push(`${client.arrow} Username: ${user.name}`);
                    field.push(`${client.arrow} User ID: ${user.id}`);
                    field.push(`${client.arrow} Joined: ${user.raw_joinDate || `N/A`}`);
                    field.push(`${client.arrow} Accuracy: ${user.accuracy || `N/A`}`);
                    field.push(`${client.arrow} User lvl: ${user.level || `N/A`}`);
                    field.push(`${client.arrow} Country: ${user.country || `N/A`}`);
                    field.push(`${client.arrow} Scores`);
                    field.push(`${client.blank} Ranked Score: ${user.scores.ranked || `N/A`}`);
                    field.push(`${client.blank} Total Score: ${user.scores.total || `N/A`}`);
                    field.push(`${client.arrow} P.P.`);
                    field.push(`${client.blank} Raw: ${user.pp.raw || `N/A`}`);
                    field.push(`${client.blank} Rank: ${user.pp.rank || `N/A`}`);
                    field.push(`${client.blank} Country rank: ${user.pp.countryRank || `N/A`}`);
                    field.push(`${client.arrow} Total sec. played: ${user.secondsPlayed || `N/A`}`);
                    setTimeout(async () => { loading.edit(client.embed(`https://osu.ppy.sh/`).setTitle(`Stats for ${user.name}`).setDescription(field.join(`\n`))); }, 1000);
                    client.log(message);
                } catch (error) { loading.edit(client.src.comment(`User not found, error: ${error}`)); client.log(message); };
            })
            break;
        case `B`:
            osuApi.getBeatmaps({ b: args.slice(1).join(` `) }).then(async beatmaps => {
                try {
                    let rate = Math.round(parseInt(beatmaps[0].rating) / 2), rating = ``;
                    for (let i = 0; i < 5; i++) { rating += i <= rate ? client.emojis.cache.get(client.emoji.glow_star).toString() : client.emojis.cache.get(client.emoji.empty_star).toString(); };
                    let stats = [], data = [], info = [], content = [], other = [];

                    stats.push(`${client.arrow} Max combo: ${beatmaps[0].maxCombo || `N/A`}`);
                    stats.push(`${client.arrow} Difficulty ${beatmaps[0].difficulty.rating || `N/A`}`);
                    stats.push(`${client.arrow} Number of plays: ${beatmaps[0].counts.plays || `N/A`}`);

                    data.push(`${client.arrow} Title: ${beatmaps[0].title}`);
                    data.push(`${client.arrow} Map ID: ${beatmaps[0].id}`);
                    data.push(`${client.arrow} Creator: ${beatmaps[0].creator || `N/A`}`);
                    data.push(`${client.arrow} Version: ${beatmaps[0].version || `N/A`}`);
                    data.push(`${client.arrow} Map source: ${beatmaps[0].source || `N/A`}`);
                    data.push(`${client.arrow} Languages: ${beatmaps[0].language || `N/A`}`);

                    info.push(`${client.arrow} Approval status: ${beatmaps[0].approvalStatus || `N/A`}`);
                    info.push(`${client.arrow} Submit date: ${beatmaps[0].raw_submitDate || `N/A`}`);
                    info.push(`${client.arrow} Approved date: ${beatmaps[0].raw_approvedDate || `N/A`}`);
                    info.push(`${client.arrow} Last update: ${beatmaps[0].raw_lastUpdate || `N/A`}`);

                    content.push(`${client.arrow} Mode: ${beatmaps[0].mode || `N/A`}`);
                    content.push(`${client.arrow} BPM: ${beatmaps[0].bpm || `N/A`}`);
                    content.push(`${client.arrow} Rating: ${beatmaps[0].rating}/10`);
                    content.push(`${client.arrow} Objects`);
                    content.push(`${client.blank} Normal: ${beatmaps[0].objects.normal || `N/A`}`);
                    content.push(`${client.blank} Slider: ${beatmaps[0].objects.slider || `N/A`}`);
                    content.push(`${client.blank} Spinner: ${beatmaps[0].objects.spinner || `N/A`}`);

                    other.push(`${client.arrow} Downloadable: ${beatmaps[0].hasDownload ? `Yes` : `No` || `N/A`}`);
                    other.push(`${client.arrow} Audio: ${beatmaps[0].hasAudio ? `Yes` : `No` || `N/A`}`);
                    other.push(`${client.arrow} Difficulty`);
                    other.push(`${client.blank} Rating: ${beatmaps[0].difficulty.rating || `N/A`}`);
                    other.push(`${client.blank} Aim: ${beatmaps[0].difficulty.aim || `N/A`}`);
                    other.push(`${client.blank} Speed: ${beatmaps[0].difficulty.speed || `N/A`}`);
                    other.push(`${client.blank} Overall: ${beatmaps[0].difficulty.overall || `N/A`}`);
                    other.push(`${client.blank} Approach: ${beatmaps[0].difficulty.approach || `N/A`}`);
                    other.push(`${client.blank} Drain: ${beatmaps[0].difficulty.drain || `N/A`}`);

                    const embed = client.embed(`https://osu.ppy.sh/`)
                        .setTitle(`Information for ${beatmaps[0].title} [${rating}]`)
                        .addField(`Beatmap Stats`, stats, false)
                        .addField(`Map Data`, data, false)
                        .addField(`Map Info`, info, false)
                        .addField(`Beatmap Content`, content, false)
                        .addField(`Other Info`, other, false)
                    setTimeout(async () => { loading.edit(embed); }, 1000);
                    client.log(message);
                } catch (error) { loading.edit(client.src.embed().setTitle(client.src.comment(`Beatmap not found, error: ${error}`))); client.log(message); };
            })
            break;
    }
}

module.exports.code = {
    title: "osu",
    about: "Information for [OSU! BEATMAP OR USER] u = user, b = beatmap",
    usage: ["%P%osu [u or b] [OSU! BEATMAP OR USER]"],
    dm: true,
}