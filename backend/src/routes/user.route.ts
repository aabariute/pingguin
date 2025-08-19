import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  deleteAccount,
  getUsers,
  updatePassword,
  updateUserAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getUsers);
router.patch("/update-profile", updateUserAvatar);
router.patch("/update-password", updatePassword);
router.patch("/delete-account", deleteAccount);

export default router;
