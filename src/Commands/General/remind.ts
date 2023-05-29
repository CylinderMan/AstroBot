import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import {remindModel} from "../../Data/Models/remindSchema.js"
import { ChannelType, GuildChannel, EmbedBuilder } from "discord.js";

export class remind {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("remind")
        .setDescription("Set a reminder for yourself")
        .addSubcommand(command => command.setName("set").setDescription("Set a reminder").addStringOption(option => option.setName("reminder").setDescription("What do you want to be reminded of?").setRequired(true)).addChannelOption(option => option.setName("channel").setDescription("Which channel do you want to be notified in?").setRequired(true).addChannelTypes(ChannelType.GuildText)).addIntegerOption(option => option.setName("minutes").setDescription("How many minutes from now on?").setRequired(true).setMinValue(0).setMaxValue(59)).addIntegerOption(option => option.setName("hours").setDescription("How many hours from now on?").setRequired(false).setMinValue(0).setMaxValue(23)).addIntegerOption(option => option.setName("days").setDescription("How many days from now on?").setRequired(false).setMinValue(1).setMaxValue(31)))
        .setExecute(async ({interaction, client}) => {
            const {options, guild} = interaction;
            const reminder = options.getString("reminder");
            const channel = options.getChannel("channel") as GuildChannel;
            const minute = options.getInteger("minutes") || 0;
            const hour = options.getInteger("hours") || 0;
            const day = options.getInteger("days") || 0;

            let time = Date.now() + (day * 1000 * 60 * 60 * 24) + (hour * 1000 * 60 * 60) + (minute * 1000 * 60);

            await remindModel.create({
                User: interaction.user.id,
                Time: time,
                Remind: reminder,
                Channel: channel.id
            });
    
            const embed = new EmbedBuilder()
            .setColor(`#3342AE`)
            .setDescription(`📩 Your reminder system has been set for <t:${Math.floor(time/1000)}:R> I will remind you about "${reminder}" in ${channel}`);
    
            await interaction.reply({embeds: [embed]});
    })
];

async onStart() {
  return true;
}
}

export default new remind();