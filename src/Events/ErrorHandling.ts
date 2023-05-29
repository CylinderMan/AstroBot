import { RecipleClient } from "reciple";
import { EmbedBuilder } from "discord.js";

export class ErrorHandler {
    public versions: string = "^7";

    public async onStart(client: RecipleClient) {
        process.on("unhandledRejection", async (reason: any, promise: Promise<any> ) => {
            try {
                const channel = await client.channels.fetch(process.env.ERROR_CHANNEL!);

                if (!channel || !channel.isTextBased()) return;

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({
                    name: `${client.user?.username}`,
                    iconURL: client.user?.avatarURL() ?? undefined,
                })
                .setDescription(`\`\`\`${reason}\`\`\``)
                .setTimestamp()

                await channel.send({embeds: [embed]});
            } catch (err) {
                console.log(err);
            }
        });

        return true;
    }
}

export default new ErrorHandler();