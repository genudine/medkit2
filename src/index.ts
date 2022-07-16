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
import { updateChannelName } from "./discord";
import { getLockStates } from "./locks";
import { getPopulation } from "./population";
import { serverListingContinents, serverListingPopulation } from "./strings";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  SERVER_MAPPINGS: string;
  SERVICE_ID: string;
  BOT_TOKEN: string;
}

interface ServerMappings {
  [serverID: string]: [string, string][]; // emerald# to [pop, cont] channel IDs
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const serverMappings: ServerMappings = JSON.parse(env.SERVER_MAPPINGS);
    const serviceID = env.SERVICE_ID;
    const botToken = env.BOT_TOKEN;

    Object.entries(serverMappings).forEach(async ([serverID, channelIDs]) => {
      // Get population, alerts, and locks.
      const population = await getPopulation(serverID);
      const alerts = await getAlerts(serverID);
      const locks = await getLockStates(serviceID, serverID);

      const popListing = serverListingPopulation(serverID, population);
      const contListing = serverListingContinents(serverID, alerts, locks);

      console.log("Sending", { popListing, contListing });

      // Update the server listings
      channelIDs.forEach(async ([popChannel, contChannel]) => {
        await updateChannelName(botToken, popChannel, popListing);
        await updateChannelName(botToken, contChannel, contListing);
      });
    });
  },
};
