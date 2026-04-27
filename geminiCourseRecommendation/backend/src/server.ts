import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { recommendationRoutes } from "./routes/recommendation.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req: Request, res: Response) => {
	res.send("Course Recommendation API (TypeScript) is running");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
