const { createClient } = require('redis');

const client = createClient();

set = async ({ key, value, timeType, time }) => {
  await client.connect();
  await client.set(key, value, timeType, time);
  await client.disconnect();
};

get = async (key) => {
  await client.connect();
  const result = await client.get(key);
  await client.disconnect();
  return result;
};

module.exports = { set, get };
