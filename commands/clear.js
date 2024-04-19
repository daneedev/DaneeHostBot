const { Command, CommandType, Argument, ArgumentType } = require("gcommands");

new Command({
    name: "clear",
    description: "Clear messages",
    type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: "num",
            description: "Number of messages to clean",
            type: ArgumentType.INTEGER,
            required: true
        })
    ],
    run: async (ctx) => {
        const num = ctx.arguments.getInteger("num");
        if (ctx.member.roles.cache.find(r => r.id === "1228768447924670474")) {
            ctx.channel.bulkDelete(num)
             ctx.reply(`Deleted ${num} messages`).then((msg) => {
                setTimeout(() => {
                    msg.delete()
                }, 5000)
            })
        } else {
            ctx.reply("You don't have permission to use this command")
        }
    }
})