import { RecipleClient } from "reciple";
import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

export class guildMemberAdd {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        client.on("guildMemberAdd", async member => {
            const welcomeChannel = member.guild.channels.cache.get("1108841415892537346") as TextChannel;
            const welcomeChannel2 = member.guild.channels.cache.get("1108779137436500093") as TextChannel;

            const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Welcome ${member.user.username} :wave:`)
            .setDescription(`Welcome to AstroHub! Welcome to the AstroHub, an astronomy Discord server where stargazers and celestial enthusiasts unite in a virtual cosmos of knowledge, discovery, and wonder.`)
            .addFields(
                {name: `:book:`, value: `Make sure to read the <#1109128956193538088>!`},
                {name: `:loudspeaker:`, value: `Why not check out the announcements? <#1109137418709389342>?`},
                {name: `:calendar:`, value: `Look out for events in <#1109144732866711563>!`},
                {name: `:speaking_head:`, value: `Chat with the community in <#1108779137436500093>.`},
                {name: `:microphone2:`, value: `Get reaction roles in <#1109144559646154803>.`},
                {name: `:camera_with_flash:`, value: `Post your pictures in <#1109146285065371718>.`},
                {name: `:ringed_planet:`, value: `Talk about astronomy in <#1109146222033371156>.`},
            )
            .setColor(`#000000`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({text: `User ID: ${member.user.id}`})
            .setTimestamp()

            const welcomeEmbed2 = new EmbedBuilder()
            .setTitle(`Welcome ${member.user.username} to **AstroHub**!`)
            .setColor(`#000000`)
            .setDescription(`Remember to read the rules in <#1109128956193538088>! \n\nEnjoy your stay - make the new member feel welcome 🪐`)

            welcomeChannel.send({embeds: [welcomeEmbed]});
            welcomeChannel2.send({embeds: [welcomeEmbed2], content: `<@${member.id}>`})

        });

        return true;
    }
}

export default new guildMemberAdd();
