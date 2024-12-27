import path from 'path';
import dotenv from 'dotenv';


dotenv.config({
  path: path.join(__dirname, "../../", ".env"),
});

export const PORT: string | undefined = process.env.PORT;
export const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
export const JWT_KEY:string|undefined=process.env.JWT_KEY;
