const osu = require('node-osu');

module.exports.run = async (client, message, args) => {
    if (client.send.status(module.exports.code.name)) { return client.send.disabled(message); }

    const osuApi = new osu.Api(client.util.api.osu, { notFoundAsError: false, completeScores: false, parseNumeric: false });
    let loading = await message.channel.send(client.send.loading()),
        direct;
    if (args[0]) {
        direct = args[0].toLowerCase();
    }
    if (!direct || (direct != `u` && direct != `b`) || !args.slice(1).join(" ")) {
        await loading.delete();
        await client.send.input(message, `Input: \`${client.send.clean(module.exports.code.usage[0])}\` -- Returns: \`${client.send.clean(module.exports.code.description)}\``);
        return client.send.log(message);
    }

    let input = args.slice(1).join(" ");
    if (direct === `u`) {
        osuApi.getUser({ u: input }).then(async user => {
            try {
                let player = ``;
                player += `${client.arrow} Username: ${user.name}\n`;
                player += `${client.arrow} User ID: ${user.id}\n`;
                player += `${client.arrow} Joined: ${user.raw_joinDate || `N/A`}\n`;
                player += `${client.arrow} Accuracy: ${user.accuracy || `N/A`}\n`;
                player += `${client.arrow} User lvl: ${user.level || `N/A`}\n`;
                player += `${client.arrow} Country: ${user.country || `N/A`}\n`;
                player += `${client.arrow} Scores\n`;
                player += `${client.blank}${client.arrow} Ranked Score: ${user.scores.ranked || `N/A`}\n`;
                player += `${client.blank}${client.arrow} Total Score: ${user.scores.total || `N/A`}\n`;
                player += `${client.arrow} P.P.\n`;
                player += `${client.blank}${client.arrow} Raw: ${user.pp.raw || `N/A`}\n`;
                player += `${client.blank}${client.arrow} Rank: ${user.pp.rank || `N/A`}\n`;
                player += `${client.blank}${client.arrow} Country rank: ${user.pp.countryRank || `N/A`}\n`;
                player += `${client.arrow} Total sec. played: ${user.secondsPlayed || `N/A`}`;

                const embed = client.send.embed(`https://osu.ppy.sh/`)
                    .setTitle(`Stats for ${user.name}`)
                    .setDescription(player)
                await loading.edit(embed);
                return client.send.log(message);
            } catch (error) {
                loading.edit(client.send.error(`User not found, error: ${error}`));
                return client.send.log(message);
            }
        })
    }

    if (direct === `b`) {
        osuApi.getBeatmaps({ b: input }).then(async beatmaps => {
            try {
                let rate = Math.round(parseInt(beatmaps[0].rating) / 2),
                    rating = ``;
                for (let i = 0; i < 5; i++) {
                    if (i <= rate) {
                        rating += client.emojis.cache.get(client.util.emoji.glow_star).toString();
                    } else {
                        rating += client.emojis.cache.get(client.util.emoji.empty_star).toString();
                    }
                }
                let stats = ``,
                    data = ``,
                    info = ``,
                    content = ``,
                    other = ``;

                stats += `${client.arrow} Max combo: ${beatmaps[0].maxCombo || `N/A`}\n`;
                stats += `${client.arrow} Difficulty ${beatmaps[0].difficulty.rating || `N/A`}\n`;
                stats += `${client.arrow} Number of plays: ${beatmaps[0].counts.plays || `N/A`}\n`;

                data += `${client.arrow} Title: ${beatmaps[0].title}\n`;
                data += `${client.arrow} Map ID: ${beatmaps[0].id}\n`;
                data += `${client.arrow} Creator: ${beatmaps[0].creator || `N/A`}\n`;
                data += `${client.arrow} Version: ${beatmaps[0].version || `N/A`}\n`;
                data += `${client.arrow} Map source: ${beatmaps[0].source || `N/A`}\n`;
                data += `${client.arrow} Languages: ${beatmaps[0].language || `N/A`}\n`;

                info += `${client.arrow} Approval status: ${beatmaps[0].approvalStatus || `N/A`}\n`;
                info += `${client.arrow} Submit date: ${beatmaps[0].raw_submitDate || `N/A`}\n`;
                info += `${client.arrow} Approved date: ${beatmaps[0].raw_approvedDate || `N/A`}\n`;
                info += `${client.arrow} Last update: ${beatmaps[0].raw_lastUpdate || `N/A`}\n`;

                content += `${client.arrow} Mode: ${beatmaps[0].mode || `N/A`}\n`;
                content += `${client.arrow} BPM: ${beatmaps[0].bpm || `N/A`}\n`;
                content += `${client.arrow} Rating: ${beatmaps[0].rating}/10\n`;
                content += `${client.arrow} Objects\n`;
                content += `${client.blank}${client.arrow} Normal: ${beatmaps[0].objects.normal || `N/A`}\n`;
                content += `${client.blank}${client.arrow} Slider: ${beatmaps[0].objects.slider || `N/A`}\n`;
                content += `${client.blank}${client.arrow} Spinner: ${beatmaps[0].objects.spinner || `N/A`}\n`;

                other += `${client.arrow} Downloadable: ${beatmaps[0].hasDownload ? `Yes` : `No` || `N/A`}\n`;
                other += `${client.arrow} Audio: ${beatmaps[0].hasAudio ? `Yes` : `No` || `N/A`}\n`;
                other += `${client.arrow} Difficulty\n`;
                other += `${client.blank}${client.arrow} Rating: ${beatmaps[0].difficulty.rating || `N/A`}\n`;
                other += `${client.blank}${client.arrow} Aim: ${beatmaps[0].difficulty.aim || `N/A`}\n`;
                other += `${client.blank}${client.arrow} Speed: ${beatmaps[0].difficulty.speed || `N/A`}\n`;
                other += `${client.blank}${client.arrow} Overall: ${beatmaps[0].difficulty.overall || `N/A`}\n`;
                other += `${client.blank}${client.arrow} Approach: ${beatmaps[0].difficulty.approach || `N/A`}\n`;
                other += `${client.blank}${client.arrow} Drain: ${beatmaps[0].difficulty.drain || `N/A`}\n`;

                const embed = client.send.embed(`https://osu.ppy.sh/`)
                    .setTitle(`Information for ${beatmaps[0].title} [${rating}]`)
                    .addField(`Beatmap Stats`, stats, false)
                    .addField(`Map Data`, data, false)
                    .addField(`Map Info`, info, false)
                    .addField(`Beatmap Content`, content, false)
                    .addField(`Other Info`, other, false)
                await loading.edit(embed)
                return client.send.log(message);
            } catch (error) {
                loading.edit(client.send.error(`Beatmap not found, error: ${error}`));
                return client.send.log(message);
            }
        })
    }
}


module.exports.code = {
    name: "osu",
    description: "Information for [OSU! BEATMAP OR USER] u = user, b = beatmap",
    group: "api",
    usage: ["/PREFIX/osu [u or b] [OSU! BEATMAP OR USER]"],
    accessableby: "Villagers",
    aliases: ["osu"]
}