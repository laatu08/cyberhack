import cron from "node-cron";
import { prisma } from "../prisma/client";
// @ts-ignore
import { logToElastic } from "../utils/logger";

export const startConsentExpirationJob = () => {
  // Runs every hour at minute 0 → "0 * * * *"
  cron.schedule("*/10 * * * *", async () => {
    await logToElastic({ time:"10m",event: "Consent expiration job started" }, "Expiration Job");

    try {
      const now = new Date();

      // Find expired, non-revoked consents
      const expiredConsents = await prisma.consent.updateMany({
        where: {
          expiresAt: {
            lt: now,
          },
          revoked: false,
        },
        data: {
          revoked: true,
        },
      });

      await logToElastic(
        { count: expiredConsents.count, event: "Expired consents processed" , time: new Date().toISOString() },
        "Expiration Job"
      );
    } catch (error) {
      await logToElastic(
        { event: "Error expiring consents", error },
        "Expiration Job"
      );
    }
  });
};
