import { Express, Request, Response } from "express";
import UserM, { IGoogleUser, IUser } from "../models/authModel";
import TweetM, { ITweet } from "../models/tweet/tweetModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { unlinkAsync } from "./tweetController";
import path from "path";
import ReplyM, { IReply } from "../models/tweet/replyModel";
import LikeM, { ILikeReply, ILikeTweet, LikeReplyM } from "../models/tweet/likeModel";
import RetweetM, { IRetweetPost, IRetweetReply, RetweetReplyM } from "../models/tweet/retweetModel";

//@ts-nocheck

// REUSABLE
const genToken = (id: string): string => {
    const jwtSecret: string = `${process.env.JWT_SECRET}`;
    return jwt.sign({ id }, jwtSecret, { expiresIn: "24h" });
}

// GET
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.userId;

    try {
        const userDetails: IUser | null = await UserM.findById(userId)
            .populate([
                {
                    path: "followers",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "following",
                    model: "User",
                    select: "-password"
                }
            ]);

        if (!userDetails) {
            res.status(400).json({
                error: "User no longer exists."
            });
            return;
        }

        res.status(200).json(userDetails);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Failed to fetch user details."
        });
    }
}

export const getUserTweets = async (req: Request, res: Response): Promise<void> => {
    type TweetAndReplies = ITweet | IReply;
    const userId: string = req.params.userId;

    try {
        const tweets: ITweet[] = await TweetM.find({ user: userId })
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "retweets",
                    model: "RetweetPost",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "likes",
                    model: "LikeTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "bookmarks",
                    model: "BookmarkTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                }
            ])
            .sort({ createdAt: -1 });

        const retweets: IRetweetPost[] = await RetweetM.find({ user: userId })
            .populate({
                path: "tweet",
                model: "Tweet",
                populate: [
                    {
                        path: "user",
                        model: "User",
                        select: "-password"
                    },
                    {
                        path: "retweets",
                        model: "RetweetPost",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "likes",
                        model: "LikeTweet",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "bookmarks",
                        model: "BookmarkTweet",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });
        
        const replies: IRetweetReply[] = await RetweetReplyM.find({ user: userId })
            .populate({
                path: "reply",
                model: "Reply",
                populate: [
                    {
                        path: "user",
                        model: "User",
                        select: "-password"
                    },
                    {
                        path: "retweets",
                        model: "RetweetReply",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "likes",
                        model: "LikeReply",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "bookmarks",
                        model: "BookmarkReply",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "mainTweet",
                        model: "Tweet",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    },
                    {
                        path: "parentReply",
                        model: "Reply",
                        populate: {
                            path: "user",
                            model: "User",
                            select: "-password"
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });
        
        const retweetedTweets = retweets.map((retweet: IRetweetPost) => {
            const tweet: ITweet = (retweet.tweet as ITweet);

            return {
                ...tweet._doc,
                originalCreatedAt: tweet.createdAt,
                createdAt: retweet.createdAt,
                retweeted: true
            }
        });

        const retweetedReplies = replies.map((retweet: IRetweetReply) => {
            const reply: IReply = (retweet.reply as IReply);
            
            return {
                ...reply._doc,
                originalCreatedAt: reply.createdAt,
                createdAt: retweet.createdAt,
                retweeted: true
            }
        });

        const merged: TweetAndReplies[] = ([...tweets, ...retweetedTweets, ...retweetedReplies] as TweetAndReplies[]).sort((a, b) => {
            return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
        });
        
        res.status(200).json(merged);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch user tweets."
        });
    }
}

export const getUserTweetsAndReplies = async (req: Request, res: Response): Promise<void> => {
    type TweetsAndReplies = ITweet | IReply;
    const userId: string = req.params.userId;

    try {
        const tweets: ITweet[] = await TweetM.find({ user: userId })
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "retweets",
                    model: "RetweetPost",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "likes",
                    model: "LikeTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "bookmarks",
                    model: "BookmarkTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                }
            ])
            .sort({ createdAt: -1 });

        const replies: IReply[] = await ReplyM.find({ user: userId })
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "mainTweet",
                    model: "Tweet",
                    populate: [
                        {
                            path: "user",
                            model: "User",
                            select: "-password"
                        },
                        {
                            path: "likes",
                            model: "LikeTweet",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        },
                        {
                            path: "retweets",
                            model: "RetweetPost",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        },
                        {
                            path: "bookmarks",
                            model: "BookmarkTweet",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        }
                    ]
                },
                {
                    path: "parentReply",
                    model: "Reply",
                    populate: [
                        {
                            path: "user",
                            model: "User",
                            select: "-password"
                        },
                        {
                            path: "likes",
                            model: "LikeReply",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        },
                        {
                            path: "retweets",
                            model: "RetweetReply",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        },
                        {
                            path: "bookmarks",
                            model: "BookmarkReply",
                            populate: {
                                path: "user",
                                model: "User",
                                select: "-password"
                            }
                        }
                    ]
                },
                {
                    path: "retweets",
                    model: "RetweetReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "likes",
                    model: "LikeReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "bookmarks",
                    model: "BookmarkReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                }
            ])
            .sort({ createdAt: -1 });

        const tweetsAndReplies: TweetsAndReplies[] = [...tweets, ...replies].sort((a, b) => {
            return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
        })

        res.status(200).json(tweetsAndReplies);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch tweets and replies."
        });
    }
}

export const getUserMedia = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.params.userId;

    try {
        const media: ITweet[] = await TweetM.find({
            user: userId,
            "file.present": true
        }).populate([
            {
                path: "user",
                model: "User",
                select: "-password"
            },
            {
                path: "retweets",
                model: "RetweetPost",
                populate: {
                    path: "user",
                    model: "User",
                    select: "-password"
                }
            },
            {
                path: "likes",
                model: "LikeTweet",
                populate: {
                    path: "user",
                    model: "User",
                    select: "-password"
                }
            },
            {
                path: "bookmarks",
                model: "BookmarkTweet",
                populate: {
                    path: "user",
                    model: "User",
                    select: "-password"
                }
            }
        ])
            .sort({ createdAt: -1 });

        res.status(200).json(media);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch media."
        });
    }
}

export const getUserLikes = async (req: Request, res: Response): Promise<void> => {
    type TweetsAndReplies = ITweet | IReply;
    const userId: string = req.params.userId;

    try {
        const likesT: ILikeTweet[] = await LikeM.find({
            user: userId
        }).populate({
            path: "tweet",
            model: "Tweet",
            populate: [
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "retweets",
                    model: "RetweetPost",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "likes",
                    model: "LikeTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "bookmarks",
                    model: "BookmarkTweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                }
            ]
        }).sort({ createdAt: -1 });

        const likesR: ILikeReply[] = await LikeReplyM.find({
            user: userId
        }).populate({
            path: "reply",
            model: "Reply",
            populate: [
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "retweets",
                    model: "RetweetReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "likes",
                    model: "LikeReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "bookmarks",
                    model: "BookmarkReply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "mainTweet",
                    model: "Tweet",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                },
                {
                    path: "parentReply",
                    model: "Reply",
                    populate: {
                        path: "user",
                        model: "User",
                        select: "-password"
                    }
                }
            ]
        }).sort({ createdAt: -1 });

        const likedTweets = likesT.map((like: ILikeTweet) => {
            const tweet: ITweet = (like.tweet as ITweet);

            return {
                ...tweet._doc,
                originalCreatedAt: tweet.createdAt,
                createdAt: like.createdAt
            }
        });
        const likedReplies = likesR.map((like: ILikeReply) => {
            const reply: IReply = (like.reply as IReply);

            return {
                ...reply._doc,
                originalCreatedAt: reply.createdAt,
                createdAt: like.createdAt
            }
        });
        const merged: TweetsAndReplies[] = [...likedTweets, ...likedReplies].sort((a, b) => {
            return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(); 
        });

        res.status(200).json(merged);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch liked tweets."
        });
    }
}

export const getSuggestedUsers = async (req: Request, res: Response): Promise<void> => {
    const user: IUser = req.user;
    const limit: number = parseInt(req.params.limit);

    if (limit === undefined) {
        res.status(400).json({
            error: "Limit must be a valid number."
        });
        return;
    }

    try {
        const suggested: IUser[] = await UserM.find({
            _id: { $ne: user._id },
            followers: { $nin: [user._id] }
        }).limit(limit);

        res.status(200).json(suggested);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch suggested users."
        });
    }
}

// POST
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        res.status(400).json({
            error: "Don't leave empty fields."
        });
        return;
    }

    const usernameExists = await UserM.exists({ username });
    if (usernameExists) {
        res.status(400).json({
            error: `Username '${username}', already exists.`
        });
        return;
    }

    const emailExists = await UserM.exists({ email });
    if (emailExists) {
        res.status(400).json({
            error: `Email '${email}', already exists.`
        });
        return;
    }

    try {
        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const newUser: IUser = await UserM.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            bio: newUser.bio,
            location: newUser.location,
            website: newUser.website,
            hasPFP: newUser.hasPFP,
            hasBG: newUser.hasBG,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            token: genToken(newUser._id)
        });
    } catch (error) {
        res.status(400).json({
            error: "Registration failed."
        });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            error: "Don't leave empty fields."
        });
        return;
    }

    try {
        const user: IUser | null = await UserM.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                location: user.location,
                website: user.website,
                hasPFP: user.hasPFP,
                hasBG: user.hasBG,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                token: genToken(user._id)
            });
        } else {
            res.status(400).json({
                error: "Email or Password incorrect."
            });
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to login."
        });
    }
}

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { googleAccessToken } = req.body;

    if (!googleAccessToken) {
        res.status(400).json({
            error: "Google accesss token not found."
        });
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        }

        const response = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            config
        );

        const userInfo: IGoogleUser = response.data;
        if (userInfo) {
            const user: IUser | null = await UserM.findOne({ email: userInfo.email });
            if (user) {
                res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    hasPFP: user.hasPFP,
                    hasBG: user.hasBG,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    token: genToken(user._id)
                });
                return;
            }

            const newUser: IUser = await UserM.create({
                name: userInfo.given_name,
                username: userInfo.email.split('@')[0].toLowerCase(),
                email: userInfo.email.toLowerCase(),
                hasPFP: {
                    present: true,
                    image: userInfo.picture
                }
            });

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                bio: newUser.bio,
                location: newUser.location,
                website: newUser.website,
                hasPFP: newUser.hasPFP,
                hasBG: newUser.hasBG,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
                token: genToken(newUser._id)
            });
        } else {
            res.status(400).json({
                error: "Failed to get user information."
            });
        }
    } catch (error) {
        res.status(400).json({
            error: "Google authentication failed."
        });
    }
}

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    const limit: number = parseInt(req.params.limit);
    const query: string = req.body.query;

    if (!limit || isNaN(limit)) {
        res.status(400).json({
            error: "Limit must be a valid number."
        });
        return;
    }

    if (query.trim() === "") {
        res.status(200).json([]);
        return;
    }

    try {
        const results: IUser[] = await UserM.find({
            $or: [
                {
                    username: {
                        $regex: new RegExp(query, "i")
                    }
                },
                {
                    name: {
                        $regex: new RegExp(query, "i")
                    }
                }
            ]
        }).limit(limit);

        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Failed to fetch user results."
        });
    }
}

// PUT
export const follow = async (req: Request, res: Response): Promise<void> => {
    const targetUserId: string = req.params.targetUserId;
    const user: IUser = req.user;

    try {
        const targetUser: IUser | null = await UserM.findById(targetUserId);

        if (!targetUser) {
            res.status(400).json({
                error: "User doesn't exist."
            });
            return;
        }

        if (targetUser._id.toString() === user._id.toString()) {
            res.status(400).json({
                error: "Can't follow yourself."
            });
            return;
        }

        let alreadyFollowing: string | undefined = (targetUser.followersLookup[user._id] as string);

        if (alreadyFollowing) {
            const updatedFollowing: string[] = (user.following as string[]).filter((userId: string) => {
                if (userId.toString() !== targetUser._id.toString()) {
                    return userId;
                }
            });
            const updatedFollowers: string[] = (targetUser.followers as string[]).filter((userId: string) => {
                if (userId.toString() !== user._id.toString()) {
                    return userId;
                }
            });

            user.following = updatedFollowing;
            targetUser.followers = updatedFollowers;
            delete user.followingLookup[targetUser._id];
            delete targetUser.followersLookup[user._id];
        } else {
            user.following.push(targetUser._id);
            targetUser.followers.push(user._id);
            user.followingLookup[targetUser._id] = targetUser._id;
            targetUser.followersLookup[user._id] = user._id;
        }

        user.markModified("followingLookup");
        targetUser.markModified("followersLookup");
        await user.save();
        await targetUser.save();

        res.status(200).json({
            message: alreadyFollowing ? "UNFOLLOWED" : "FOLLOWED",
            targetUserId: targetUser._id,
            mainUserId: user._id
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to follow user."
        });
    }
}

export const editProfile = async (req: Request, res: Response): Promise<void> => {
    const { removeBG, fileBGName, filePFPName, name, bio, location, website } = req.body;

    if (removeBG === undefined) {
        res.status(400).json({
            error: "Remove background field is required."
        });
        return;
    }

    if (req.files) {
        const files: Express.Multer.File[] = (req.files as unknown as Express.Multer.File[]);
        files.forEach((file: Express.Multer.File) => {
            if (file.size > 20971520) {
                res.status(400).json({
                    error: `'${file.originalname}', exceeded file size limit (20MB).`
                });
                return;
            }
        });
    }

    try {
        const user: IUser = req.user;
        if (JSON.parse(removeBG) && user.hasBG.present) {
            await unlinkAsync(path.resolve(__dirname, "..", "..", "public", "uploads", user.hasBG.image));
            user.hasBG.present = false;
            user.hasBG.image = "";
        } else {
            const backgroundPicture: Express.Multer.File | undefined = (req.files as Express.Multer.File[]).find((file) => {
                if (file.originalname === fileBGName) {
                    return file;
                }
            });

            if (backgroundPicture) {
                if (user.hasBG.present) {
                    await unlinkAsync(path.resolve(__dirname, "..", "..", "public", "uploads", user.hasBG.image));
                }

                user.hasBG.present = true;
                user.hasBG.image = backgroundPicture.filename;
            }
        }

        const profilePicture: Express.Multer.File | undefined = (req.files as Express.Multer.File[]).find((file) => {
            if (file.originalname === filePFPName) {
                return file;
            }
        });

        if (profilePicture) {
            if (user.hasPFP.present) {
                await unlinkAsync(path.resolve(__dirname, "..", "..", "public", "uploads", user.hasPFP.image));
            }

            user.hasPFP.present = true;
            user.hasPFP.image = profilePicture.filename;
        }

        user.name = name ? name : user.name;
        user.bio = bio ? bio : user.bio;
        user.location = location ? location : user.location;
        user.website = website ? website : user.website;

        user.save();
        user.populate([
            {
                path: "following",
                model: "User",
                select: "-password"
            },
            {
                path: "followers",
                model: "User",
                select: "-password"
            }
        ]);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error: "Failed to edit profile."
        });
    }
}