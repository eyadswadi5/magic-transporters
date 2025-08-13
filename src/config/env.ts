import dotenv from 'dotenv'

dotenv.config()
export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://eyad:123password123@127.0.0.1:27017/magic-transporters?authSource=admin",
};