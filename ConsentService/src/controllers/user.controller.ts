import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logToElastic } from "../utils/logger";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await logToElastic({ userId, user, event: "Fetch User Profile" }, "User Profile Retrieval");
    return res.json({ user });
  } catch (error) {
    await logToElastic({ event: "Error fetching user profile", error }, "User Profile Retrieval");
    return res
      .status(500)
      .json({ message: "Failed to fetch user profile", error });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    await logToElastic({ event: "Fetch All Users" }, "User Retrieval");

    return res.json({ users });
  } catch (error) {
    await logToElastic({ event: "Error fetching all users", error }, "User Retrieval");
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
};
