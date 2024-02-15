import express, { Router } from "express";
const router: Router = express.Router();

import {
    register,
    login,
    googleLogin,
    follow,
    getUserDetails,
    editProfile,
    getUserTweets,
    getUserTweetsAndReplies,
    getUserMedia,
    getUserLikes,
    searchUsers,
    getSuggestedUsers
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { upload } from "./tweetRoutes";

// GET
router.get("/details/:userId", authenticateToken, getUserDetails);
router.get("/user-tweets/:userId", authenticateToken, getUserTweets);
router.get("/user-tweets-replies/:userId", authenticateToken, getUserTweetsAndReplies);
router.get("/user-media/:userId", authenticateToken, getUserMedia);
router.get("/user-likes/:userId", authenticateToken, getUserLikes);
router.get("/user-suggested/:limit", authenticateToken, getSuggestedUsers);

// POST
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/search/:limit", authenticateToken, searchUsers);

// PUT
router.put("/follow/:targetUserId", authenticateToken, follow);
router.put("/edit-profile", authenticateToken, upload.array("files", 2), editProfile);

export default router;