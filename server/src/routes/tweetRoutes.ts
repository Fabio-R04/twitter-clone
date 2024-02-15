import express, { Router } from "express";
import multer from "multer";
import path from "path";
const router: Router = express.Router();

import { authenticateToken } from "../middleware/authMiddleware";
import {
    createTweet,
    likeTweet,
    retweetPost,
    deleteTweet,
    getTweetRetweets,
    getTweetLikes,
    getTweetDetails,
    getForYouTweets,
    getFollowingTweets
} from "../controllers/tweetController";

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "..", "public", "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload: multer.Multer = multer({ storage });

// GET
router.get("/home-foryou", authenticateToken, getForYouTweets);
router.get("/home-following", authenticateToken, getFollowingTweets);
router.get("/details/:tweetId", authenticateToken, getTweetDetails);
router.get("/engagements/retweet/:elementId/:type", authenticateToken, getTweetRetweets);
router.get("/engagements/like/:elementId/:type", authenticateToken, getTweetLikes);

// POST
router.post("/create", authenticateToken, upload.single("file"), createTweet);

// PUT
router.put("/like/:tweetId", authenticateToken, likeTweet);
router.put("/retweet/:tweetId", authenticateToken, retweetPost);

// DELETE
router.delete("/delete/:tweetId", authenticateToken, deleteTweet);

export default router;