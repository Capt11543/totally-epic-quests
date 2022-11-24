class TurnInMessage {
    /** @type {string} */
    playerId
    /** @type {string} */
    questName

    /**
     * @param {string} playerId 
     * @param {string} questName 
     */
    constructor(playerId, questName) {
        this.playerId = playerId
        this.questName = questName
    }
}

module.exports = TurnInMessage