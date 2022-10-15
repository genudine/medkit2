export const updateChannelName = async (
  botToken: string,
  channelID: string,
  name: string
) => {
  const req = await fetch(`https://discord.com/api/v10/channels/${channelID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  console.log("discord response", await req.json());

  if (req.status === 429) {
    console.warn("Update for channel", channelID, "failed due to rate limit");
    return;
  }

  if (req.status !== 200) {
    throw new Error(`Failed to update channel name: ${req.status}`);
  }
};

type Embed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
  thumbnail?: { url: string };
  image?: { url: string };
};

export const upsertMessage = async (
  botToken: string,
  channelID: string,
  messageID: string | null,
  embeds: Embed[]
) => {
  const req = await fetch(
    `https://discord.com/api/v10/channels/${channelID}/messages${
      messageID ? `/${messageID}` : ""
    }`,
    {
      method: messageID ? "PATCH" : "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds,
      }),
    }
  );

  console.log("discord response", await req.text());

  if (req.status !== 200) {
    throw new Error(`Failed to update channel name: ${req.status}`);
  }
};
