import { Client } from "@elastic/elasticsearch";
const { ELASTIC_URL, ELASTIC_API_KEY } = process.env;

if (!ELASTIC_URL || !ELASTIC_API_KEY) {
  throw new Error("Missing ELASTIC_URL or ELASTIC_API_KEY in env");
}

const client = new Client({
  node: ELASTIC_URL,
  auth: { apiKey: ELASTIC_API_KEY },
  tls: { rejectUnauthorized: false },
});

export async function logToElastic(logData: any, message: string) {
  try {
    await client.index({
      index: "vaultguard-token-logs",
      document: { "@timestamp": new Date().toISOString(), message, ...logData },
    });
  } catch (err: any) {
    console.error(
      "Failed to log to Elasticsearch:",
      err?.meta?.body?.error || err
    );
  }
}
