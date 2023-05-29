import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { ChannelType, EmbedBuilder, PermissionFlags, PermissionFlagsBits } from "discord.js";

import { inviteModel } from "../../Data/Models/inviteSchema.js";

export class invitelogger {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("invite-logger")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDescription("Set up the invite logger system")
        .addSubcommand(command => command.setName("setup").setDescription("Setup the invite logger system").addChannelOption(option => option.setName("channel").setDescription("The channel you want to set the invite logging in").setRequired(true).addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(command => command.setName("disable").setDescription("Disable the invite logger system"))
        .setExecute(async ({interaction, client}) => {
            const {options} = interaction;
            const sub = options.getSubcommand();

            const Data = await inviteModel.findOne({Guild: interaction?.guild?.id});

            switch (sub) {
                case "setup":

                const channel = options.getChannel("channel");
                
                if (Data) await interaction.reply({content: "The invite logging system is already enabled"});
                else {
                    await inviteModel.create({
                        Guild: interaction?.guild?.id,
                        Channel: channel?.id
                    })

                    const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`The invite logging system has been enabled in ${channel}`)

                    await interaction.reply({embeds: [embed]});
                }
            }

            switch (sub) {
                case "disable":

                if (!Data) await interaction.reply({content: "There is no invite logging system set up here"})
                else {
                    await inviteModel.deleteMany({
                        Guild: interaction?.guild?.id
                    });

                    const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`The invite logging system has been disabled`)

                    await interaction.reply({embeds: [embed]});
                }
            }
    })
];

async onStart() {
  return true;
}
}

export default new invitelogger();