import express from "express";

import authRouter from "./auth.js";
import workspaceRouter from "./workspace.js";
import tagRouter from "./tag.js";
import folderRouter from "./folder.js";
import profileRouter from "./profile.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/workspace", workspaceRouter);
router.use("/tag", tagRouter);
router.use("/folder", folderRouter);
router.use("/profile", profileRouter);

export default router;
