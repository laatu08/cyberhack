import { decryptFields } from "../utils/cryptoUtils";
import { logToElastic } from "../utils/logger";
import redisClient from "../utils/redis";

interface MetaData {
  userId: string;
  field: string;
  encrypted: string;
  key: string;
  iv: string;
}

export async function tryInternalRefresh(
  token: string
): Promise<
  | { status: "ok"; field: string; masked: string }
  | { status: "error"; reason: string }
> {
  // replace redis fetch with db fetch
  const metaKey = `meta:${token}`;
  const metaRaw = await redisClient.get(metaKey);
  if (!metaRaw) return { status: "error", reason: "not_found" };

  const { userId, field, encrypted, key, iv } = JSON.parse(metaRaw) as MetaData;

  const value = decryptFields(encrypted, key, iv);

  const masked = value.length > 4 ? value.slice(0, 2) + "****" : "****";

  await logToElastic(
    {
      event: "internal-refresh",
      userId,
      field,
      token,
      decryptedFor: "audit",
      masked,
    },
    "Performed internal audit decryption"
  );

  return { status: "ok", field, masked };
}
