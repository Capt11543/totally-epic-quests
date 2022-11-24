const { loadConfig, loadQuests, loadPlayers, savePlayers, saveQuests, saveConfig } = require("../game/gameData.js")
const { PermissionFlagsBits } = require(`discord.js`)
const { levelUp } = require(`../game/player.js`)
const { addRankRole } = require("../game/rankRole.js")

module.exports = {
    name: `approve`,
    async execute(logger, interaction) {
        logger.newline()
        logger.log(`${interaction.user.tag} pressed an "approve" button on message ${interaction.message.id}`)

        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            logger.log(`${interaction.user.tag} had insufficient permissions`)
            return interaction.reply({content: `You do not have permission to do this!`, ephemeral: true})
        }
        
        const config = loadConfig(interaction.guildId, logger)
        const turnInMessage = config.turnInMessages[interaction.message.id]

        if(!turnInMessage) {
            logger.log(`There was no turn in message data associated with this message`)
            return interaction.update({content: `This message did not have any associated turn-in request data!  How strange...`, components: []})
        }

        const players = loadPlayers(interaction.guildId, logger)
        if(!players[turnInMessage.playerId]) {
            logger.log(`There is no player with id ${turnInMessage.playerId}`)
            logger.newline
            
            delete config.turnInMessages[interaction.message.id]
            return interaction.update({content: `The player with that ID does not have a Totally Epic Quests profile!`, components: []})
        }

        const quests = loadQuests(interaction.guildId, logger)
        if(!quests[turnInMessage.questName]) {
            logger.log(`There is no quest named ${turnInMessage.questName}`)

            players[turnInMessage.playerId].currentQuest = ""
            delete config.turnInMessages[interaction.message.id]
            return interaction.update({content: `There is no quest named ${turnInMessage.questName}!`, components: []})
        }

        let leveledUp = false
        players[turnInMessage.playerId].experience += quests[turnInMessage.questName].reward
        while(players[turnInMessage.playerId].experience >= players[turnInMessage.playerId].expToNextLevel) {
            levelUp(players[turnInMessage.playerId])
            leveledUp = true
        }
        
        players[turnInMessage.playerId].currentQuest = ""
        quests[turnInMessage.questName].completedBy.push(turnInMessage.playerId)
        delete config.turnInMessages[interaction.message.id]

        logger.log(`Successfully approved the turn-in request`)
        logger.log(`The player is now level ${players[turnInMessage.playerId].level} and has ${players[turnInMessage.playerId].experience} experience`)

        addRankRole(logger, players[turnInMessage.playerId], turnInMessage.playerId, config, interaction.guild)

        savePlayers(interaction.guildId, players, logger)
        saveQuests(interaction.guildId, quests, logger)
        saveConfig(interaction.guildId, config, logger)

        interaction.guild.channels.fetch(config.messageChannel)
            .then(channel => interaction.client.users.fetch(turnInMessage.playerId)
                .then(user => {
                    interaction.guild.members.fetch(user)
                        .then(member => interaction.update({content: `${member.displayName}'s ${turnInMessage.questName} turn-in request was approved by ${interaction.member.displayName}!`, components: []}))

                    channel.send(`Congratulations ${user}, you have completed the ${turnInMessage.questName} quest and recieved your rewards!`)
                    if(leveledUp) {
                        channel.send(`You've also leveled up to level ${players[turnInMessage.playerId].level}!`)
                    }
                }))
    }
}