import mongoose, { Schema, Document } from "mongoose";
import { ICourse } from "../schemas/courseSchema.js";

export interface ICourseDocument extends ICourse, Document {}

const courseSchema = new Schema<ICourseDocument>(
	{
		courseId: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		courseCode: String,
		universityCode: String,
		universityName: String,
		department: String,
		category: String,
		specialization: String,
		courseLevel: String,
		description: String,
		summary: String,
		prerequisites: [String],
		learningOutcomes: [String],
		teachingMethodology: String,
		assessmentMethods: [String],
		credits: Number,
		duration: Number,
		language: String,
		syllabusUrl: String,
		keywords: [String],
		instructor: String,
		instructorEmail: String,
		officeLocation: String,
		intake: String,
		admissionOpenYears: String,
		attendanceType: String,
		tuitionFeeFirstYear: Number,
		tuitionFeeTotal: Number,
		currency: String,
		applicationFee: Number,
		applicationFeeCurrency: String,
		applicationFeeWaived: Boolean,
		requiredMaterials: String,
		minIELTS: Number,
		minTOEFL: Number,
		minPTE: Number,
		minDuolingo: Number,
		minCambridge: Number,
		greRequired: Boolean,
		greScore: Number,
		gmatRequired: Boolean,
		gmatScore: Number,
		satRequired: Boolean,
		satScore: Number,
		actRequired: Boolean,
		actScore: Number,
		acceptanceRate: Number,
		courseUrl: String,
	},
	{ timestamps: true },
);

courseSchema.index({
	title: "text",
	description: "text",
	category: "text",
	instructor: "text",
});

export const Course = mongoose.model<ICourseDocument>("Course", courseSchema);
