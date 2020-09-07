module.exports.run = async (client, message, args) => {
    let user = await client.src.userlist(message, args);
    if (user.length < 1) { message.channel.send(client.src.comment(`That user was not found in ${message.guild.name}`)); return client.log(message); };
    user = await client.users.cache.get(user[0].id);
    let key = [`{A} killed {B} by suffocation!`, `{A} covered {B} in meat sauce and threw them into a cage with an starved tiger...`, `{A} killed {B} with a cheese grater`, `{A} made {B} drink fly spray`, `{A} made {B} eat too much ice cream 🍦🍦🍦`, `{A} buried {B}`, `{A} taught {B} how to drive a car... off a cliff`, `{A} ran over {B} with a unicycle`, `{A} stabbed {B} with a knife 🔪`, `{A} stabbed {B} with a pencil ✏️`, `{A} killed {B} by thousands of papercuts`, `{A} punctured {B}'s heart with a rusty spoon`, `{A} deprived {B} of water`, `{A} licked {B}, where? IDK`, `{A} burned {B} down`, `{A} bisected {B} by portal cut`, `{A} fed {B} to Eldritch abomination`, `{A} slammed {B} into the moon at lightspeed`, `{A} made {B} watch HR PowerPoints for days`, `{A} fed {B} too much cake which caused {B} to die`, `{A} summoned ${client.user.username} to immolate {B}`, `{A} transfigured {B} to a candle and lit it on fire`, `{A} sacrificed {B} to the depths of the Earth`, `{B} died by existence removal`, `{B} died by temporal annihilation`, `{B} died by quantum entanglement`, `{B} died by being eaten be nanites`, `{B} died by reality failure`, `{B} died by being partially stranded in parallel universe thus tearing the individual apart`, `{B} fell into a black hole`];
    await message.channel.send(key[Math.floor(Math.random() * (key.length))].replace(/{A}/g, message.guild.members.cache.get(message.author.id).displayName).replace(/{B}/g, message.guild.members.cache.get(user.id).displayName));
    return client.log(message);
}

module.exports.code = {
    title: "kill",
    about: "Kill message to (USER)",
    usage: ["%P%kill [USER]"],
    alias: ["die", "kms"]
}