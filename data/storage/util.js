let { Intents } = require(`discord.js`)

module.exports = {
    main: `#FF0092`,
    client: {
        disableMentions: `everyone`,
        messageCacheLifetime: 60,
        messageCacheMaxSize: 50,
        messageSweepInterval: 60,
        ws: {
            intents: [Intents.ALL],
            properties: { $browser: `Discord Android` }
        }
    },
    channel: {
        pingify: "791219339260067860"
    }
}