import express, { Router } from "express";
const router: Router = express.Router();

import {
    bookmarkTweet,
    bookmarkReply,
    getBookmarks,
    clearBookmarks
} from "../controllers/bookmarkController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/all", authenticateToken, getBookmarks);

// POST
router.post("/tweet/:tweetId", authenticateToken, bookmarkTweet);
router.post("/reply/:replyId", authenticateToken, bookmarkReply);

// DELETE
router.delete("/all", authenticateToken, clearBookmarks);

export default router;