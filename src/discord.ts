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
