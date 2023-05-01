const { createClient } = require('redis');

const client = createClient();

set = async ({ key, time }) => {
  await client.connect();
  await client.set(key, time);
  await client.disconnect();
};

get = async (key) => {
  await client.connect();
  const result = await client.get(key);
  await client.disconnect();
  return result;
};

module.exports = { set, get };
