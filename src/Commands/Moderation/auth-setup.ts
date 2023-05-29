import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";
import { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, PrivateThreadChannel, NewsChannel, PublicThreadChannel, Role} from "discord.js";
import { authModel } from "../../Data/Models/AuthSchema.js";

export class authsetup {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("auth-setup")
        .setDescription("Configure and set up the emoji user authenticator for seamless identity verification using emojis.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription(`Please indicate the channel where you would like the emoji authenticator to be sent.`)
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription(`Please specify the role you would like the user to receive after successfully authenticating.`)
            .setRequired(true)
        )
        .setExecute(async ({interaction, client}) => {
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role') as Role;

            authModel.findOne({ Guild: interaction.guild!.id }).then( data => {
                if (!data) {
                  authModel.create({
                    Guild: interaction.guild!.id,
                    Channel: channel!.id,
                    Role: role!.id,
                  });
                } else {
                   interaction.reply({
                    content: 'You have a user authentication system in place. To restart it, use the `/auth-disable` command.',
                    ephemeral: true,
                  });
                  return;
                }

                const cresent_moon = new ButtonBuilder()
                .setCustomId('cresentMoon')
                .setEmoji('🌘')
                .setStyle(ButtonStyle.Primary);

            const fullMoon = new ButtonBuilder()
                .setCustomId('fullMoon')
                .setEmoji('🌕')
                .setStyle(ButtonStyle.Primary);

            const newMoon = new ButtonBuilder()
                .setCustomId('newMoon')
                .setEmoji('🌑')
                .setStyle(ButtonStyle.Primary);
            
            const waxingMoon = new ButtonBuilder()
                .setCustomId('waxingMoon')
                .setEmoji('🌒')
                .setStyle(ButtonStyle.Primary);

                const quaterMoon = new ButtonBuilder()
                .setCustomId('quaterMoon')
                .setEmoji('🌓')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(cresent_moon, fullMoon, newMoon, waxingMoon, quaterMoon);

            const embed = new EmbedBuilder()
                .setTitle(`AstroHub <:astro_hub:1110939932702277743> | Authentication System`)
                .setDescription(`Select the **Full Moon** emoji as a way to verify that you are a human.\n\nIf the <@&1108819966490325023> has not been recieved, please contact a member of staff.`)
                .setColor("DarkButNotBlack");

             (channel as TextChannel).send({ embeds: [embed], components: [row] });

            const textChannel = channel as TextChannel | PrivateThreadChannel | PublicThreadChannel<boolean> | NewsChannel;
            const collector = textChannel.createMessageComponentCollector();

            collector.on('collect', async i => {
                if (i.customId === 'fullMoon') {
                  await i.deferUpdate();
        
                  const user = i.user;
                  const member = interaction.guild!.members.cache.get(user!.id);
        
                  await member!.roles.add(role!);
        
                  const dmEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.guild!.name} | Account Authorized`)
                    .setDescription(`Hello ${user!.username}, congratulations! You have been granted authorization to send messages within ${interaction.guild!.name}. Enjoy your newfound ability to communicate with others!`)
                    .setColor("Blue");
        
                  await user!.send({ embeds: [dmEmbed] });
                  await i.followUp({content: "You have been successfully verified in AstroHub!", ephemeral: true});
                } else {
                  await i.reply({
                    content: 'Please try again as the moon you selected is incorrect.',
                    ephemeral: true,
                  });
                }
              });

               interaction.reply({
                content: `The user authentication system has been successfully implemented within the ${channel}.`,
                ephemeral: true,
              });
        })
    })
];

async onStart() {
  return true;
}
}

export default new authsetup();