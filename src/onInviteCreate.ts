import { ActivityType, Client, PresenceData } from "discord.js";
import { invites } from "./bot";

export default (client: Client): void => {
  client.on("inviteCreate", async (invite) => {
    // Updating the stored invites when a new invite is created
    invites.get(invite.guild!.id)?.set(invite.code, invite);
  });
};
