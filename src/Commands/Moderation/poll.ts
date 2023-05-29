import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {voteModel} from "../../Data/Models/votesSchema.js"

export class poll {
  public versions: string = "^7";
  commands: AnyCommandBuilder[] = [
    new SlashCommandBuilder()
      .setName("poll")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .setDescription("Send a poll in your channel")
      .addStringOption(option => option.setName("topic").setDescription("The topic for your poll").setMinLength(1).setMaxLength(2000).setRequired(true))
      .setExecute(async ({ interaction, client }) => {
         await interaction.reply({content: `Your poll has started below`, ephemeral: true});

         const topic = interaction.options.getString("topic");

         const embed = new EmbedBuilder()
         .setColor("Blue")
         .setAuthor({name: "Poll System"})
         .setFooter({text: "Poll started"})
         .setTimestamp()
         .setTitle("Poll Began")
         .setDescription(`> ${topic}`)
         .addFields(
            {name: "Upvotes", value: `> **No Votes**`, inline: true},
            {name: "Downvotes", value: `> **No Votes**`, inline: true},
            {name: "Author", value: `> ${interaction.user}`, inline: false},
         )

         const buttons = new ActionRowBuilder<ButtonBuilder>()
         .addComponents(

            new ButtonBuilder()
            .setCustomId("up")
            .setLabel("✅")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("down")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("votes")
            .setLabel("Votes")
            .setStyle(ButtonStyle.Secondary),
         )

         const msg = await interaction.channel?.send({embeds: [embed], components: [buttons]});
         msg?.createMessageComponentCollector();

         await voteModel.create({
            Msg: msg?.id,
            UpVote: 0,
            DownVote: 0,
            UpMembers: [],
            DownMembers: [],
            Guild: interaction.guild!.id,
            Owner: interaction.user.id
         })
      })
  ];

  async onStart() {
    return true;
  }
}

export default new poll();
