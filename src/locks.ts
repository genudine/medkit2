import { PlatformConfig } from "./config";
import { Continent } from "./types";

export type LockStates = {
  [key in Continent]: boolean;
};

interface CensusMapList {
  map_list: {
    ZoneId: string;
    Regions: {
      Row: {
        RowData: {
          RegionId: string;
          FactionId: string;
        };
      }[];
    };
  }[];
}

export const getLockStates = async (
  serviceID: string,
  worldID: string,
  platformConfig: PlatformConfig
): Promise<LockStates> => {
  const response = await fetch(
    `https://census.daybreakgames.com/s:${serviceID}/get/${
      platformConfig.censusCollection
    }/map/?world_id=${worldID}&zone_ids=${Object.values(Continent).join(",")}`
  );

  const data: CensusMapList = await response.json();
  const warpgateFactions = transformMapList(data);

  const lockStates: LockStates = {
    [Continent.Indar]: false,
    [Continent.Hossin]: false,
    [Continent.Amerish]: false,
    [Continent.Esamir]: false,
    [Continent.Oshur]: false,
  };

  Object.entries(warpgateFactions).forEach(([continent, factions]) => {
    console.log({ continent, factions });
    lockStates[continent as any as Continent] = factions.every(
      (v) => v === factions[0]
    );
  });

  return lockStates;
};

// Warpgate region IDs
const zoneFilters = {
  [Continent.Indar]: ["2201", "2202", "2203"],
  [Continent.Hossin]: ["4230", "4240", "4250"],
  [Continent.Amerish]: ["6001", "6002", "6003"],
  [Continent.Esamir]: ["18029", "18030", "18062"],
  [Continent.Oshur]: ["18303", "18304", "18305"],
};

const transformMapList = (
  mapList: CensusMapList
): Record<Continent, [string, string, string]> => {
  // reduce CensusMapList to ZoneId -> Warpgate faction IDs
  const warpgateFactions = mapList.map_list.reduce((acc, map) => {
    const { ZoneId, Regions } = map;
    const { Row } = Regions;

    const warpgateFactionIDs = Row.filter((row) => {
      return zoneFilters[Number(ZoneId) as any as Continent].includes(
        row.RowData.RegionId
      );
    }).map(({ RowData }) => RowData.FactionId);

    return { ...acc, [Number(ZoneId)]: warpgateFactionIDs };
  }, {});

  return warpgateFactions as any;
};
