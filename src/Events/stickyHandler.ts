import { RecipleClient } from "reciple";
import { EmbedBuilder, GuildMember, Snowflake, TextChannel } from "discord.js";
import { stickyModel } from "../Data/Models/stickySchema.js";

export class stickyHandler {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("messageCreate", async message => {
            if (message.author.bot) return;

            stickyModel.findOne({ ChannelID: message.channel.id }).then(async data => {
                if (!data) return;

                let channel: Snowflake = data.ChannelID;
                let cachedChannel = client.channels.cache.get(channel) as TextChannel;

                const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ size: 4096 }) })
                    .setDescription(data.Message)
                    .setFooter({ text: `This is a sticky message` });

                if (message.channel.id === channel) {
                    data.CurrentCount += 1;
                    data.save();

                    if (data.CurrentCount > data.MaxCount) {
                        try {
                            await cachedChannel.messages.fetch(data.LastMessageID).then(async (m) => {
                                await m.delete()
                            });

                            let newMessage = cachedChannel.send({embeds: [embed]});

                            data.LastMessageID = (await newMessage).id;
                            data.CurrentCount = 0;
                            data.save();
                        } catch (e) {
                            return;
                        }
                    }
                }
            });
        });

        return true;
    }
}

export default new stickyHandler();
