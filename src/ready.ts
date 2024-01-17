import { ActivityType, Client, PresenceData } from "discord.js";
import { invites } from "./bot";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    const presence: PresenceData = {
      status: "online",
      activities: [
        {
          name: "for any invites!",
          type: ActivityType.Watching,
        },
      ],
    };
    client.user?.setPresence(presence);

    client.guilds.cache.forEach(async (guild) => {
      const fetchedInvites = await guild.invites.fetch();
      invites.set(guild.id, fetchedInvites);
    });

    console.log(`${client.user.username} is online`);
  });
};
