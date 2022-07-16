import fetch from 'node-fetch';
import fs from 'fs';

const template = (data) => `// This file is generated. Run \`yarn codegen\` to regenerate.
import { AlertType } from "./types";

export const metagameIDs = {
  ${Object.entries(data).map(([id, type]) => `${JSON.stringify(id)}: ${type}`).join(",\n")}
};
`;


const run = async () => {
    // Get the data from the api
    const response = await fetch("https://census.daybreakgames.com/s:medkit2/get/ps2:v2/metagame_event/?c:limit=1000");
    const json = await response.json();

    const data = {
        // Oshur pre-fill
        "222": "AlertType.Conquest",
        "223": "AlertType.Conquest",
        "224": "AlertType.Conquest",
        "226": "AlertType.Conquest",
        "232": "AlertType.Air",
        "233": "AlertType.Max",
    };

    // Parse the data
    for (const event of json.metagame_event_list) {
        switch (event.type) {
            case "9": // Conquest
                data[event.metagame_event_id] = "AlertType.Conquest";
                break;
            case "10": // Air
                data[event.metagame_event_id] = "AlertType.Air";
                break;
            case "6": // Max
                data[event.metagame_event_id] = "AlertType.Max";
                break;
        }
    }

    // Write the file
    const output = template(data);
    fs.writeFileSync("./src/metagame.gen.ts", output);
}

run().then().catch(console.error);