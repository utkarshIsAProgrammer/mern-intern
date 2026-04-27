import express from "express";
import { signup, login, logout } from "../controllers/auth.controllers";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Sample admin-only route
router.get("/admin-only", verifyToken, isAdmin, (req, res) => {
	res.status(200).json({
		success: true,
		message: "Welcome, Admin! You have access to this protected route.",
		admin: req.user,
	});
});

export { router as authRoutes };
