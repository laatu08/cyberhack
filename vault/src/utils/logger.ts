import pino, { Logger } from "pino";
import pinoElasticsearch, {
  Options as PinoElasticsearchOptions,
} from "pino-elasticsearch";
import dotenv from "dotenv"

dotenv.config();

interface VaultGuardLog {
  startup?: boolean;
  [key: string]: any;
}

const streamToElastic = pinoElasticsearch({
  index: "vaultguard-token-logs",
  node: process.env.ELASTIC_URL,
  esVersion: 8,
  serializer: (log: VaultGuardLog): Record<string, any> => ({
    "@timestamp": new Date().toISOString(),
    ...log,
  }),
} as PinoElasticsearchOptions);

streamToElastic.on("error", (error: any) => {
  console.error("Elastic log error:", error?.message || error);
  if (error?.meta?.body?.error) {
    console.error(
      "Meta error:",
      JSON.stringify(error.meta.body.error, null, 2)
    );
  }
});

const logger: Logger = pino({ level: "info" }, streamToElastic);

logger.info({ startup: true }, "VaultGuard booted");

export default logger;
