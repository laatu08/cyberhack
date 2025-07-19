import { Router } from "express";
import { createUser, getAllUsers,getAccountByUserId } from "../controllers/auth.controller";

const router = Router();
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:userId/account", getAccountByUserId);

export default router;
