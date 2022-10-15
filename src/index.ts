/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

import { getAlerts } from "./alerts";
import {
  getPlatformConfig,
  serverMappings,
  updateTimeMappings,
} from "./config";
import { updateChannelName, upsertMessage } from "./discord";
import { getLockStates } from "./locks";
import { getAllPopulations, getPopulation } from "./population";
import {
  serverListingContinents,
  serverListingPopulation,
  serverStatsEmbed,
} from "./strings";

export interface Env {
  SERVICE_ID: string;
  BOT_TOKEN: string;
  PUSH_KEY: string;

  CONFIG: KVNamespace;
}

const runChannelNameUpdate = async (env: Env) => {
  const serviceID = env.SERVICE_ID;
  const botToken = env.BOT_TOKEN;

  for (const [serverID, channelIDs] of Object.entries(serverMappings)) {
    const platformConfig = getPlatformConfig(serverID);

    // Get population, alerts, and locks.
    const population = await getPopulation(serverID, platformConfig);
    const alerts = await getAlerts(serviceID, serverID, platformConfig);
    const locks = await getLockStates(serviceID, serverID, platformConfig);

    const popListing = serverListingPopulation(serverID, population);
    const contListing = serverListingContinents(serverID, alerts, locks);

    console.log("Sending", { popListing, contListing });

    // Update the server listings
    for (const [popChannel, contChannel] of channelIDs) {
      await updateChannelName(botToken, popChannel, popListing);
      if (contChannel) {
        await updateChannelName(botToken, contChannel, contListing);
      }
    }
  }

  await doUpdateTime(botToken);
};

const doUpdateTime = async (botToken: string) => {
  // Send update time
  const humanDate = new Date().toLocaleString("en-GB", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const updateTimeText = `@ ${humanDate} UTC`;
  console.log("Sending", { updateTimeText });

  for (const channelID of updateTimeMappings) {
    await updateChannelName(botToken, channelID, updateTimeText);
  }
};

const runInteractions = async (env: Env) => {};

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    await Promise.all([runChannelNameUpdate(env), runInteractions(env)]);
  },
  async fetch(request: Request, env: Env, ctx: FetchEvent): Promise<Response> {
    if (env.PUSH_KEY && request.url.includes(env.PUSH_KEY)) {
      ctx.waitUntil(runChannelNameUpdate(env));
      return new Response("ok");
    } else {
      const parts = request.url.split("/");
      const serverID = parts[parts.length - 1];
      const platformConfig = getPlatformConfig(serverID);

      if (request.url.includes("/x/debug-population")) {
        const population = await getAllPopulations(serverID, platformConfig);
        return new Response(JSON.stringify(population));
      }

      if (request.url.includes("/x/debug-alerts")) {
        const alerts = await getAlerts(
          env.SERVICE_ID,
          serverID,
          platformConfig
        );
        return new Response(JSON.stringify(alerts));
      }

      if (request.url.includes("/x/debug-locks")) {
        const locks = await getLockStates(
          env.SERVICE_ID,
          serverID,
          platformConfig
        );
        return new Response(JSON.stringify(locks));
      }

      if (request.url.includes("/x/bump-update-time")) {
        await doUpdateTime(env.BOT_TOKEN);
        return new Response("ok");
      }

      if (request.url.includes("/x/test-message")) {
        await upsertMessage(
          env.BOT_TOKEN,
          "997704124416151622",
          "998448233481240606",
          serverStatsEmbed(await getAllPopulations(serverID, platformConfig))
        );
        return new Response("ok");
      }

      return new Response("not ok", { status: 400 });
    }
  },
};
