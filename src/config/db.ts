import mongoose from "mongoose";
import { config } from "./env";


export async function connect_db() {
    mongoose.set("strictQuery", true)
    await mongoose.connect(config.mongoUri);
}