const { Listener } = require("gcommands");
const Help = require("../models/Help")

new Listener({
    name: "helper",
    event: "messageCreate",
    run: async (message) => {
        if (message.channel.id === "1228984956492058634") {
            if (message.author.bot) return;
            const helps = await Help.findAll()
            helps.forEach((help) => {
                if (message.content.toLowerCase().includes(help.error.toLowerCase())) {
                    message.reply(help.help)
                }
            })
    }
    }
})