import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { ChannelType, EmbedBuilder, PermissionFlags, PermissionFlagsBits } from "discord.js";

import { countModel } from "../../Data/Models/countSchema.js";

export class count {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("counting")
        .setDescription("Config your counting system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(command => command.setName('setup').setDescription('Sets up the counting system for you.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will be your counting channel.').setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('Disables the counting system for your server.'))
        .setExecute(async ({interaction, client}) => {
            const sub = interaction.options.getSubcommand();
            const channel = interaction.options.getChannel('channel');
            const data = await countModel.findOne({ Guild: interaction.guild!.id });

            switch (sub) {
 
                case 'setup':
     
                if (data) await interaction.reply({ content: `You **already** have a counting system set up in this server!`, ephemeral: true})
                else {
     
                    countModel.create({
                        Guild: interaction.guild!.id,
                        Channel: channel!.id,
                        Count: 0
                    })
     
                    const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTimestamp()
                    .setTitle('> Counting Setup')
                    .setAuthor({ name: `🔢 Counting System`})
                    .setFooter({ text: `🔢 Counting was Setup`})
                    .addFields({ name: `• System Setup`, value: `> Your channel (${channel}) was set up to be \n> your counting channel!`})
     
                    await interaction.reply({ embeds: [embed]})
                }
     
                break;
     
                case 'disable':
     
                if (!data) await interaction.reply({ content: `No **counting system** found, cannot delete nothing..`, ephemeral: true})
                else {
     
                    await countModel.deleteMany();
                    data.save();
     
                    await interaction.reply({ content: `Your **counting system** has been disabled!`, ephemeral: true})
                }
            }
    })
];

async onStart() {
  return true;
}
}

export default new count();