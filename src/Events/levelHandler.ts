import { RecipleClient } from "reciple";
import { EmbedBuilder, TextChannel } from "discord.js";

import { levelModel } from "../Data/Models/levelSchema.js";

export class levelHandler {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("messageCreate", async (message) => {
            const { guild, author } = message;

            if (!guild || author.bot) return;

            const data = await levelModel.findOne({ Guild: guild.id, User: author.id });

            if (!data) {
                await levelModel.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                });
            }

            const channel = message.guild?.channels.cache.find(c => c.name === "bots") as TextChannel;

            const give = 1;

            if (!data) return;

            const requiredXP = data.Level * data.Level * 20 + 20;

            if (data.XP + give >= requiredXP) {

                data.XP += give;
                data.Level += 1;
                await data.save();

                if (!channel) return;

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`You have levelled up!`)
                .setDescription(`You have reached level **${data.Level}**! Keep chatting to level up! <:sexy_sunglasses:1109555389411885246>`)

                channel.send({content: `${author}`, embeds: [embed]});
            } else {
                data.XP += give;
                data.save();
            }
        });

        return true;
    }
}

export default new levelHandler();
