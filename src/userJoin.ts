import { Client } from "discord.js";
import { config, invites, prisma } from "./bot";
import { addReward } from "./rewards";

export default (client: Client): void => {
  client.on("guildMemberAdd", async (member) => {
    //check the guild id against process.env.GUILD_ID
    if (member.guild.id !== process.env.GUILD_ID) {
      console.log("User joined a different guild");
      return;
    }

    console.log(
      `User "${member.user.username}" has joined "${member.guild.name}"`
    );

    const channel = member.guild.channels.cache.get(
      process.env.WELCOME_CHANNEL_ID!
    );

    if (!(channel && channel.isTextBased())) {
      console.log("Welcome channel does not exist or is not text-based");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: member.id },
    });

    if (user) {
      console.log("User already exists in database");
      channel.send(`Welcome back <@${member.id}>!`);
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        id: member.id,
        invites: 0,
      },
    });
    console.log(`Created new user: ${newUser.id}`);

    const existingInvites = invites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    if (!existingInvites) {
      console.log("No existing invites found");
      channel.send(`Welcome <@${member.id}>!`);
      return;
    }

    //compare the different collection<string, Invite> objects to find the used invite
    const usedInvite = newInvites.find(
      (inv) => existingInvites.get(inv.code)?.uses! < inv.uses!
    );

    console.log(`Used invite: ${usedInvite?.code} ${usedInvite?.inviterId}`);

    const inviterId = usedInvite?.inviterId || member.guild.ownerId;
    const inviter = await prisma.user.findUnique({
      where: { id: inviterId },
    });
    if (!inviter) {
      console.log("Inviter not found in database");

      //create inviter
      const newInviter = await prisma.user.create({
        data: {
          id: inviterId,
          invites: 1,
        },
      });

      channel.send(
        `<@${inviterId}> has invited <@${member.id}>. They now have 1 invite!`
      );
      addReward(inviterId, 1, config, channel, member.guild);
      return;
    } else {
      await prisma.user.update({
        where: { id: inviterId },
        data: {
          invites: inviter.invites + 1,
        },
      });
      channel.send(
        `<@${inviterId}> has invited <@${member.id}>. They now have ${
          inviter.invites + 1
        } invites!`
      );

      addReward(inviterId, inviter.invites + 1, config, channel, member.guild);
    }
  });
};
