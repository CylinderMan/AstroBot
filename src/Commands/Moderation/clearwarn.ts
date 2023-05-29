import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder } from "discord.js";

import {warnModel} from "../../Data/Models/warningSchema.js";

export class clearwarn {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("clearwarn")
            .setDescription("Clear a warning of a  member in the server")
            .addUserOption(options => options.setName("user").setDescription("The user who you want to check to clear the warns").setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
               const {options, guildId, user} = interaction;

               const target = options.getUser("user");


               const embed = new EmbedBuilder()

               warnModel.findOne({GuildID: guildId, UserID: target?.id, UserTag: target?.tag}).then( async data => {
                   if (data) {
                    await warnModel.findOneAndDelete({GuildID: guildId, UserID: target?.id, UserTag: target?.tag});
                    embed.setColor("Blue")
                    .setDescription(`${target?.tag}'s warnings have been cleared!`)

                    interaction.reply({embeds: [embed]});
                   } else {
                    interaction.reply({content: `${target?.tag} has no warnings to be cleared!`})
                   }
               });
            }),
    ];

    async onStart() {
        return true;
    }
}

export default new clearwarn();
