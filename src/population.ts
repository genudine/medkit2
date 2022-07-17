import { PlatformConfig } from "./config";

export const getPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<number> => {
  return (await getAllPopulations(worldID, platformConfig)).average || 0;
};

const getVoidwellPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<number> => {
  const res = await fetch(
    `https://api.voidwell.com/ps2/worldstate/${worldID}?platform=${platformConfig.voidwellPlatform}`
  );
  const data: { onlineCharacters: number } = await res.json();

  return data.onlineCharacters;
};

const getFisuPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<number> => {
  const res = await fetch(
    `https://${platformConfig.fisuSubdomain}.fisu.pw/api/population/?world=${worldID}`
  );
  const data: { result: { vs: number; nc: number; tr: number; ns: number }[] } =
    await res.json();

  const { vs, nc, tr, ns } = data.result[0];
  return vs + nc + tr + ns;
};

const getHonuPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<number> => {
  if (!platformConfig.honuAvailable) {
    return -1;
  }

  const res = await fetch(`https://wt.honu.pw/api/population/${worldID}`);
  const data: { total: number } = await res.json();

  return data.total;
};

export const getAllPopulations = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<{
  average: number;
  fisu: number;
  honu: number;
  voidwell: number;
}> => {
  const values = await Promise.all([
    getHonuPopulation(worldID, platformConfig).catch(() => -1),
    getVoidwellPopulation(worldID, platformConfig).catch(() => -1),
    getFisuPopulation(worldID, platformConfig).catch(() => -1),
  ]);

  const [honu, voidwell, fisu] = values;

  // Both -1 and 0 are bad values.
  const workingValues = values.filter((v) => v > 0);

  return {
    honu,
    voidwell,
    fisu,
    average: Math.floor(
      workingValues.reduce((a, b) => a + b, 0) / workingValues.length
    ),
  };
};
