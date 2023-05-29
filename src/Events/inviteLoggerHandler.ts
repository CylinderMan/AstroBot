import { RecipleClient } from "reciple";
import { EmbedBuilder, Collection, PermissionFlagsBits, TextChannel, DMChannel } from "discord.js";

import { inviteModel } from "../Data/Models/inviteSchema.js";

const invites = new Collection<string, Collection<string, number>>();

export class inviteloggerHandler {
  public versions: string = "^7";

  public async onStart(client: RecipleClient) {
    client.on("ready", async () => {

      client.guilds.cache.forEach(async (guild) => {
        const clientMember = guild.members.cache.get(client!.user!.id);

        if (!clientMember?.permissions.has(PermissionFlagsBits.ManageGuild)) return;

        const firstInvites = await guild.invites.fetch();

        const guildInvites = new Collection<string, number>(firstInvites.map((invite) => [invite.code, invite.uses || 0]));

        invites.set(guild.id, guildInvites);
      });
    });

    client.on("guildMemberAdd", async (member) => {
      const Data = await inviteModel.findOne({ Guild: member.guild.id });
      if (!Data) return;

      const channelID = Data.Channel;

      const channel = member.guild.channels.cache.get(channelID);

      const newInvites = await member.guild.invites.fetch();

      const oldInvites = invites.get(member.guild.id) || new Collection<string, number>();

      const invite = newInvites.find((i) => i.uses! > (oldInvites.get(i.code) || 0));

      const inviter = invite!.inviter && await client.users.fetch(invite!.inviter.id);

      if (channel instanceof TextChannel || channel instanceof DMChannel) {
        if (!invite) await channel.send(`${member.user.tag} joined the server using an unknown invite.  This could possibly a vanity invite link if your server has one.`) 
        inviter 
         ? channel.send(`${member.user.tag} joined the server using the invite ${invite?.code} from ${inviter?.tag}. The invite was used ${invite?.uses} times since its creation.`)
         : channel.send(`${member.user.tag} joined the server but I can't figure out what invite they used to do it.`)
      }      
    });

    return true;
  }
}

export default new inviteloggerHandler();
