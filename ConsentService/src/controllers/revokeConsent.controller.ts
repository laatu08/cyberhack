import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { revokeConsent } from "../services/consent.service";
import {
  createRevokeRequest,
  getAllPendingRevokeRequests,
  getPendingRevokeRequestsForUser,
  getRevokeRequestWithConsent,
  updateRevokeRequestStatus,
} from "../services/revokeConsent.service";
// @ts-ignore
import { logToElastic } from "../utils/logger";

// POST /revoke-request/:consentId
export const requestRevokeConsentHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { consentId } = req.params;
    const userId = req.user?.id!;

    const revokeRequest = await createRevokeRequest(userId, consentId);

    // Simulate sending the revoke request to bank
    await logToElastic(
      { userId, consentId, revokeRequestId: revokeRequest.id, event: "Revoke Request Created" },
      "Revoke Request"
    );

    res.status(202).json({
      message: "Revoke request created and sent to bank for approval",
      revokeRequest,
    });
  } catch (error) {
    await logToElastic({ event: "Error creating revoke request", error }, "Revoke Request");
    res.status(500).json({ message: "Failed to create revoke request" });
  }
};

// POST /bank/revoke-status
export const handleBankRevokeStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { revokeRequestId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const request = await getRevokeRequestWithConsent(revokeRequestId);
    if (!request) {
      res.status(404).json({ message: "Revoke request not found" });
      return;
    }

    if (request.status !== "pending") {
      res.status(409).json({ message: "Revoke request already processed" });
      return;
    }

    await updateRevokeRequestStatus(revokeRequestId, status);

    if (status === "approved") {
      await revokeConsent(request.consentId);
      await logToElastic({ consentId: request.consentId, status, event: "Revoke Request Approved" }, "Revoke Request");
    } else if(status==="rejected") {
      await logToElastic({ consentId: request.consentId, status, event: "Revoke Request Rejected" }, "Revoke Request");
    }

    res.status(200).json({ message: `Revoke request ${status}` });
  } catch (error) {
    await logToElastic({ event: "Error updating revoke request status", error }, "Revoke Request");
    res.status(500).json({ message: "Failed to update revoke request status" });
  }
};

export const getPendingRevokeRequestsForUserHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId!;
    
    const pendingRequests = await getPendingRevokeRequestsForUser(userId);
    await logToElastic({ userId, event: "Fetch User Pending Revoke Requests" }, "Revoke Request");
    res.status(200).json({ pendingRequests });
  } catch (error) {
    await logToElastic({ event: "Error fetching user pending revoke requests", error }, "Revoke Request");
    res.status(500).json({ message: "Failed to fetch user revoke requests" });
  }
};


export const getAllPendingRevokeRequestsHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pendingRequests = await getAllPendingRevokeRequests();
    await logToElastic({ event: "Fetch All Pending Revoke Requests" }, "Revoke Request");
    res.status(200).json({ pendingRequests });
  } catch (error) {
    await logToElastic({ event: "Error fetching all pending revoke requests", error }, "Revoke Request");
    res.status(500).json({ message: "Failed to fetch revoke requests" });
  }
};