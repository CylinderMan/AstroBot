import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { ghostPingModel } from "../../Data/Models/ghostpingSchema.js";
import { ghostPingNumModel } from "../../Data/Models/ghostPingNum.js";

export class antighostping {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("anti-ghostping")
            .setDescription("Set up the anti ghost ping system")
            .addSubcommand(command => command.setName("setup").setDescription("Set up the anti ghost ping system"))
            .addSubcommand(command => command.setName("disable").setDescription("Disable the anti ghost ping system"))
            .addSubcommand(command => command.setName("number-reset").setDescription("Reset a user's ghost ping count").addUserOption(option => option.setName("user").setDescription("The user you want to reset the number of ghost pings").setRequired(true)))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setExecute(async ({ interaction, client }) => {
                const { options } = interaction;
                const sub = options.getSubcommand();

                const Data = await ghostPingModel.findOne({ Guild: interaction.guild?.id });

                switch (sub) {
                    case "setup":

                        if (Data) await interaction.reply({ content: "You already have an anti ghost ping system setup" });
                        else {
                            await ghostPingModel.create({
                                Guild: interaction.guild?.id,
                            });

                            const embed = new EmbedBuilder()
                                .setColor("Blue")
                                .setDescription(`The anti ghost ping system has been set up!`)

                            await interaction.reply({ embeds: [embed] });
                        }

                        break;

                    case "disable":
                        if (!Data) await interaction.reply({ content: "There is no anti ghost ping system set up here" });
                        else {
                            await ghostPingModel.deleteMany({ Guild: interaction.guild?.id });

                            const embed = new EmbedBuilder()
                                .setColor("Blue")
                                .setDescription(`The anti ghost ping system has been disabled!`)

                            await interaction.reply({ embeds: [embed] });
                        }

                        break;

                    case "number-reset":

                        const member = options.getUser("user");
                        const data = await ghostPingNumModel.findOne({ Guild: interaction.guild?.id, User: member?.id });

                        if (!data) await interaction.reply({ content: "This member doesn't have any ghost pings yet" });
                        else {
                            await data.deleteOne({ User: member?.id });

                            await interaction.reply({ content: `${member}'s ghost ping number is back at 0` })
                        }
                }
            })
    ];

    async onStart() {
        return true;
    }
}

export default new antighostping();