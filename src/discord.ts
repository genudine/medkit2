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

  console.log({ json: await req.json() });
};
