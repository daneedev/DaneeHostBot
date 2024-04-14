const { Command, CommandType, Argument, ArgumentType } = require("gcommands");
const Help = require("../models/Help")

new Command({
    name: "addhelp",
    description: "Add solution to database",
    type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "error",
            description: "Error to search for",
            type: ArgumentType.STRING,
            required: true
        }),
        new Argument({
            name: "help",
            description: "Solution to the error",
            type: ArgumentType.STRING,
            required: true
        })
    ],
    run: async (ctx) => {
        const error = ctx.arguments.getString("error")
        const help = ctx.arguments.getString("help")
        if (ctx.member.roles.cache.find(r => r.id === "1228768447924670474")) {
            await Help.create({ error: error, help: help })
            return ctx.reply("Added to database")
        } else {
            return ctx.reply("You don't have permission to use this command")
        }
    }
})