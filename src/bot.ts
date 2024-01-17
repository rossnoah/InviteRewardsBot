import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Invite,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import userJoin from "./userJoin";
import ready from "./ready";
import onInviteCreate from "./onInviteCreate";

require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

export const prisma = new PrismaClient();
// export let invites: { [key: string]: Collection<string, Invite> } = {};
//better way to do this? use a map instead of an object

export const invites = new Map<string, Collection<string, Invite>>();

//read file config.json
export const config = require("../config.json");

console.log("Bot is starting...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
});

ready(client);
userJoin(client);
onInviteCreate(client);

client.login(token);
