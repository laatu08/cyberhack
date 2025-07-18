import { logToElastic } from "../utils/logger";
import redisClient from "../utils/redis";

(async () => {
  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.configSet("notify-keyspace-events", "Ex");

  await sub.pSubscribe("__keyevent@0__:expired", async (expiredKey: string) => {
    if (!expiredKey.startsWith("vault:")) return;

    const [, token] = expiredKey.split(":");

    await logToElastic(
      {
        event: "token_expired",
        token,
      },
      "Vault token expired. Already archived in DB."
    );

    await redisClient.rPush("expired:queue", token);
  });
})();
