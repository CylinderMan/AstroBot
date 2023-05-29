import { RecipleClient } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, MessageType } from "discord.js";

import { ghostPingModel } from "../Data/Models/ghostpingSchema.js";
import { ghostPingNumModel } from "../Data/Models/ghostPingNum.js";

export class ghostPingHandler {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("messageDelete", async message => {
            const Data = await ghostPingModel.findOne({ Guild: message.guild?.id });
            if (!Data) return;

            if (!message.author) return;
            if (message.author.bot) return;
            //if (message.author.id !== client.user?.id) return;
           // if (message.author === message.mentions.users.first()) return;

            if (message.mentions.users.first() || message.type === MessageType.Reply) {

                let number;
                let time = 15;

                const data = await ghostPingNumModel.findOne({ Guild: message.guild?.id ?? undefined, User: message.author?.id ?? undefined });
                if (!data) {
                    await ghostPingNumModel.create({
                        Guild: message.guild?.id,
                        User: message.author.id,
                        Number: 1
                    });

                    number = 1;
                } else {
                    data.Number += 1;
                    await data.save();
                    number = data.Number;
                }

                if (number === 2) time = 60;
                if (number >= 3) time = 500;

                const msg = await message.channel.send({ content: `${message.author}, you cannot ghost ping members within this server! ` });
                setTimeout(() => {
                    msg.delete();
                }, 5000);

                const member = message.guild?.members.resolve(message.author.id);

                if (member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    return;
                } else {
                    await member?.timeout(time * 1000, "Ghost Pinging");
                    await member?.send({ content: `You have been timed out in ${message.guild?.name} for ${time} seconds due to ghost pinging members!` }).catch(err => {
                        return;
                    })
                }
            }
        });

        return true;
    }
}

export default new ghostPingHandler();
