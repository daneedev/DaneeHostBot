const { Listener } = require("gcommands");
const Help = require("../models/Help")

new Listener({
    name: "autorole",
    event: "guildMemberAdd",
    run: async (member) => {
        const role = member.guild.roles.cache.find(r => r.id === "1228768553981710467")
        member.roles.add(role)
    }
})