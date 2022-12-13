export const serverMappings = {
  "1": [
    ["997765289842319410", "997765317059153990"], // PS2 Discord
  ],
  "10": [
    ["997765480666365983", "997765503831506964"], // PS2 Discord
  ],
  "13": [
    ["997765368930111528", "997765446403100722"], // PS2 Discord
  ],
  "17": [
    ["997765123366211654", "997765230140608522"], // PS2 Discord
    ["997704124416151622", "997762119024005220"], // Genudine Medkit Manufacuturing
    ["1050533474718724167", "1050533495174344744"], // FXLT
  ],
  "19": [
    ["997783243296350279", ""], // PS2 Discord
  ],
  "40": [
    ["997765531341967470", "997765553928286319"], // PS2 Discord
  ],
  "1000": [
    ["997936799823446089", "997936830303457280"], // PS2 Discord
  ],
  "2000": [
    ["997936745117126677", "997936773218975884"], // PS2 Discord
  ],
};

export const updateTimeMappings = [
  "997953082669412482", // PS2 Discord
  "1052356228128460932", // PCD
];

export const platformConfig = {
  pc: {
    fisuSubdomain: "ps2",
    voidwellPlatform: "pc",
    honuAvailable: true,
    censusCollection: "ps2:v2",
  },
  ps4us: {
    fisuSubdomain: "ps4us.ps2",
    voidwellPlatform: "ps4us",
    honuAvailable: false,
    censusCollection: "ps2ps4us:v2",
  },
  ps4eu: {
    fisuSubdomain: "ps4eu.ps2",
    voidwellPlatform: "ps4eu",
    honuAvailable: false,
    censusCollection: "ps2ps4eu:v2",
  },
};

export type PlatformConfig = typeof platformConfig[keyof typeof platformConfig];

export const getPlatformConfig = (serverID: string): PlatformConfig => {
  switch (serverID) {
    case "1000":
      return platformConfig.ps4us;
    case "2000":
      return platformConfig.ps4eu;
    default:
      return platformConfig.pc;
  }
};
