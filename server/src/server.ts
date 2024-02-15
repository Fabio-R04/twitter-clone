import { config } from "dotenv";
config();
import express, { Application } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
// Import Routes
import authRoutes from "./routes/authRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import replyRoutes from "./routes/replyRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";

const app: Application = express();
const clientURL: string = `${process.env.CLIENT_URL}`;
const corsOptions: CorsOptions = {
    credentials: true,
    origin: clientURL
}

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors(corsOptions));

// Routes Middleware
app.use("/auth", authRoutes);
app.use("/tweet", tweetRoutes);
app.use("/reply", replyRoutes);
app.use("/bookmark", bookmarkRoutes);

// Database Connection
const uri: string = `${process.env.MONGO_URI}`;
const port: number = Number(process.env.PORT);

(async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected!");
        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
})();