import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

import {warnModel} from "../../Data/Models/warningSchema.js";

export class warn {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("warn")
            .setDescription("Warn a member in the server")
            .addUserOption(options => options.setName("user").setDescription("The user who you want to warn").setRequired(true))
            .addStringOption(options => options.setName("reason").setDescription("The reason for warning").setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
               const {options, guildId, user} = interaction;

               const target = options.getUser("user");
               const reason = options.getString("reason") || "No reason given";

               const userTag = `${target?.username}#${target?.discriminator}`;

               warnModel.findOne({GuildID: guildId, UserID: target?.id, UserTag: userTag}).then( async data => {
                    if (!data) {
                        data = new warnModel({
                            GuildID: guildId,
                            UserID: target?.id,
                            UserTag: userTag,
                            Content: [
                                {
                                    ExecuterId: user.id,
                                    ExecuterTag: user.tag,
                                    Reason: reason
                                }
                            ],
                        });

                    } else {
                        const warnContent = {
                            ExecuterId: user.id,
                            ExecuterTag: user.tag,
                            Reason: reason
                        }
                        data.Content.push(warnContent);
                    }
                    data.save();
               });

               const embed = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(`You have been warned in ${interaction.guild?.name} | ${reason}`)
               
               const embed2 = new EmbedBuilder()
               .setColor("Blue")
               .setDescription(`${target?.tag} has been warned | ${reason}`)

               target?.send({embeds: [embed]}).catch(err => {
                return;
               });

               interaction.reply({embeds: [embed2]});
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new warn();
