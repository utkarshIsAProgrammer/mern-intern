import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const router = Router();

// Zod schema for input validation
const RecommendationSchema = z.object({
	topics: z.string().min(1, "Topics are required"),
	skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
	additionalPreferences: z.string().optional(),
});

type RecommendationRequest = z.infer<typeof RecommendationSchema>;

router.post("/", async (req: Request, res: Response) => {
	const API_KEY = process.env.GEMINI_API_KEY;
	const validation = RecommendationSchema.safeParse(req.body);

	if (!validation.success) {
		return res.status(400).json({
			error: "Invalid input",
			details: validation.error.format(),
		});
	}

	const { topics, skillLevel, additionalPreferences } = validation.data;

	// Check if API key is configured
	if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
		console.warn("Gemini API key is not configured. Returning mock data.");
		return res.json({
			recommendations: getMockRecommendations(topics, skillLevel),
			note: "This is mock data because the Gemini API key is not configured. Set GEMINI_API_KEY in .env to use real AI.",
		});
	}

	try {
		const genAI = new GoogleGenerativeAI(API_KEY);
		const model = genAI.getGenerativeModel({
			model: "gemini-3-flash-preview",
		});

		const prompt = `Generate a list of 5 course recommendations for someone interested in ${topics} at a ${skillLevel} level. 
    Additional preferences: ${additionalPreferences || "none"}. 
    Please return the response strictly as a JSON array of objects, where each object has "title", "platform", "description", and "level".
    Do not include any other text, just the JSON array.`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Clean up the response text in case Gemini adds markdown code blocks
		const cleanedText = text.replace(/```json|```/g, "").trim();

		try {
			const recommendations = JSON.parse(cleanedText);
			res.json({ recommendations });
		} catch (parseError) {
			console.error("Error parsing Gemini response:", parseError);
			res.json({
				recommendations: text,
				note: "Response was not valid JSON, returning raw text.",
			});
		}
	} catch (error: any) {
		console.error("Error calling Gemini AI API:", error);
		res.status(500).json({
			error: "Failed to generate recommendations from Gemini AI.",
			details: error.message,
		});
	}
});

// Mock recommendations for demonstration when API key is missing
function getMockRecommendations(topics: string, skillLevel: string) {
	return [
		{
			title: `${topics} for ${skillLevel}s`,
			platform: "Coursera",
			description: `A comprehensive guide to mastering ${topics} starting from the basics.`,
			level: skillLevel,
		},
		{
			title: `Advanced ${topics} Techniques`,
			platform: "Udemy",
			description: `Take your ${topics} skills to the next level with hands-on projects.`,
			level: skillLevel,
		},
		{
			title: `${topics} Specialization`,
			platform: "edX",
			description: `Professional certificate program focusing on ${topics} in the modern industry.`,
			level: skillLevel,
		},
	];
}

export { router as recommendationRoutes };
