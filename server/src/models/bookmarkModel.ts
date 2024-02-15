import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./authModel";
import { ITweet } from "./tweet/tweetModel";
import { IReply } from "./tweet/replyModel";

export interface IBookmarkTweet extends Document {
    user: string | IUser;
    tweet: ITweet;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBookmarkReply extends Document {
    user: string | IUser;
    reply: IReply;
    createdAt: Date;
    updatedAt: Date;
}

const bookmarkTweetSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: false },
}, {
    timestamps: true
});

const bookmarkReplySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: Schema.Types.ObjectId, ref: "Reply", required: false },
}, {
    timestamps: true
});

export const BookmarkReplyM = mongoose.model<IBookmarkReply>("BookmarkReply", bookmarkReplySchema);
export default mongoose.model<IBookmarkTweet>("BookmarkTweet", bookmarkTweetSchema);