const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`Replies with "pong"`),
    async execute(logger, interaction) {
        logger.newline()
        logger.log(`${interaction.user.tag} used /ping`)
        
        await interaction.reply({content: `Pong!`, ephemeral: true})
    }
}