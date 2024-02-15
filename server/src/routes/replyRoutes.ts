import express, { Router } from "express";
import { upload } from "./tweetRoutes";
const router: Router = express.Router();

import {
    createReply,
    likeReply,
    retweetReply,
    deleteReply,
    getReplyDetails,
    createReplyR
} from "../controllers/replyController";
import { authenticateToken } from "../middleware/authMiddleware";

// GET
router.get("/details/:replyId", authenticateToken, getReplyDetails);

// POST
router.post("/create", authenticateToken, upload.single("file"), createReply);
router.post("/create-r", authenticateToken, upload.single("file"), createReplyR);

// PUT
router.put("/like/:replyId", authenticateToken, likeReply);
router.put("/retweet/:replyId", authenticateToken, retweetReply);

// DELETE
router.delete("/delete/:replyId", authenticateToken, deleteReply);

export default router;