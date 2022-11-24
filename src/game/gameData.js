const fs = require(`fs`)
const path = require(`path`)

function saveData(data, filename) {
    fs.writeFile(path.join(__dirname, `..`, `saves`, filename), JSON.stringify(data), (err) => {
        if(err) {
            throw err
        }
    })
}

/**
 * @param {string} guildId
 * @param {object} players
 * @param {Logger} logger
 */
function savePlayers(guildId, players, logger = null) {
    let filename = `${guildId}_players.json`
    
    try {
        saveData(players, filename)
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`)
        }

        throw err
    }

    if(logger) {
        logger.log(`Saved ${filename}`)
    }
}

/**
 * @param {string} guildId 
 * @param {object} quests
 * @param {Logger} logger
 */
function saveQuests(guildId, quests, logger = null) {
    let filename = `${guildId}_quests.json`
    
    try {
        saveData(quests, filename)
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`)
        }

        throw err
    }

    if(logger) {
        logger.log(`Saved ${filename}`)
    }
}

/**
 * @param {string} guildId
 * @param {object} config
 * @param {Logger} logger
 */
function saveConfig(guildId, config, logger = null) {
    let filename = `${guildId}_config.json`

    try {
        saveData(config, filename)
    } catch(err) {
        if(logger) {
            logger.log(`Error saving ${filename}`)
        }

        throw err
    }

    if(logger) {
        logger.log(`Saved ${filename}`)
    }
}

/**
 * @param {string} guildId
 * @param {Logger} logger
 * @returns {object | undefined}
 */
function loadPlayers(guildId, logger = null) {
    let filename = `${guildId}_players.json`
    let players

    try {
        players = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`)
        }
        return
    }
    
    if(logger) {
        logger.log(`Loaded ${filename}`)
    }

    return players
}

/**
 * @param {string} guildId
 * @param {Logger} logger
 * @returns {object | undefined}
 */
function loadQuests(guildId, logger = null) {
    let filename = `${guildId}_quests.json`
    let quests

    try {
        quests = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`)
        }

        return
    }
    
    if(logger) {
        logger.log(`Loaded ${filename}`)
    }

    return quests
}

/**
 * @param {string} guildId
 * @param {Logger} logger 
 * @returns {GuildConfig | undefined}
 */
function loadConfig(guildId, logger = null) {
    let filename = `${guildId}_config.json`
    let config

    try {
        config = require(path.join(__dirname, `..`, `saves`, filename))
    } catch(err) {
        if(logger) {
            logger.log(`Error loading ${filename}`)
        }

        return
    }

    if(logger) {
        logger.log(`Loaded ${filename}`)
    }

    return config
}

module.exports = {
    savePlayers,
    saveQuests,
    saveConfig,
    loadPlayers,
    loadQuests,
    loadConfig
}