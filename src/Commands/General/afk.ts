import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { EmbedBuilder, GuildMember } from "discord.js";
import { afkModel } from "../../Data/Models/afkSchema.js"

export class afk {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
            .setName("afk")
            .setDescription("Set yourself AFK")
            .addSubcommand(command => command.setName("set").setDescription("Go afk within the server").addStringOption(option => option.setName("message").setDescription("The reason for going AFK").setRequired(false)))
            .addSubcommand(command => command.setName("remove").setDescription("Unafk within the server"))
            .setExecute(async ({ interaction, client }) => {
                const { options } = interaction;
                const sub = options.getSubcommand();

                const Data = await afkModel.findOne({ Guild: interaction.guild?.id, User: interaction.user.id });

                switch (sub) {
                    case "set":
                        if (Data) await interaction.reply({ content: "You are already AFK within this server!" })
                        else {
                            const message = options.getString("message");
                            const nickname = interaction.member instanceof GuildMember ? interaction.member.nickname || interaction.user.username : interaction.user.username;

                            await afkModel.create({
                                Guild: interaction.guild?.id,
                                User: interaction.user.id,
                                Message: message,
                                Nickname: nickname
                            })

                            const name = `[AFK] ${nickname}`;
                            if (interaction.member instanceof GuildMember) {
                                await interaction.member.setNickname(`${name}`).catch(e => {
                                    return;
                                });
                            };

                            const embed = new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription("You are now afk in the server. Send a message or do /afk remove to remove your afk!")

                            await interaction.reply({embeds: [embed]});
                        } 

                        break;

                    case "remove":

                    if (!Data) await interaction.reply({content: "You are not AFK in this server!"});
                    else {
                        const nick = Data.Nickname;
                        await afkModel.deleteMany({Guild: interaction.guild?.id, User: interaction.user.id});

                        if (interaction.member instanceof GuildMember) {
                            await interaction.member.setNickname(`${nick}`).catch(e => {
                                return;
                            });
                        };

                        const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription("Your afk has been removed!")

                        await interaction.reply({embeds: [embed]});
                    }
                }
            })
    ];

    async onStart() {
        return true;
    }
}

export default new afk();