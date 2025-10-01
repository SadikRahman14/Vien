import { Router } from "express";
import {
    loginUser,
    adminLogin,
    registerUser,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
} from "../controllers/user.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/admin-login").post(adminLogin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

export default router;