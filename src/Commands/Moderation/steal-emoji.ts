import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import axios from "axios";

export class stealEmoji {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("steal-emoji")
            .setDescription("Steal emojis from other servers")
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addStringOption(option => option.setName("emoji").setDescription("The emoji that you want to be added to the server").setRequired(true))
            .addStringOption(option => option.setName("name").setDescription("The name of the emoji").setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                let emoji = interaction.options.getString("emoji")?.trim();
                const name = interaction.options.getString("name");

                if (emoji?.startsWith("<") && emoji.endsWith(">")) {
                    const id = emoji.match(/\d{15,}/g)?.[0];

                    const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                    .then(image => {
                        if (image) return "gif";
                        else return "png";
                    }).catch(err => {
                        return "png";
                    })

                    emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
                }

                if (!emoji?.startsWith("http")) {
                   await interaction.reply({content: "You cannot steal default emojis!"})
                }

                if (!emoji?.startsWith("https")) {
                   await interaction.reply({content: "You cannot steal default emojis!"})
                }

                interaction.guild?.emojis.create({attachment: `${emoji}`, name: `${name}`})
                .then(emoji => {
                    const embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Added ${emoji} with the name **${name}**`)

                    return interaction.reply({embeds: [embed]});
                }).catch(err => {
                    interaction.reply({content: `You cannot add this emoji because you have reached your maximum server emoji limit`})
                }) 
            })
    ];

    async onStart() {
        return true;
    }
}

export default new stealEmoji();
