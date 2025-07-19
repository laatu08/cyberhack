import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  checkConsent,
  createConsent,
  getUserConsents,
} from "../services/consent.service";
// @ts-ignore
import { logToElastic } from "../utils/logger";

// POST /consent
export const createConsentHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // const body = req.body as Omit<CreateConsentInput, "userId">;
    // const userId = req.user?.id!;
    const body = req.body;
    // const consent = await createConsent(body, userId);
    const consent = await createConsent(body);

    await logToElastic({ userId: req.user?.id, consentId: consent.id, event: "Consent Creation" }, "Consent Creation");
    res.status(201).json({ consent });
  } catch (error) {
    await logToElastic({ event: "Error creating consent", error }, "Consent Creation");
    res.status(500).json({ message: "Failed to create consent", error });
  }
};

// GET /consent (now uses userId from token, not URL param)
export const getUserConsentsHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const consents = await getUserConsents(userId);
    await logToElastic({ userId, event: "Fetch User Consents" }, "Consent Retrieval");
    res.status(200).json({ consents });
  } catch (error) {
    await logToElastic({ event: "Error fetching user consents", error }, "Consent Retrieval");
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

export const getUserConsentsHandlerForBank = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const consents = await getUserConsents(userId);
    await logToElastic({ userId, event: "Bank Fetch User Consents" }, "Consent Retrieval");
    res.status(200).json({ consents });
  } catch (error) {
    await logToElastic({ event: "Error fetching user consents", error }, "Consent Retrieval");
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

// DELETE /consent/:id
// export const revokeConsentHandler = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Optional: validate that this consent actually belongs to the user
//     const consent = await revokeConsent(id); // You can enhance this to check ownership

//     logger.info(`Consent ${id} revoked by user ${userId}`);
//     res.status(200).json({ consent });
//   } catch (error) {
//     logger.error('Error revoking consent: ' + error);
//     res.status(500).json({ message: 'Failed to revoke consent' });
//   }
// };

// GET /consent/check?userId=&appId=&field=
export const checkConsentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Calling controller");
    const { userId, appId, field, purpose } = req.query;

    if (!userId || !appId || !field) {
      res.status(400).json({ message: "Missing query parameters" });
      return;
    }

    const allowed = await checkConsent(
      userId as string,
      appId as string,
      field as string,
      purpose as string
    );
    await logToElastic({ userId, appId, field, allowed, event: "Consent Check" }, "Consent Check");
    res.status(200).json({ allowed });
  } catch (error) {
    await logToElastic({ event: "Error checking consent", error }, "Consent Check");
    res.status(500).json({ message: "Failed to check consent" });
  }
};
