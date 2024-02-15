import { Request, Response } from "express";
import ReplyM, { IReply } from "../models/tweet/replyModel";
import { LikeReplyM, ILikeReply } from "../models/tweet/likeModel";
import { IUser } from "../models/authModel";
import TweetM, { ITweet } from "../models/tweet/tweetModel";
import { IRetweetReply, RetweetReplyM } from "../models/tweet/retweetModel";
import { unlinkAsync } from "./tweetController";
import path from "path";
import { BookmarkReplyM } from "../models/bookmarkModel";

// GET
export const getReplyDetails = async (req: Request, res: Response): Promise<void> => {
    const replyId: string = req.params.replyId;

    try {
        const replyDetails: IReply | null = await ReplyM.findById(replyId)
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
            ]);

        if (!replyDetails) {
            res.status(400).json({
                error: "Reply no longer exists."
            });
            return;
        }

        res.status(200).json(replyDetails);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch reply details."
        });
    }
}

// POST
export const createReply = async (req: Request, res: Response): Promise<void> => {
    const { mainTweet, parentReply, surfaceLevel, content } = req.body;
    const user: IUser = req.user;

    if (!req.file && ((content === undefined) || (content.trim().length < 1))) {
        res.status(400).json({
            error: "Description or file is required."
        });
        return;
    }

    if ((surfaceLevel === undefined) || (mainTweet === undefined)) {
        res.status(400).json({
            error: "Surface level and Main Tweet is required."
        });
        return;
    }

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
        const tweet: ITweet | null = await TweetM.findById(mainTweet);

        if (!tweet) {
            res.status(400).json({
                error: "Tweet no longer exists."
            });
            return;
        }

        const newReply: IReply = await ReplyM.create({
            user: user._id,
            content: content ? content : "",
            ...(req.file && {
                file: {
                    present: true,
                    data: req.file.filename
                }
            }),
            surfaceLevel: JSON.parse(surfaceLevel),
            mainTweet,
            ...(JSON.parse(surfaceLevel) && {
                parentReply: parentReply
            })
        });

        (tweet.replies as string[]).push(newReply._id);
        await tweet.save();

        await newReply.populate([
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
            }
        ]);

        res.status(201).json(newReply);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create reply."
        });
    }
}

export const createReplyR = async (req: Request, res: Response): Promise<void> => {
    const { type, mainTweet, parentReply, surfaceLevel, content } = req.body;
    const user: IUser = req.user;

    if (!req.file && ((content === undefined) || (content.trim().length < 1))) {
        res.status(400).json({
            error: "Description or file is required."
        });
        return;
    }

    if ((surfaceLevel === undefined) || (mainTweet === undefined)) {
        res.status(400).json({
            error: "Surface level or Main tweet required."
        });
        return;
    }

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
        const reply: IReply | null = await ReplyM.findById(parentReply);

        if (!reply) {
            res.status(400).json({
                error: "Reply no longer exists."
            });
            return;
        }

        const newReply: IReply = await ReplyM.create({
            user: user._id,
            content: content ? content : "",
            ...(req.file && {
                file: {
                    present: true,
                    data: req.file.filename
                }
            }),
            surfaceLevel: JSON.parse(surfaceLevel),
            mainTweet,
            parentReply: reply._id
        });

        (reply.replies as string[]).push(newReply._id);
        await reply.save();

        await newReply.populate([
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
            }
        ]);

        res.status(201).json({
            ...(type && { type }),
            parentReplyId: reply._id,
            newReply
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to create reply."
        });
    }
}

// PUT
export const likeReply = async (req: Request, res: Response): Promise<void> => {
    const replyId: string = req.params.replyId;
    const user: IUser = req.user;

    try {
        const reply: IReply | null = await ReplyM.findById(replyId);

        if (!reply) {
            res.status(400).json({
                error: "Reply no longer exists."
            });
            return;
        }

        const alreadyLiked: ILikeReply | null = await LikeReplyM.findOne({
            reply: reply._id,
            user: user._id
        });

        if (alreadyLiked) {
            const updatedLikes: string[] = (reply.likes as string[]).filter((likeId: string) => {
                if (likeId.toString() !== alreadyLiked._id.toString()) {
                    return likeId;
                }
            });
            reply.likes = updatedLikes;

            await LikeReplyM.deleteOne({
                _id: alreadyLiked._id
            });
        } else {
            const newLike: ILikeReply = await LikeReplyM.create({
                reply: reply._id,
                user: user._id
            });
            reply.likes.push(newLike._id);
        }

        await reply.save();
        await reply.populate({
            path: "likes",
            model: "LikeReply",
            populate: {
                path: "user",
                model: "User",
                select: "-password"
            }
        });

        res.status(200).json({
            replyId: reply._id,
            likes: reply.likes
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to like reply."
        });
    }
}

export const retweetReply = async (req: Request, res: Response): Promise<void> => {
    const replyId: string = req.params.replyId;
    const user: IUser = req.user;

    try {
        const reply: IReply | null = await ReplyM.findById(replyId);

        if (!reply) {
            res.status(400).json({
                error: "Reply no longer exists."
            });
            return;
        }

        const alreadyRetweeted: IRetweetReply | null = await RetweetReplyM.findOne({
            reply: reply._id,
            user: user._id
        });

        if (alreadyRetweeted) {
            const updatedRetweets: string[] = (reply.retweets as string[]).filter((retweetId: string) => {
                if (retweetId.toString() !== alreadyRetweeted._id.toString()) {
                    return retweetId;
                }
            });
            reply.retweets = updatedRetweets;

            await RetweetReplyM.deleteOne({
                _id: alreadyRetweeted._id
            });
        } else {
            const newRetweet: IRetweetReply = await RetweetReplyM.create({
                reply: reply._id,
                user: user._id
            });
            reply.retweets.push(newRetweet._id);
        }

        await reply.save();
        await reply.populate({
            path: "retweets",
            model: "RetweetReply",
            populate: {
                path: "user",
                model: "User",
                select: "-password"
            }
        });

        res.status(200).json({
            replyId: reply._id,
            retweets: reply.retweets
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to retweet reply."
        });
    }
}

// DELETE
export const deleteReply = async (req: Request, res: Response): Promise<void> => {
    const replyId: string = req.params.replyId;

    try {
        const replyDeleted = await ReplyM.findByIdAndDelete(replyId);

        if (!replyDeleted) {
            res.status(400).json({
                error: "No longer exists."
            });
            return;
        }

        let deletedReply = replyDeleted as unknown as IReply;

        if (deletedReply.file.present) {
            await unlinkAsync(path.resolve(__dirname, "..", "..", "public", "uploads", deletedReply.file.data));
        }

        if (deletedReply.surfaceLevel === true) {
            const tweet: ITweet | null = await TweetM.findById(deletedReply.mainTweet);
            if (tweet) {
                const updatedReplies: string[] = (tweet.replies as string[]).filter((replyId: string) => {
                    if (replyId.toString() !== deletedReply._id.toString()) {
                        return replyId;
                    }
                });
                tweet.replies = updatedReplies;
                await tweet.save();
            }
        } else if (deletedReply.surfaceLevel === false) {
            const reply: IReply | null = await ReplyM.findById(deletedReply.parentReply);
            if (reply) {
                const updatedReplies: string[] = (reply.replies as string[]).filter((replyId: string) => {
                    if (replyId.toString() !== deletedReply._id.toString()) {
                        return replyId;
                    }
                });
                reply.replies = updatedReplies;
                await reply.save();
            }
        }

        await ReplyM.deleteMany({
            parentReply: deletedReply._id
        });

        await RetweetReplyM.deleteMany({
            reply: deletedReply._id
        });

        await LikeReplyM.deleteMany({
            reply: deletedReply._id
        });

        await BookmarkReplyM.deleteMany({
            reply: deletedReply._id
        });

        res.status(200).json({ replyId });
    } catch (error) {
        res.status(400).json({
            error: "Failed to delete reply."
        });
    }
}