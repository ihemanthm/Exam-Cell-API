import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({
  path: path.join(__dirname, "../../", ".env"),
});

// Exporting the configuration values with type annotations
export const PORT: string | undefined = process.env.PORT;
export const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
