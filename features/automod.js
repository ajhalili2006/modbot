const Discord = require('discord.js');
const util = require('../lib/util');

//removes messages with(out) IPs in specific channels
exports.message = async (message, guilds, channels, database) => {
    if (!message.guild || message.author.bot || message.member.hasPermission('MANAGE_MESSAGES'))
        return;

    if (channels.get(message.channel.id) && channels.get(message.channel.id).mode) {

        let log = null;
        if(guilds.get(message.guild.id))
          log = message.guild.channels.cache.get(guilds.get(message.guild.id).logChannel);

        let mode = channels.get(message.channel.id).mode;
        if (mode === 1 && !message.content.toLowerCase().includes('.aternos.me')) {
            //delete non IP messages in IP only channels
            let response = await message.channel.send(`**:no_entry: <@${message.author.id}> your message to this channel must include a valid Aternos IP! :no_entry:**`);
            try {
                await util.retry(message.delete, message);
                if (log)
                  await log.send(`Message  in <#${message.channel.id}> deleted`, new Discord.MessageEmbed({
                    footer: {
                      text: `${message.author.username}#${message.author.discriminator}`,
                      iconURL: message.author.avatarURL()
                    },
                    color: 'ORANGE',
                    fields: [{
                      name: 'Message',
                      value: message.content
                    },
                    {
                      name:'Reason',
                      value: `IPs are required here`
                    }]
                  }));
            } catch (e) {
                console.error('Failed to delete message', e);
            }
            try {
                await util.retry(response.delete, response, [{timeout: 5000}]);
            } catch (e) {
                console.error('Failed to delete response', e);
            }
            return;
        }
        if (mode === 2 && (message.content.toLowerCase().includes('.aternos.me') || message.content.toLowerCase().includes('add.aternos.org'))) {
            //Delete IPs in no IP channels
            let response = await message.channel.send(`**:no_entry: <@${message.author.id}> don't advertise your server here! :no_entry:**`);
            try {
                await util.retry(message.delete, message);
                if (log)
                  await log.send(`Message  in <#${message.channel.id}> deleted`, new Discord.MessageEmbed({
                    footer: {
                      text: `${message.author.username}#${message.author.discriminator}`,
                      iconURL: message.author.avatarURL()
                    },
                    color: 'ORANGE',
                    fields: [{
                      name: 'Message',
                      value: message.content
                    },
                    {
                      name:'Reason',
                      value: `IPs are not allowed here`
                    }]
                  }));
            } catch (e) {
                console.error('Failed to delete message', e);
            }
            try {
                await util.retry(response.delete, response, [{timeout: 5000}]);
            } catch (e) {
                console.error('Failed to delete response', e);
            }
        }
    }
}

exports.init = async (database, channels, bot) => {
}
