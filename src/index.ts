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
import { serverMappings } from "./config";
import { updateChannelName } from "./discord";
import { getLockStates } from "./locks";
import { getPopulation } from "./population";
import { serverListingContinents, serverListingPopulation } from "./strings";

export interface Env {
  SERVICE_ID: string;
  BOT_TOKEN: string;
  PUSH_KEY: string;
}

const runUpdate = async (env: Env) => {
  const serviceID = env.SERVICE_ID;
  const botToken = env.BOT_TOKEN;

  for (const [serverID, channelIDs] of Object.entries(serverMappings)) {
    // Get population, alerts, and locks.
    const population = await getPopulation(serverID);
    const alerts = await getAlerts(serviceID, serverID);
    const locks = await getLockStates(serviceID, serverID);

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
};

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    await runUpdate(env);
  },
  async fetch(request: Request, env: Env, ctx: FetchEvent): Promise<Response> {
    if (env.PUSH_KEY && request.url.includes(env.PUSH_KEY)) {
      ctx.waitUntil(runUpdate(env));
      return new Response("ok");
    } else {
      return new Response("not ok", { status: 400 });
    }
  },
};
