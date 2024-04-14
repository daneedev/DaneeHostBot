const { Listener } = require('gcommands');
const axios = require('axios')
const Discord = require('discord.js')
const token = process.env.apiKey
const dayjs = require('dayjs');
const Server = require('../models/Server')
const isReachable = require('is-reachable');

// Create a new listener listening to the "ready" event
new Listener({
	// Set the name for the listener
	name: 'ready',
	// Set the event to listen to
	event: 'ready',
	// The function thats called when the event occurs
	run: async (client) => { 
        /*const theguild = client.guilds.cache.find(guild => guild.id === '933744509228048485')
        const thechannel = theguild.channels.cache.find(channel => channel.id === '933775700287180831')
        thechannel.messages.fetch('947784895923634187').then(async (msg) => {
            setInterval(async function(){
                axios.get('https://panel.dishost.xyz/api/application/nodes/1', { headers: {"Authorization" : `Bearer ${token}`}}).then(async (node) => {
                axios.get('https://panel.dishost.xyz/api/application/nodes/3', { headers: {"Authorization" : `Bearer ${token}`}}).then(async (node2) => {
                const isReachable = require('is-reachable')
                const statusmsg = new Discord.MessageEmbed
                statusmsg.setTitle('💿 Server Status')
                statusmsg.setColor('#546BE6')
                    const ram =  `Ram: ${Math.floor(node.data.attributes.allocated_resources.memory / 1000 * 100) / 100} GB / ${Math.floor(node.data.attributes.memory / 1000)} GB`
                    const disk = `Disk: ${Math.floor(node.data.attributes.allocated_resources.disk / 1000 * 100) / 100} GB / ${Math.floor(node.data.attributes.disk / 1000)} GB`
                    const ram2 =  `Ram: ${Math.floor(node2.data.attributes.allocated_resources.memory / 1000 * 100) / 100} GB / ${Math.floor(node2.data.attributes.memory / 1000)} GB`
                    const disk2 = `Disk: ${Math.floor(node2.data.attributes.allocated_resources.disk / 1000 * 100) / 100} GB / ${Math.floor(node2.data.attributes.disk / 1000)} GB`
                    console.log(node.data.attributes.relationships)
                    statusmsg.setDescription(`**DE-1 Usage Stats**:\n${ram}\n${disk}\n\n**DE-2 Usage Stats**:\n${ram2}\n${disk2}\n\nhttps://status.dishost.xyz`)
                    statusmsg.setFooter('Status is updated every minute!')
                    msg.edit({embeds: [statusmsg]})
                })
                })
            }, 60000);
            const votechannel = theguild.channels.cache.find(c => c.id === "997420075852247070")
            setInterval(async function(){
                votechannel.send("<@&997420259046850580> https://discords.com/servers/dishost")
            }, 21600000)
        }) */
        const guild = client.guilds.cache.find(g => g.id === "1228706433302794270")
        const statuschannel = guild.channels.cache.find(c => c.id === "1228769636783493221")
        const errorMessage = new Discord.EmbedBuilder()
        if (!isReachable("https://de1.danee.dev")) {
            errorMessage.setTitle("De1 is offline")
            errorMessage.setColor("Red")
            statuschannel.send({ embeds: [errorMessage] })
        } else if (!isReachable("https://panel.danee.dev")) {
            errorMessage.setTitle("Panel & Dashboard are offline")
            errorMessage.setColor("Red")
            statuschannel.send({ embeds: [errorMessage] })
        }


        // CHECK INACTIVE SERVERS
        setInterval(async () => {
            const channel = guild.channels.cache.find(c => c.id === "1228985887342334052")
            const servers = await axios.get("https://dash.danee.dev/api/servers", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const sevenDaysAgo = dayjs().subtract(7, 'days')
            servers.data.data.forEach(async (server) => {
                if (dayjs(server.created_at).isBefore(sevenDaysAgo)) {
                    const isMsgSend = await Server.findOne({ where: { serverId: server.id } })
                    if (!isMsgSend) {
                        const actionrow = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                            .setLabel("Check Activity")
                            .setURL(`https://panel.danee.dev/server/${server.identifier}`)
                            .setStyle(Discord.ButtonStyle.Link),
                            new Discord.ButtonBuilder()
                            .setCustomId("active")
                            .setLabel("Mark as active")
                            .setStyle(Discord.ButtonStyle.Success),
                            new Discord.ButtonBuilder()
                            .setCustomId("inactive")
                            .setLabel("Mark as inactive & Delete")
                            .setStyle(Discord.ButtonStyle.Danger)
                        )
                        let msgId;
                        const embed = new Discord.EmbedBuilder()
                        .setTitle(`Check activity - ${server.name}`)
                        .setDescription(`This server is 7 days old. Please check if it's still active.`)
                        .setColor("Random")
                        channel.send({ embeds: [embed], components: [actionrow] }).then((msg) => msgId = msg.id)
                        Server.create({ serverId: server.id})
                        const filter = (interaction) => interaction.message.id === msgId;
                        const collector = channel.createMessageComponentCollector({componentType: Discord.ComponentType.Button, filter: filter})
                        collector.on("collect", async (interaction) => {
                            switch (interaction.customId) {
                                case "active":
                                    interaction.reply({ content: "Marked as active", ephemeral: true })
                                    collector.stop()
                                    break;
                                case "inactive":
                                    interaction.reply({ content: "Marked as inactive & deleted", ephemeral: true })
                                    axios.delete(`https://dash.danee.dev/api/servers/${server.id}`, {
                                        headers: {
                                            "Authorization": `Bearer ${token}`
                                        }
                                    })
                                    const user = await axios.get(`https://dash.danee.dev/api/users/${server.user_id}`, {
                                        headers: {
                                            "Authorization": `Bearer ${token}`
                                        }
                                    })
                                    client.users.fetch(user.data.discord_user.id, false).then((user) => {
                                        const userEmbed = new Discord.EmbedBuilder()
                                        .setTitle("Your server was deleted!")
                                        .setDescription(`Your server ${server.name} was marked as inactive and deleted.`)
                                        .setColor("Red")
                                        user.send({embeds: [userEmbed]})
                                    })
                                    collector.stop()
                                    break;
                            } 
                        })

                        collector.on("end", async () => {
                            const msg = channel.messages.cache.find(msg => msg.id === msgId)
                            setTimeout(() => {
                                msg.delete()
                            }, 3000)
                        })
                    }
                }
            })
    }, 3600000)
	}
});
