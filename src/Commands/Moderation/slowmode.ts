import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, ChannelType, TextChannel } from "discord.js";

export class slowmode {
  public versions: string = "^7";
  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("slowmode")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .setDescription("Set the slowmode on a specific channel")
      .addIntegerOption(option => option.setName("duration").setDescription("The time of the slowmode").setRequired(true))
      .addChannelOption(option => option.setName("channel").setDescription("The channel you want the slowmode to be set").setRequired(false).addChannelTypes(ChannelType.GuildText))
      .setExecute(async ({ interaction, client }) => {
        const {options} = interaction;
        const duration = options.getInteger("duration");
        const channel = options.getChannel("channel") || interaction.channel;

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`${channel} now has ${duration} seconds of slowmode`)

        if (!(channel instanceof TextChannel)) return;
        channel.setRateLimitPerUser(duration!).catch(err => {
            return;
        });

        await interaction.reply({embeds: [embed]});
         
      })
  ];

  async onStart() {
    return true;
  }
}

export default new slowmode();
