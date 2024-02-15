import { Request, Response } from "express";
import TweetM, { ITweet } from "../models/tweet/tweetModel";
import LikeTweetM, { ILikeReply, ILikeTweet, LikeReplyM } from "../models/tweet/likeModel";
import ReplyM, { IReply } from "../models/tweet/replyModel";
import UserM, { IUser } from "../models/authModel";
import RetweetPostM, { IRetweetPost, IRetweetReply, RetweetReplyM } from "../models/tweet/retweetModel";
import BookmarkM from "../models/bookmarkModel";
import { promisify } from "util";
import fs from "fs";
import path from "path";

//@ts-nocheck

export const unlinkAsync = promisify(fs.unlink);

// GET
export const getForYouTweets = async (req: Request, res: Response): Promise<void> => {
    const user: IUser = req.user;
    const page: number = Number(req.query.page);
    const perPage: number = 20;

    if (!page) {
        res.status(400).json({
            error: "Page number not found."
        });
        return;
    }

    try {
        const forYouTweets: ITweet[] = await TweetM.find({
            $or: [
                { user: { $nin: user.following } },
                { user: user._id }
            ]
        })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
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
        ]);

        res.status(200).json(forYouTweets);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch home tweets."
        });
    }
}

export const getFollowingTweets = async (req: Request, res: Response): Promise<void> => {
    const user: IUser = req.user;
    const page: number = Number(req.query.page);
    const perPage: number = 20;

    if (!page) {
        res.status(400).json({
            error: "Page number not found."
        });
        return;
    }

    try {
        const followingTweets: ITweet[] = await TweetM.find({
            user: { $in: user.following }
        })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
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
        ]);

        res.status(200).json(followingTweets);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch home tweets."
        });
    }
}

export const getTweetRetweets = async (req: Request, res: Response): Promise<void> => {
    const elementId: string = req.params.elementId;
    const type: string = req.params.type;

    try {
        let retweets: IRetweetPost[] | IRetweetReply[] = [];

        switch (type) {
            case "tweet":
                retweets = await RetweetPostM.find({ tweet: elementId })
                    .populate({
                        path: "user",
                        model: "User",
                        select: "-password"
                    })
                    .sort({ createdAt: -1 });
                break;
            case "reply":
                retweets = await RetweetReplyM.find({ reply: elementId })
                    .populate({
                        path: "user",
                        model: "User",
                        select: "-password"
                    })
                    .sort({ createdAt: -1 });
                break;
            default:
                return;
        }

        res.status(200).json(retweets);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch retweets."
        });
    }
}

export const getTweetLikes = async (req: Request, res: Response): Promise<void> => {
    const elementId: string = req.params.elementId;
    const type: string = req.params.type;

    try {
        let likes: ILikeTweet[] | ILikeReply[] = [];

        switch (type) {
            case "tweet":
                likes = await LikeTweetM.find({ tweet: elementId })
                    .populate({
                        path: "user",
                        model: "User",
                        select: "-password"
                    })
                    .sort({ createdAt: -1 });
                break;
            case "reply":
                likes = await LikeReplyM.find({ reply: elementId })
                    .populate({
                        path: "user",
                        model: "User",
                        select: "-password"
                    })
                    .sort({ createdAt: -1 });
                break;
            default:
                return;
        }

        res.status(200).json(likes);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch likes."
        });
    }
}

export const getTweetDetails = async (req: Request, res: Response): Promise<void> => {
    const tweetId: string = req.params.tweetId;

    try {
        const tweetDetails: ITweet | null = await TweetM.findById(tweetId)
            .populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
                    path: "replies",
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
                        }
                    ]
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
            ]);

        if (!tweetDetails) {
            res.status(400).json({
                error: "Tweet no longer exists."
            });
            return;
        }

        res.status(200).json(tweetDetails);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch tweet details."
        });
    }
}

// POST
export const createTweet = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.user._id;
    const content: string = req.body.content;

    if (req.file) {
        if (req.file.size > 20971520) {
            res.status(400).json({ error: "This file exceeds size limit (20MB)" });
            return;
        }

        if (req.file.mimetype.includes("video")) {
            res.status(400).json({ error: "Videos are not allowed, please choose an image instead." });
            return;
        }
    }

    try {
        const newTweet: ITweet = await TweetM.create({
            user: userId,
            content: content ? content : "",
            ...(req.file && {
                file: {
                    present: true,
                    data: req.file.filename
                }
            })
        });

        await newTweet.populate([
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
            }
        ]);

        res.status(201).json(newTweet);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create tweet."
        });
    }
}

// PUT
export const likeTweet = async (req: Request, res: Response): Promise<void> => {
    const tweetId: string = req.params.tweetId;
    const sender: IUser = req.user;

    try {
        const tweet: ITweet | null = await TweetM.findById(tweetId);

        if (!tweet) {
            res.status(400).json({
                error: "Tweet no longer exists."
            });
            return;
        }

        const alreadyLiked = await LikeTweetM.findOne({
            tweet: tweet._id,
            user: sender._id
        });

        if (alreadyLiked) {
            const updatedLikes: string[] = (tweet.likes as string[]).filter((likeId: string) => {
                if (likeId.toString() !== alreadyLiked._id.toString()) {
                    return likeId;
                }
            });
            tweet.likes = updatedLikes;

            await LikeTweetM.deleteOne({ _id: alreadyLiked._id });
        } else {
            const newLike: ILikeTweet = await LikeTweetM.create({
                tweet: tweet._id,
                user: sender._id
            });
            tweet.likes.push(newLike._id);
        }

        await tweet.save();
        await tweet.populate({
            path: "likes",
            model: "LikeTweet",
            populate: {
                path: "user",
                model: "User",
                select: "-password"
            }
        });

        res.status(200).json({
            tweetId: tweet._id,
            likes: tweet.likes
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to like tweet."
        });
    }
}

export const retweetPost = async (req: Request, res: Response): Promise<void> => {
    const tweetId: string = req.params.tweetId;
    const user: IUser = req.user;

    try {
        const tweet: ITweet | null = await TweetM.findById(tweetId);

        if (!tweet) {
            res.status(400).json({
                error: "Tweet no longer exists."
            });
            return;
        }

        const alreadyRetweeted: IRetweetPost | null = await RetweetPostM.findOne({
            user: user._id,
            tweet: tweetId
        });

        if (alreadyRetweeted) {
            const updatedRetweets: string[] = (tweet.retweets as string[]).filter((retweetId: string) => {
                if (retweetId.toString() !== alreadyRetweeted._id.toString()) {
                    return retweetId;
                }
            });
            tweet.retweets = updatedRetweets;

            await RetweetPostM.deleteOne({ _id: alreadyRetweeted._id });
        } else {
            const newRetweet: IRetweetPost = await RetweetPostM.create({
                user: user._id,
                tweet: tweetId
            });
            tweet.retweets.push(newRetweet._id);
        }

        await tweet.save();
        await tweet.populate({
            path: "retweets",
            model: "RetweetPost",
            populate: {
                path: "user",
                model: "User",
                select: "-password"
            }
        });

        res.status(200).json({
            tweetId,
            retweets: tweet.retweets
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to retweet."
        });
    }
}

// DELETE
//@ts-ignore
export const deleteTweet = async (req: Request, res: Response): Promise<void> => {
    const tweetId: string = req.params.tweetId;

    try {
        const deletedTweet = await TweetM.findByIdAndDelete(tweetId);

        if (!deletedTweet) {
            res.status(400).json({
                error: "No longer exists."
            });
            return;
        }

        if (deletedTweet.file.present) {
            await unlinkAsync(path.resolve(__dirname, "..", "..", "public", "uploads", deletedTweet.file.data));
        }

        await RetweetPostM.deleteMany({
            tweet: deletedTweet._id
        });

        await LikeTweetM.deleteMany({
            tweet: deletedTweet._id
        });

        await ReplyM.deleteMany({
            mainTweet: deletedTweet._id
        });

        await BookmarkM.deleteMany({
            tweet: deletedTweet._id
        });

        res.status(200).json({ tweetId });
    } catch (error) {
        res.status(400).json({
            error: "Failed to delete tweet."
        });
    }
}