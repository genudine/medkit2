import { PlatformConfig } from "./config";

export type Population<T extends undefined | number> = {
  total: number;
  nc: T;
  tr: T;
  vs: T;
};

export const getPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<number> => {
  return (await getAllPopulations(worldID, platformConfig)).average || 0;
};

const getVoidwellPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<Population<undefined>> => {
  const res = await fetch(
    `https://api.voidwell.com/ps2/worldstate/${worldID}?platform=${platformConfig.voidwellPlatform}`
  );
  const data: { onlineCharacters: number } = await res.json();

  return {
    total: data.onlineCharacters,
    nc: undefined,
    tr: undefined,
    vs: undefined,
  };
};

const getFisuPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<Population<number>> => {
  const res = await fetch(
    `https://${platformConfig.fisuSubdomain}.fisu.pw/api/population/?world=${worldID}`
  );
  const data: { result: { vs: number; nc: number; tr: number; ns: number }[] } =
    await res.json();

  const { vs, nc, tr, ns } = data.result[0];

  return {
    total: vs + nc + tr + ns,
    nc,
    tr,
    vs,
  };
};

const getHonuPopulation = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<Population<number>> => {
  if (!platformConfig.honuAvailable) {
    return { total: -1, nc: -1, tr: -1, vs: -1 };
  }

  const res = await fetch(`https://wt.honu.pw/api/population/${worldID}`);
  const data: {
    total: number;
    nc: number;
    tr: number;
    vs: number;
    ns_vs: number;
    ns_tr: number;
    ns_nc: number;
  } = await res.json();

  return {
    total: data.total,
    nc: data.nc + data.ns_nc,
    tr: data.tr + data.ns_tr,
    vs: data.vs + data.ns_vs,
  };
};

export const getAllPopulations = async (
  worldID: string,
  platformConfig: PlatformConfig
): Promise<{
  average: number;
  fisu: number;
  honu: number;
  voidwell: number;
  averages: { nc: number; tr: number; vs: number };
}> => {
  const values = await Promise.all([
    getHonuPopulation(worldID, platformConfig).catch(() => ({
      total: -1,
      nc: -1,
      tr: -1,
      vs: -1,
    })),
    getVoidwellPopulation(worldID, platformConfig).catch(() => ({
      total: -1,
      nc: -1,
      tr: -1,
      vs: -1,
    })),
    getFisuPopulation(worldID, platformConfig).catch(() => ({
      total: -1,
      nc: -1,
      tr: -1,
      vs: -1,
    })),
  ]);

  const [honu, voidwell, fisu] = values;

  // Both -1 and 0 are bad values.
  const workingValues = values.filter((v) => v.total > 0);
  const factionWorkingValues = [honu, fisu].filter((v) => v.total > 0);

  return {
    honu: honu.total,
    voidwell: voidwell.total,
    fisu: fisu.total,
    average: Math.floor(
      workingValues.reduce((a, b) => a + b.total, 0) / workingValues.length
    ),
    averages: {
      nc: Math.floor(
        factionWorkingValues.reduce((a, b) => a + b.nc, 0) /
          factionWorkingValues.length
      ),
      tr: Math.floor(
        factionWorkingValues.reduce((a, b) => a + b.tr, 0) /
          factionWorkingValues.length
      ),
      vs: Math.floor(
        factionWorkingValues.reduce((a, b) => a + b.vs, 0) /
          factionWorkingValues.length
      ),
    },
  };
};
