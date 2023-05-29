import {
    AnyCommandBuilder,
    AnyCommandData,
  AnySlashCommandBuilder,
  CommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandResolvable,
  RecipleClient,
  RecipleModule,
  RecipleModuleScript,
  RecipleModuleScriptUnloadData,
  SlashCommandBuilder,
  SlashCommandResolvable,
} from "reciple";

export class RegisterDevCommands implements RecipleModuleScript {
    public versions: string = "^7";

    public async onStart(client: RecipleClient<false>, module: RecipleModule): Promise<boolean> {
        return true;
    }

    public async onLoad(client: RecipleClient<true>, module: RecipleModule): Promise<void> {
        if (!process.env.DEV_GUILD) return;

        const modules = client.modules.modules.map(s => s.script as RecipleModuleScript & {devCommands? : (SlashCommandResolvable | ContextMenuCommandResolvable)[]});
        const commands: (AnySlashCommandBuilder | ContextMenuCommandBuilder)[] = [];

        for (const module of modules) {
            if (!module.devCommands) continue;

            commands.push(...module.devCommands.map(s => 
                s.commandType === CommandType.SlashCommand
                ? SlashCommandBuilder.resolve(s)
                : ContextMenuCommandBuilder.resolve(s)
            ));
        }

        client.on("recipleRegisterApplicationCommands", (registeredCommands, guildId) => {
            if (guildId === process.env.DEV_GUILD) return;
    
            client.commands.add(commands);
            client.logger?.log(`Registered (${commands.length}) dev commands to ${process.env.DEV_GUILD}`)
        });

        await client.application.commands.set(commands, process.env.DEV_GUILD);
    }
}

export default new RegisterDevCommands();