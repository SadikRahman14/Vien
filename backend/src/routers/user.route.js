import { Router } from "express";
import {
    loginUser,
    adminLogin,
    registerUser
}
from "../controllers/user.controller.js"

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/admin-login").post(adminLogin);

export default router;