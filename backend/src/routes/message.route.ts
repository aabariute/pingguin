import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  getLastMessages,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protect);

router.get("/last-messages", getLastMessages);
router.post("/send/:id", sendMessage);
router.get("/:id", getMessages);

export default router;
