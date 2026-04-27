import { Request, Response } from "express";
import { Course } from "../models/Course.js";
import csv from "csv-parser";
import fs from "fs";
import { client as redisClient } from "../config/redis.js";
import { CourseZodSchema, ICourse } from "../schemas/courseSchema.js";

const CACHE_EXPIRY = 3600; // 1 hour

export const uploadCourses = async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ message: "Please upload a CSV file" });
	}

	const results: any[] = [];
	fs.createReadStream(req.file.path)
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", async () => {
			try {
				const mappedCourses: ICourse[] = results.map((item) => {
					const rawCourse = {
						courseId: item["Unique ID"],
						title: item["Course Name"],
						courseCode: item["Course Code"],
						universityCode: item["University Code"],
						universityName: item["University Name"],
						department: item["Department/School"],
						category: item["Discipline/Major"],
						specialization: item["Specialization"],
						courseLevel: item["Course Level"],
						description: item["Overview/Description"],
						summary: item["Summary"],
						prerequisites: item["Prerequisites (comma-separated)"]
							? item["Prerequisites (comma-separated)"]
									.split(",")
									.map((s: string) => s.trim())
							: [],
						learningOutcomes: item[
							"Learning Outcomes (comma-separated)"
						]
							? item["Learning Outcomes (comma-separated)"]
									.split(",")
									.map((s: string) => s.trim())
							: [],
						teachingMethodology: item["Teaching Methodology"],
						assessmentMethods: item[
							"Assessment Methods (comma-separated)"
						]
							? item["Assessment Methods (comma-separated)"]
									.split(",")
									.map((s: string) => s.trim())
							: [],
						credits: parseFloat(item["Credits"]) || 0,
						duration: parseFloat(item["Duration (Months)"]) || 0,
						language: item["Language of Instruction"],
						syllabusUrl: item["Syllabus URL"],
						keywords: item["Keywords (comma-separated)"]
							? item["Keywords (comma-separated)"]
									.split(",")
									.map((s: string) => s.trim())
							: [],
						instructor: item["Professor Name"],
						instructorEmail: item["Professor Email"],
						officeLocation: item["Office Location"],
						intake: item["Open for Intake (Year/Semester)"],
						admissionOpenYears: item["Admission Open Years"],
						attendanceType: item["Attendance Type"],
						tuitionFeeFirstYear:
							parseFloat(item["1st Year Tuition Fee"]) || 0,
						tuitionFeeTotal:
							parseFloat(item["Total Tuition Fee"]) || 0,
						currency: item["Tuition Fee Currency"],
						applicationFee:
							parseFloat(item["Application Fee Amount"]) || 0,
						applicationFeeCurrency:
							item["Application Fee Currency"],
						applicationFeeWaived:
							item["Application Fee Waived (Yes/No)"] === "Yes",
						requiredMaterials:
							item["Required Application Materials"],
						minIELTS: parseFloat(item["Minimum IELTS Score"]) || 0,
						minTOEFL: parseFloat(item["Minimum TOEFL Score"]) || 0,
						minPTE: parseFloat(item["Minimum PTE Score"]) || 0,
						minDuolingo:
							parseFloat(item["Minimum Duolingo Score"]) || 0,
						minCambridge:
							parseFloat(
								item["Minimum Cambridge English Score"],
							) || 0,
						greRequired: item["GRE Required (Yes/No)"] === "Yes",
						greScore: parseFloat(item["GRE Score"]) || 0,
						gmatRequired: item["GMAT Required (Yes/No)"] === "Yes",
						gmatScore: parseFloat(item["GMAT Score"]) || 0,
						satRequired: item["SAT Required (Yes/No)"] === "Yes",
						satScore: parseFloat(item["SAT Score"]) || 0,
						actRequired: item["ACT Required (Yes/No)"] === "Yes",
						actScore: parseFloat(item["ACT Score"]) || 0,
						acceptanceRate:
							parseFloat(item["Acceptance Rate"]) || 0,
						courseUrl: item["Course URL"],
					};

					// Validate with Zod
					return CourseZodSchema.parse(rawCourse);
				});

				const operations = mappedCourses.map((course) => ({
					updateOne: {
						filter: { courseId: course.courseId },
						update: { $set: course },
						upsert: true,
					},
				}));

				await Course.bulkWrite(operations);

				const keys = await redisClient.keys("courses:*");
				if (keys && keys.length > 0) {
					await redisClient.del(...keys);
				}

				if (req.file) fs.unlinkSync(req.file.path);
				res.status(200).json({
					message: "Courses uploaded successfully",
					count: mappedCourses.length,
				});
			} catch (error: any) {
				console.error(error);
				if (req.file) fs.unlinkSync(req.file.path);
				res.status(500).json({
					message: "Error processing CSV",
					error: error.message,
				});
			}
		});
};

export const searchCourses = async (req: Request, res: Response) => {
	const { q, category, instructor, level } = req.query;
	const cacheKey = `courses:search:${JSON.stringify(req.query)}`;

	try {
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			return res.status(200).json({ source: "cache", data: cachedData });
		}

		let query: any = {};
		if (q) {
			query.$text = { $search: q as string };
		}
		if (category) {
			query.category = new RegExp(category as string, "i");
		}
		if (instructor) {
			query.instructor = new RegExp(instructor as string, "i");
		}
		if (level) {
			query.courseLevel = new RegExp(level as string, "i");
		}

		const courses = await Course.find(query);

		await redisClient.set(cacheKey, JSON.stringify(courses), {
			ex: CACHE_EXPIRY,
		});

		res.status(200).json({ source: "database", data: courses });
	} catch (error: any) {
		res.status(500).json({
			message: "Error searching courses",
			error: error.message,
		});
	}
};

export const getCourseById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const cacheKey = `courses:${id}`;

	try {
		const cachedData = await redisClient.get(cacheKey);
		if (cachedData) {
			return res.status(200).json({ source: "cache", data: cachedData });
		}

		const course = await Course.findOne({ courseId: id });
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		await redisClient.set(cacheKey, JSON.stringify(course), {
			ex: CACHE_EXPIRY,
		});

		res.status(200).json({ source: "database", data: course });
	} catch (error: any) {
		res.status(500).json({
			message: "Error fetching course",
			error: error.message,
		});
	}
};
