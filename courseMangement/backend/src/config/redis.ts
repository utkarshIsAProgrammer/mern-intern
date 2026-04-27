import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
	console.warn("Upstash Redis environment variables are missing");
}

export const client = new Redis({
	url: url || "",
	token: token || "",
});

export const connectRedis = async (): Promise<void> => {
	console.log("Upstash Redis Client Initialized");
};
