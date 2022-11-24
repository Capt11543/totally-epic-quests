const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`)
const { loadPlayers, savePlayers, loadConfig } = require("../game/gameData")
const { levelUp } = require(`../game/player.js`)
const { addRankRole } = require("../game/rankRole")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`award`)
        .setDescription(`Award someone a given amount of experience.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option
            .setName(`member`)
            .setDescription(`The member to award experience to`)
            .setRequired(true))
        .addNumberOption(option => option
            .setName(`amount`)
            .setDescription(`The amount of experience to award`)
            .setRequired(true))
        .addStringOption(option => option
            .setName(`reason`)
            .setDescription(`The reason for awarding this experience`)),
    async execute(logger, interaction) {
        logger.newline()
        logger.log(`${interaction.user.tag} used /award`)

        const user = interaction.options.getUser(`member`)
        const amount = interaction.options.getNumber(`amount`)
        const reason = interaction.options.getString(`reason`)

        const players = loadPlayers(interaction.guildId, logger)
        const config = loadConfig(interaction.guildId, logger)

        if(!players[user.id]) {
            logger.log(`${user.tag} does not have a profile`)
            return interaction.reply({content: `That user does not have a Totally Epic Quests profile!`, ephemeral: true})
        }

        let leveledUp = false
        players[user.id].experience += amount
        while(players[user.id].experience >= players[user.id].expToNextLevel) {
            levelUp(players[user.id])
            leveledUp = true
        }

        logger.log(`${user.tag} was given ${amount} experience for: ${reason}`)
        logger.log(`The player is now level ${players[user.id].level} and has ${players[user.id].experience} experience`)

        addRankRole(logger, players[user.id], user.id, config, interaction.guild)

        savePlayers(interaction.guildId, players, logger)

        interaction.reply({content: `Experience awarded!`, ephemeral: true})

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(user.id)
                .then(user => {
                    let output = `${user}, ${interaction.user} has granted you ${amount} experience`

                    if(!reason) {
                        output += `!`
                    } else {
                        output += ` for: ${reason}!`
                    }

                    channel.send(output)
                    if(leveledUp) {
                        channel.send(`You've also leveled up to level ${players[user.id].level}!`)
                    }
                }))
    }
}