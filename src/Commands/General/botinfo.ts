import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";

export class botinfo {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("botinfo")
            .setDescription("This shows information about the bot")
            .setExecute(async ({ interaction, client }) => {
                const name = "AstroBot";
                const icon = `${client.user?.displayAvatarURL()}`;
                let servercount = await client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

                let uptime = "N/A"; // Default value for uptime
                if (client.uptime !== null) {
                    let totalSeconds = client.uptime / 1000;
                    let days = Math.floor(totalSeconds / 86400);
                    totalSeconds %= 86400;
                    let hours = Math.floor(totalSeconds / 3600);
                    totalSeconds %= 3600;
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = Math.floor(totalSeconds % 60);

                    uptime = `${days} days, ${hours} hours, ${minutes} minutes & ${seconds} seconds`;
                }

                let ping = `${Date.now() - interaction.createdTimestamp}ms`;

                const embed = new EmbedBuilder()
                    .setColor(`#3342AE`)
                    .setAuthor({ name: name, iconURL: icon })
                    .setThumbnail(`${icon}`)
                    .setFooter({ text: `Bot ID: 1102646143927722135` })
                    .addFields(
                        { name: "Server Numbers", value: `${client.guilds.cache.size}`, inline: true },
                        { name: "Server Members", value: `${servercount}`, inline: true },
                        { name: "Latency", value: `${ping}`, inline: true },
                        { name: "Uptime", value: `\`\`\`${uptime}\`\`\`` }
                    );

                interaction.reply({ embeds: [embed] });
            })
    ];

    async onStart() {
        return true;
    }
}

export default new botinfo();
