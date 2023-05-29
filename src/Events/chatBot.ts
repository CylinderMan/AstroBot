import { RecipleClient } from "reciple";
import { EmbedBuilder } from "discord.js";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";

const configuration = new Configuration({
  apiKey: process.env.CHATBOT_C0DE
});

const openai = new OpenAIApi(configuration);

export class chatBot {
  public versions: string = "^7";

  public async onStart(client: RecipleClient) {
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;
      if (message.channel.id !== "1109147572385366046") return;
      if (message.content.startsWith('!')) return;

      let conversationLog: ChatCompletionRequestMessage[] = [
        { role: ChatCompletionRequestMessageRoleEnum.System, content: 'You are a friendly chatbot.' },
      ];

      try {
        await message.channel.sendTyping();
        let prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();

        prevMessages.forEach((msg) => {
          if (msg.content.startsWith('!')) return;
          if (msg.author.id !== client.user?.id && message.author.bot) return;
          if (msg.author.id == client.user?.id) {
            conversationLog.push({
              role: ChatCompletionRequestMessageRoleEnum.Assistant,
              content: msg.content,
            });
          }

          if (msg.author.id == message.author.id) {
            conversationLog.push({
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: msg.content,
            });
          }
        });

        const convertedConversationLog = conversationLog.map((log) => ({
          role: log.role,
          content: log.content,
        }));

        const result = await openai
          .createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: convertedConversationLog,
            // max_tokens: 256, // limit token usage
          })
          .catch((error) => {
            console.log(`OPENAI ERR: ${error}`);
          });

        if (result && result.data && result.data.choices && result.data.choices[0]?.message?.content) {
          const messageContent = result.data.choices[0].message.content;
          message.reply(messageContent);
        }
      } catch (error) {
        console.log(`ERR: ${error}`);
      }
    });

    return true;
  }
}

export default new chatBot();
