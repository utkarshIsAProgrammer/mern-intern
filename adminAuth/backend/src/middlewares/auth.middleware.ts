import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: string;
	role: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.jwt;

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized - No token provided",
		});
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "jwtSecret",
		) as JwtPayload;

		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - Invalid token",
			});
		}

		req.user = decoded;
		next();
	} catch (error) {
		console.log("Error in verifyToken middleware", error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({
			success: false,
			message: "Forbidden - Admin access required",
		});
	}
};
