import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder } from "discord.js";
import moment from "moment";

export class userinfo {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("userinfo")
            .setDescription("Check all the information about a user")
            .addUserOption(option => option.setName(`user`).setDescription(`The user you want to get info from`).setRequired(true))
            .setExecute(async ({ interaction, client }) => {
                const user = interaction.options.getUser("user");
                const member = await interaction.guild!.members.fetch(user!.id);

                const embed = new EmbedBuilder()
                .setTitle(`${user!.username}'s information:`)
                .addFields(
                    { name: "Username: ", value: `${user!.username}`},
                    { name: "ID:", value: `${user!.id}`},
                    { name: "Roles:", value: `${member.roles.cache.map(r => r).join('').replace("@everyone", "")}`},
                    { name: "Server member since:", value: `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-**${moment(member.joinedAt).startOf('day').fromNow()}`},
                    { name: "Discord user since:", value: `${moment(user!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}\n**-**${moment(user!.createdAt).startOf('day').fromNow()}`},
                )
                .setColor("Random")
                .setThumbnail(user!.displayAvatarURL())
                .setTimestamp()
        
                interaction.reply({embeds: [embed]});
    })
];

async onStart() {
    return true;
}
}

export default new userinfo();