import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

// Convert ESM import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to dev.db
process.env.DATABASE_URL = `file:${path.resolve(__dirname, "dev.db")}`;

export const prisma = new PrismaClient();
