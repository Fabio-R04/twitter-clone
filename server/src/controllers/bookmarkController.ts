import { Request, Response } from "express";
import BookmarkTweetM, { BookmarkReplyM, IBookmarkReply, IBookmarkTweet } from "../models/bookmarkModel";
import { IUser } from "../models/authModel";
import TweetM, { ITweet } from "../models/tweet/tweetModel";
import ReplyM, { IReply } from "../models/tweet/replyModel";

//@ts-nocheck

// GET
export const getBookmarks = async (req: Request, res: Response): Promise<void> => {
    type TweetsAndReplies = ITweet | IReply;
    const user: IUser = req.user;

    try {
        const tweetBookmarks: IBookmarkTweet[] = await BookmarkTweetM.find({
            user: user._id
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
        const replyBookmarks: IBookmarkReply[] = await BookmarkReplyM.find({
            user: user._id
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

        const tweets: ITweet[] = tweetBookmarks.map((bookmark: IBookmarkTweet) => {
            return {
                ...bookmark.tweet._doc,
                originalCreatedAt: bookmark.tweet.createdAt,
                createdAt: bookmark.createdAt
            }
        });
        const replies: IReply[] = replyBookmarks.map((bookmark: IBookmarkReply) => {
            return {
                ...bookmark.reply._doc,
                originalCreatedAt: bookmark.reply.createdAt,
                createdAt: bookmark.createdAt
            }
        });

        const merged: TweetsAndReplies[] = [...tweets, ...replies].sort((a, b) => {
            return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
        });

        res.status(200).json(merged);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch bookmarks."
        });
    }
}

// POST
export const bookmarkTweet = async (req: Request, res: Response): Promise<void> => {
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

        const alreadyBookmarked = await BookmarkTweetM.findOne({
            user: user._id,
            tweet: tweet._id
        });

        if (alreadyBookmarked) {
            const updatedBookmarks: string[] = (tweet.bookmarks as string[]).filter((bookmarkId: string) => {
                if (bookmarkId.toString() !== alreadyBookmarked._id.toString()) {
                    return bookmarkId;
                }
            });
            tweet.bookmarks = updatedBookmarks;
            await BookmarkTweetM.deleteOne({ _id: alreadyBookmarked._id });

            await tweet.save();
            res.status(200).json({
                message: "DELETED",
                tweetId: tweet._id,
                bookmarkId: alreadyBookmarked._id
            });
        } else {
            const newBookmark: IBookmarkTweet = await BookmarkTweetM.create({
                user: user._id,
                tweet: tweet._id
            });
            tweet.bookmarks.push(newBookmark._id);

            await tweet.save();
            await newBookmark.populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
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
                }
            ]);

            res.status(200).json({
                message: "ADDED",
                tweetId: tweet._id,
                newBookmark
            });
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to bookmark tweet."
        });
    }
}

export const bookmarkReply = async (req: Request, res: Response): Promise<void> => {
    const replyId: string = req.params.replyId;
    const user: IUser = req.user;

    try {
        const reply: IReply | null = await ReplyM.findById(replyId);

        if (!reply) {
            res.status(400).json({
                error: "Reply no longer exists"
            });
            return;
        }

        const alreadyBookmarked = await BookmarkReplyM.findOne({
            user: user._id,
            reply: reply._id
        });

        if (alreadyBookmarked) {
            const updatedBookmarks: string[] = (reply.bookmarks as string[]).filter((bookmarkId: string) => {
                if (bookmarkId.toString() !== alreadyBookmarked._id.toString()) {
                    return bookmarkId;
                }
            });
            reply.bookmarks = updatedBookmarks;
            await BookmarkReplyM.deleteOne({ _id: alreadyBookmarked._id });

            await reply.save();
            res.status(200).json({
                message: "DELETED",
                replyId,
                bookmarkId: alreadyBookmarked._id
            });
        } else {
            const newBookmark: IBookmarkReply = await BookmarkReplyM.create({
                user: user._id,
                reply: reply._id
            });
            reply.bookmarks.push(newBookmark._id);

            await reply.save();
            await newBookmark.populate([
                {
                    path: "user",
                    model: "User",
                    select: "-password"
                },
                {
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
                        }
                    ]
                }
            ]);

            res.status(200).json({
                message: "ADDED",
                replyId: reply._id,
                newBookmark
            });
        }
    } catch (error) {
        res.status(400).json({
            error: "Failed to bookmark reply."
        });
    }
}

// DELETE
export const clearBookmarks = async (req: Request, res: Response): Promise<void> => {
    const user: IUser = req.user;

    try {
        await BookmarkTweetM.deleteMany({ user: user._id });
        await BookmarkReplyM.deleteMany({ user: user._id });

        res.status(200).json({
            success: "Bookmarks cleared."
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to clear bookmarks."
        });        
    }
}