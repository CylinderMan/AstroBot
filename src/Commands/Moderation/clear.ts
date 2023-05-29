import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";

export class Clear {
  public versions: string = "^7";
  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Clear a selected amount of messages in this channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addIntegerOption(option =>
        option
          .setName("amount")
          .setDescription("The amount of messages to delete")
          .setMinValue(1)
          .setMaxValue(100)
          .setRequired(true)
      )
      .setExecute(async ({ interaction, client }) => {
        const number = interaction.options.getInteger("amount");

        if (number === null) {
          return;
        }

        const embed = new EmbedBuilder().setColor("Blue").setDescription(`:white_check_mark: Deleted ${number} messages`);

        if (!(interaction.channel instanceof TextChannel)) return;
        await interaction.channel.bulkDelete(number);

        const button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("purge")
            .setEmoji("🗑️")
            .setStyle(ButtonStyle.Primary)
        )

        const message = await interaction.reply({embeds: [embed], components: [button]});

        const collector = message.createMessageComponentCollector();

        collector.on("collect", async i => {
            if (i.customId === "purge") {
              interaction.deleteReply();
            }
        });
      }),
  ];

  async onStart() {
    return true;
  }
}

export default new Clear();
