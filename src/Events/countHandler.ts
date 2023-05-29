import { RecipleClient } from "reciple";
import { EmbedBuilder } from "discord.js";

import { countModel } from "../Data/Models/countSchema.js";

export class countHandler {
  public versions: string = "^7";

  public async onStart(client: RecipleClient) {
    client.on("messageCreate", async (message) => {
        const countdata = await countModel.findOne({ Guild: message.guild?.id });
 
        if (!countdata) return;
     
        let countchannel = client.channels.cache.get(countdata.Channel);
     
        if (message.author.id === '1109147505020653681') return;
        if (message.channel.id !== countchannel?.id) return;
     
        if (parseInt(message.content) - 1 < countdata.Count || parseInt(message.content) === countdata.Count || parseInt(message.content) > countdata.Count + 1) {
            message.reply({ content: `You have **messed up** the counter at **${countdata.Count}**! Back to **0**.`})
            countdata.Count = 0;
            try {
                message.react('❌')
            } catch (err) {
                throw err;
            }
        } else if (parseInt(message.content) - 1 === countdata.Count) {
            countdata.Count += 1;
            try {
                message.react('✅')
            } catch (err) {
                throw err;
            }
        }
    
     
        countdata.save();
    });

    return true;
  }
}

export default new countHandler();
