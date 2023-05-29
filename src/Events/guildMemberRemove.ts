import { RecipleClient } from "reciple";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

export class guildMemberAdd {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("guildMemberRemove", async member => {
            const welcomeChannel = member.guild.channels.cache.get("1108841415892537346") as TextChannel;

            const leaveEmbed = new EmbedBuilder()
            .setTitle(`${member.user.username} has departed! :airplane_departure:`)
            .setDescription("We hope to see you again soon!")
            .setColor("Red")
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({text: `ID: ${member.user.id}`})
            .setTimestamp()

            welcomeChannel.send({embeds: [leaveEmbed]});

        });

        return true;
    }
}

export default new guildMemberAdd();
