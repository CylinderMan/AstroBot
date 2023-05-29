import { RecipleClient } from "reciple";
import { EmbedBuilder, GuildMember } from "discord.js";
import { afkModel } from "../Data/Models/afkSchema.js";

export class afkHandler {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("messageCreate", async message => {
            if (message.author.bot) return;

            const check = await afkModel.findOne({Guild: message.guild?.id, User: message.author.id});

            if (check) {
                const nick = check.Nickname;
                await afkModel.deleteMany({Guild: message.guild?.id, User: message.author.id});

                if (message.member instanceof GuildMember) {
                    await message.member.setNickname(`${nick}`).catch(e => {
                        return;
                    });

                const m1 = await message.reply({content: `Welcome back, ${message.author}! I have removed your AFK!`});
                setTimeout(() => {
                    m1.delete();
                }, 4000)
                }
            } else {
                const members = message.mentions.users.first();
                if (!members) return;

                const Data = await afkModel.findOne({Guild: message.guild?.id, User: members.id});
                if (!Data) return;

                const member = message.guild?.members.cache.get(members.id.toString());
                const msg = Data.Message || "No reason given";

                if (message.content.includes(members?.toString())) {
                    const m = await message.reply({content: `${member?.user.tag} is currently AFK, don't mention them at this time - Reason: ${msg}`});
                    setTimeout(() => {
                      m.delete();
                      message.delete();
                    }, 4000);
                  }
            }
        })
        

        return true;
    }
}

export default new afkHandler();