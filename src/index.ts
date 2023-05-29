import { RecipleClient, RecipleModuleScript } from 'reciple';
import { remindModel } from './Data/Models/remindSchema.js';
import { ActivityType, TextChannel } from 'discord.js';

export default {
    versions: ['^7'], // Module supports reciple client version 
    // Module resolved logic here (Bot not logged in)
    onStart(client: RecipleClient) {


        // rotating status
        const activties = [
            "Uranus",
            "Pluto",
            "Saturn",
            "Neptune",
            "Mercury",
            "Earth",
            "Venus",
            "Jupiter",
            "the universe expand",
            "calculus",
            "the moon",
            "the stars",
            "nothing",
            "Jupiter's Moons",
            "Saturn's rings",
            "a telescope",
            "the Milky Way",
            "aliens?",
            "a block of cheese",
            "Andromeda",
            "black holes"
        ];

        setInterval(() => {
            const status = activties[Math.floor(Math.random() * activties.length)];
            client.user?.setActivity(status, {type: ActivityType.Watching})
        }, 120000)


        // reminder
        setInterval(async () => {
            const reminders = await remindModel.find();

            if (!reminders) return;
            else {
                reminders.forEach(async (reminder: any) => {

                    if (reminder.Time > Date.now()) return;
                    const user = await client.users.fetch(reminder.User);

                    const guild = client.guilds.cache.get('1108779137436500090');

                    if (!guild) return;

                    const channel = guild.channels.cache.get(reminder.Channel) as TextChannel;

                    if (!channel || !(channel instanceof TextChannel)) return;

                    if (!channel) return;

                    user?.send({
                        content: `${user}, you asked to reminded about: \`${reminder.Remind}\``
                    }).catch(err => { return; });

                    channel.send({
                        content: `${user}, you asked to reminded about: \`${reminder.Remind}\`. In case you do not notice this reminder, I have also sent you a DM!`
                    })

                    await remindModel.deleteMany({
                        Time: reminder.Time,
                        User: user.id,
                        Remind: reminder.Remind,
                        Channel: channel.id
                    });

                });

            }

        }, 1000 * 5);
        
        return true;
    },
} satisfies RecipleModuleScript;
