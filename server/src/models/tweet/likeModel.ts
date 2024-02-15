import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../authModel";
import { ITweet } from "./tweetModel";
import { IReply } from "./replyModel";

export interface ILikeTweet extends Document {
    tweet: string | ITweet;
    user: string | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILikeReply extends Document {
    reply: string | IReply;
    user: string | IUser;
    createdAt: Date;
    updatedAt: Date;
}

const likeTweetSchema: Schema = new Schema({
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

const likeReplySchema: Schema = new Schema({
    reply: { type: Schema.Types.ObjectId, ref: "Reply", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

export const LikeReplyM = mongoose.model<ILikeReply>("LikeReply", likeReplySchema);
export default mongoose.model<ILikeTweet>("LikeTweet", likeTweetSchema);