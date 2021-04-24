module.exports.run = async (client, message, args, guild) => {
    var langs = {
        'af': 'Afrikaans',
        'sq': 'Albanian',
        'am': 'Amharic',
        'ar': 'Arabic',
        'hy': 'Armenian',
        'az': 'Azerbaijani',
        'eu': 'Basque',
        'be': 'Belarusian',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'bg': 'Bulgarian',
        'ca': 'Catalan',
        'ceb': 'Cebuano',
        'ny': 'Chichewa',
        'zh-cn': 'Chinese Simplified',
        'zh-tw': 'Chinese Traditional',
        'co': 'Corsican',
        'hr': 'Croatian',
        'cs': 'Czech',
        'da': 'Danish',
        'nl': 'Dutch',
        'en': 'English',
        'eo': 'Esperanto',
        'et': 'Estonian',
        'tl': 'Filipino',
        'fi': 'Finnish',
        'fr': 'French',
        'fy': 'Frisian',
        'gl': 'Galician',
        'ka': 'Georgian',
        'de': 'German',
        'el': 'Greek',
        'gu': 'Gujarati',
        'ht': 'Haitian Creole',
        'ha': 'Hausa',
        'haw': 'Hawaiian',
        'iw': 'Hebrew',
        'hi': 'Hindi',
        'hmn': 'Hmong',
        'hu': 'Hungarian',
        'is': 'Icelandic',
        'ig': 'Igbo',
        'id': 'Indonesian',
        'ga': 'Irish',
        'it': 'Italian',
        'ja': 'Japanese',
        'jw': 'Javanese',
        'kn': 'Kannada',
        'kk': 'Kazakh',
        'km': 'Khmer',
        'ko': 'Korean',
        'ku': 'Kurdish (Kurmanji)',
        'ky': 'Kyrgyz',
        'lo': 'Lao',
        'la': 'Latin',
        'lv': 'Latvian',
        'lt': 'Lithuanian',
        'lb': 'Luxembourgish',
        'mk': 'Macedonian',
        'mg': 'Malagasy',
        'ms': 'Malay',
        'ml': 'Malayalam',
        'mt': 'Maltese',
        'mi': 'Maori',
        'mr': 'Marathi',
        'mn': 'Mongolian',
        'my': 'Myanmar (Burmese)',
        'ne': 'Nepali',
        'no': 'Norwegian',
        'ps': 'Pashto',
        'fa': 'Persian',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sm': 'Samoan',
        'gd': 'Scots Gaelic',
        'sr': 'Serbian',
        'st': 'Sesotho',
        'sn': 'Shona',
        'sd': 'Sindhi',
        'si': 'Sinhala',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'so': 'Somali',
        'es': 'Spanish',
        'su': 'Sundanese',
        'sw': 'Swahili',
        'sv': 'Swedish',
        'tg': 'Tajik',
        'ta': 'Tamil',
        'te': 'Telugu',
        'th': 'Thai',
        'tr': 'Turkish',
        'uk': 'Ukrainian',
        'ur': 'Urdu',
        'uz': 'Uzbek',
        'vi': 'Vietnamese',
        'cy': 'Welsh',
        'xh': 'Xhosa',
        'yi': 'Yiddish',
        'yo': 'Yoruba',
        'zu': 'Zulu'
    }

    let keys = Object.keys(langs)
    let values = Object.values(langs)
    let [code1, code2] = [[], []]

    for (let i = 0; i < Math.floor(keys.length/2); i++) {
        code1.push(`\`${keys[i]}\` ${values[i]}`)
    }
    for (let i = Math.floor(keys.length/2); i < keys.length; i++) {
        code2.push(`\`${keys[i]}\` ${values[i]}`)
    }

    if (!args[0]) return message.channel.send(client.comment(`This server's language is set to ${langs[guild.translate]} [${guild.translate}]`))
    if (args[0].toLowerCase() === `help`) {
        let embed = client.embed()
        .setDescription(client.src.code(`EX: ${guild.prefix}${module.exports.code.title} es`))
        .addField(`\u200b`, code1.join(`\n`), true)
        .addField(`\u200b`, code2.join(`\n`), true)
        message.channel.send(embed)
    }
    let lang = langs[args[0].toLowerCase()]
    if (!lang) return message.channel.send(client.comment(`ERROR: Invalid Input, ${guild.prefix}${module.exports.code.title} help for more info`))
    client.db._guilds.updateOne({ id: message.guild.id }, { $set: { translate: args[0].toLowerCase() } }, async (error) => {
        if (error) client.error(error)
        return message.channel.send(client.comment(`SUCCESS: Default language updated to ${lang}`))
    })
}

module.exports.code = {
    title: "lang",
    about: "Manage the default language for the server",
    usage: ["%P%lang"]
} 