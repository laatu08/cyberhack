import { Consent } from "@prisma/client";
import { prisma } from "../prisma/client";
import { CreateConsentInput } from "../utils/validator";

// Create a new consent record
export const createConsent = async (
  input: CreateConsentInput
): Promise<Consent> => {
  return prisma.consent.create({
    data: {
      userId:input.userId,
      appId: input.appId,
      dataFields: input.dataFields,
      purpose: input.purpose,
      expiresAt: input.expiresAt,
    },
  });
};

// Fetch all active consents for a user
export const getUserConsents = async (userId: string): Promise<Consent[]> => {
  return prisma.consent.findMany({
    where: {
      userId,
      revoked: false,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Revoke an active consent
export const revokeConsent = async (id: string): Promise<Consent> => {
  return prisma.consent.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

// Check if a consent allows a field for a given app
export const checkConsent = async (
  userId: string,
  appId: string,
  field: string,
  purpose:string
): Promise<boolean> => {
  // console.log('checkConsent service called with:', { userId, appId, field });

  const consents = await prisma.consent.findMany({
    where: {
      userId,
      appId,
      revoked: false,
      purpose,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  // console.log(
  //   "Consent matches:",
  //   consents.map((c) => ({
  //     appId: c.appId,
  //     revoked: c.revoked,
  //     expiresAt: c.expiresAt,
  //     dataFields: c.dataFields,
  //   }))
  // );

  return consents.some(
    (consent) =>
      Array.isArray(consent.dataFields) &&
      (consent.dataFields as string[]).includes(field)
  );
};
