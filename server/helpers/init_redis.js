// https://github.com/redis/node-redis/blob/HEAD/docs/v3-to-v4.md
// https://inpa.tistory.com/entry/REDIS-NODE-%F0%9F%93%9A-%EB%85%B8%EB%93%9Cexpress%EC%97%90%EC%84%9C-redis-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%BA%90%EC%8B%B1-%EC%84%B8%EC%85%98-%EC%8A%A4%ED%86%A0%EC%96%B4#javascript_redis_%EB%AC%B8%EB%B2%95

import {createClient} from "redis";

const client = createClient({legacyMode: true}); // legacy 모드 반드시 설정 !!
client.on('connect', () => {
  console.info('Redis connected!');
});
client.on('error', (err) => {
  console.error('Redis Client Error', err);
});
 // redis v4 연결 (비동기)
await client.connect();
await client.ping();

const redisClient = client.v4;

redisClient.get = (key) => {
  return new Promise((resolve, reject) => {
    client.get(String(key), (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}


export default redisClient;

