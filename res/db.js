let [{ MongoClient }, { timeify }] = [require(`mongodb`), require(`./src.js`)]

module.exports = (client, time) => {
    let database = new MongoClient(process.decode(process.env.MONGODB_CONNECTION_STRING).data, { useUnifiedTopology: true })
    database.connect(error => {
        if (error) {
            console.log(`[ERROR!]: ${timeify()} ${error}`)
            client.destroy()
            database.close()
            return process.exit(1)
        }
        client.db = database.db(process.decode(process.env.MONGODB_CONNECTION_TITLE).data)
        client.db.listCollections().toArray((error, collections) => {
            if (error) console.log(`[ERROR!]: ${timeify()} ${error}`)
            if (collections.length < 1) {
                console.log(`[ERROR!]: ${timeify()} Required Database not found!`)
                client.destroy()
                database.close()
                return process.exit(1)
            }
            let [required, exists] = [[`guilds`], collections.map(coll => coll.name)]
            for (let require of required) {
                if (!exists.includes(require)) {
                    console.log(`[ISSUE!]: ${timeify()} Collection [${require}] was not found`)
                    client.db.createCollection(require, error => {
                        if (error) console.log(`[ERROR!]: ${timeify()} Collection [${require}] failed to create: ${error}`)
                        else console.log(`[PASSED]: ${timeify()} Collection [${require}] was successfully created`)
                    })
                }
            }
            collections.forEach(collection => client.db[`_${collection.name}`] = client.db.collection(collection.name))
        })
        client.db._guildAdd = require(`./src.js`)._guildAdd
        console.log(`[PROGRM]: ${timeify(time)} Database Connection Successful!`)
    })
}