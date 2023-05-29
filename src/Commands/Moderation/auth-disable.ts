import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, Message, Collection } from "discord.js";
import { authModel } from "../../Data/Models/AuthSchema.js";

export class authdisable {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("auth-disable")
            .setDescription("Disable the emoji user authenticator system.")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
                authModel.deleteMany({ Guild: interaction.guild!.id }).then(async data => {
                    interaction.reply({
                        content: 'The User Authentication System has been successfully disabled.',
                        ephemeral: true
                    });
                })
            })
    ];

    async onStart() {
        return true;
    }
}

export default new authdisable();