module.exports = async (client, time) => {
    let { MongoClient } = require(`mongodb`)
    let database = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true })
    database.connect(async error => {
        if (error) {
            console.log(`[ERROR!]: [-----] ${error}`.errors)
            client.destroy()
            return database.close()
        }
        client.db = database.db(`bronya`)
        client.db.listCollections().toArray(async (error, collections) => {
            if (error) console.log(`[ERROR!]: [-----] ${error}`.errors)
            if (collections.length < 1) {
                console.log(`[ERROR!]: [-----] Required Database not found!`.errors)
                client.destroy()
                return database.close()
            }
            let [exists, required] = [[], [`data`, `guilds`]]
            collections.forEach(collection => exists.push(collection.name))
            for await (let collection of required) {
                if (!exists.includes(collection)) {
                    console.log(`[ISSUE!]: [-----] Collection [${collection}] was not found`.yellow)
                    await client.db.createCollection(collection, async (error) => {
                        if (error) console.log(`[ERROR!]: [-----] Collection [${collection}] failed to create: ${error}`.errors)
                        else console.log(`[PASSED]: [-----] Collection [${collection}] was successfully created`.yellow)
                    })
                }
            }
        })
        client.db._data = client.db.collection(`data`)
        client.db._guilds = client.db.collection(`guilds`)
        console.log(`[PROGRM]: ${require(`./src.js`).time(time)} Database Connection Successful!`.yellow)
    })

}