class RankRole {
    /** @type {string} */
    id
    /** @type {number} */
    attainedAtLevel

    /**
     * @param {string} id
     * @param {number} attainedAtLevel 
     */
    constructor(id, attainedAtLevel) {
        this.id = id
        this.attainedAtLevel = attainedAtLevel
    }
}

/**
 * @param {Logger} logger 
 * @param {Guild} guild 
 * @param {GuildConfig} config 
 * @param {string} playerId 
 */
function addRankRole(logger, player, playerId, config, guild) {
    for(const rankRole in config.rankRoles) {
        if(config.rankRoles[rankRole].attainedAtLevel <= player.level) {
            guild.members.fetch(playerId)
                .then(member => guild.roles.fetch(config.rankRoles[rankRole].id)
                    .then(role => {
                        if(!member.roles.cache.some(roleOnMember => roleOnMember.id === role.id)) {
                            member.roles.add(role)
                                .catch(error => {
                                    if(error.name === `DiscordAPIError[50013]`) {
                                        logger.log(`Could not add the ${role.name} role to ${member.user.tag} due to a permissions issue`)

                                        let output = `Attempt to give you the ${role.name} role failed!  Check with server staff and ask if: `
                                        output += `\na) the Totally Epic Quests role has the Manage Roles permission, or`
                                        output += `\nb) the Totally Epic Quests role is above the ${role.name} role in the roles list.`

                                        guild.channels.fetch(config.messageChannel)
                                            .then(channel => {
                                                channel.send(output)
                                                return
                                            })
                                    } else {
                                        console.error(error)
                                    }
                                })

                            logger.log(`Added the ${role.name} role to ${member.user.tag}`)

                            guild.channels.fetch(config.messageChannel)
                                .then(channel => channel.send(`You earned the ${role.name} role!`))
                        }
                    }))
        }
    }
}

module.exports = { RankRole, addRankRole }