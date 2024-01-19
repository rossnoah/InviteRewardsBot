//function that takes discord user, count of invites, config, and the discord channel to send the message to

import { Channel, Guild, GuildMember, TextChannel, User } from "discord.js";
import { Config } from "./config";

export async function addReward(
  user: string,
  count: number,
  config: Config,
  channel: Channel,
  guild: Guild
): Promise<void> {
  //role rewards
  // {
  //     "rewards": {
  //       "1197059562524655696": 3,
  //       "1191988600691241070": 10
  //     }
  //   }
  //make sure to cascade down all the roles

  if (user === null || user === undefined) {
    console.log("addReward: ", "User does not exist");
    return;
  }

  const member = await guild.members.fetch(user);

  const memberRoles = member.roles;
  const roleRewards = config.rewards;
  for (const role in roleRewards) {
    if (count == roleRewards[role]) {
      const roleToAdd = guild.roles.cache.get(role);
      if (roleToAdd) {
        try {
          await member.roles.add(roleToAdd);
          if (channel.isTextBased()) {
            await channel.send(
              `Congratulations <@${member.id}>! You have earned the **${roleToAdd.name}** role!`
            );
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
