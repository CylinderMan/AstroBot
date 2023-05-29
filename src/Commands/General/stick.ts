import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import {stickyModel} from "../../Data/Models/stickySchema.js"

export class stick {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("stick")
            .setDescription("Set a sticky message in the current channel")
            //.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .addStringOption(option => option.setName("message").setDescription("The message you want to stick in the chat").setRequired(true))
            .addNumberOption(option => option.setName("count").setDescription("How frequently do you want the sticky message to be sent?").setRequired(false))
            .setDMPermission(false)
            .setExecute(async ({ interaction, client }) => {
               let string = interaction.options.getString("message");
               let amount = interaction.options.getString("amount") || 6;


               const embed = new EmbedBuilder()
               .setColor("Blue")
               .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 4096 }) })
               .setDescription(string)
               .setFooter({text: `This is a sticky message`})

               stickyModel.findOne({ChannelID: interaction.channel?.id}).then(async data => {
                    if (!data) {
                        let msg = await interaction.channel?.send({embeds: [embed]});
                        
                        stickyModel.create({
                            ChannelID: interaction.channel?.id,
                            Message: string,
                            MaxCount: amount,
                            LastMessageID: msg?.id,
                        })

                        return await interaction.reply({content: "The sticky message has been set up"});
                    } else {
                        await interaction.reply({content: "You already have a sticky message setup within this channel! Please do /unstick to remove it and try again"})
                    }
               })
    })
];

async onStart() {
    return true;
}
}

export default new stick();