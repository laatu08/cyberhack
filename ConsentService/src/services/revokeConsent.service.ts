import { ConsentRevokeRequest } from "@prisma/client";
import { prisma } from "../prisma/client";
// import { ConsentRevokeRequest } from "../generated/prisma";

// Create a new revoke request (status: pending)
export const createRevokeRequest = async (
  userId: string,
  consentId: string
): Promise<ConsentRevokeRequest> => {
  return prisma.consentRevokeRequest.create({
    data: {
      userId,
      consentId,
      status: "pending",
    },
  });
};

// Update revoke request status (approved / rejected)
export const updateRevokeRequestStatus = async (
  revokeRequestId: string,
  status: "approved" | "rejected"
): Promise<ConsentRevokeRequest> => {
  return prisma.consentRevokeRequest.update({
    where: { id: revokeRequestId },
    data: { status },
  });
};

// Get revoke request with consent relation
export const getRevokeRequestWithConsent = async (
  revokeRequestId: string
): Promise<ConsentRevokeRequest | null> => {
  return prisma.consentRevokeRequest.findUnique({
    where: { id: revokeRequestId },
    include: { consent: true },
  });
};

export const getPendingRevokeRequestsForUser = async (userId: string) => {
  return prisma.consentRevokeRequest.findMany({
    where: {
      userId,
      status: "pending",
    },
    include: {
      consent: true,
    },
  });
};

export const getAllPendingRevokeRequests = async () => {
  return prisma.consentRevokeRequest.findMany({
    where: {
      status: "pending",
    },
    include: {
      consent: {
        select: {
          id: true,
          appId: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

