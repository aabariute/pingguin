import express from "express";
import {
  isNicknameAvailabe,
  login,
  logout,
  protect,
  signup,
  verifyAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/check-nickname", isNicknameAvailabe);
router.get("/verify", protect, verifyAuth);

export default router;
