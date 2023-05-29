import { AnyCommandBuilder, SlashCommandBuilder } from "reciple";

export class ping {
    public versions: string = "^7";
    commands: AnyCommandBuilder[] = [
        new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the latency of the bot")
        .setExecute(async ({interaction, client}) => {
            interaction.reply({content: `:ping_pong: Pong! Your current ping is at a whopping **${client.ws.ping}**!`})
    })
];

async onStart() {
  return true;
}
}

export default new ping();