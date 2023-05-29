import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

import {warnModel} from "../../Data/Models/warningSchema.js";

export class warnings {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("warnings")
            .setDescription("Check a member's warnings")
            .addUserOption(options => options.setName("user").setDescription("The user who you want to check their warnings").setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
               const {options, guildId, user} = interaction;

               const target = options.getUser("user");
        
               const embed = new EmbedBuilder()
               const noWarns = new EmbedBuilder()
             
               warnModel.findOne({GuildID: guildId, UserID: target?.id, UserTag: target?.tag}).then( async data => {
                    if (data) {
                        embed.setColor("Blue")
                        .setDescription(`${target?.tag}'s warnings: \n${data.Content.map(
                            (w, i) => 
                                `
                                    **Warning**: ${i + 1}
                                    **Warning Moderator**: ${w.ExecuterTag}
                                    **Warn Reason**: ${w.Reason}
                                `                           
                        ).join(`-`)}`)

                        interaction.reply({embeds: [embed]})
                    } else {
                        noWarns.setColor("Blue")
                        .setDescription(`${target?.tag} has **0** warnings!`)


                        interaction.reply({embeds: [noWarns]});
                    }
               })
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new warnings();
