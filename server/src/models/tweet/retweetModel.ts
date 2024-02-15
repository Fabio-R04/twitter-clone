import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../authModel";
import { ITweet } from "./tweetModel";
import { IReply } from "./replyModel";

export interface IRetweetPost extends Document {
    user: string | IUser;
    tweet: string | ITweet;
    createdAt: Date;
    UpdatedAt: Date;
}

export interface IRetweetReply extends Document {
    user: string | IUser;
    reply: string | IReply;
    createdAt: Date;
    updatedAt: Date;
}

const retweetPostSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: false },
}, {
    timestamps: true
});

const retweetReplySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: Schema.Types.ObjectId, ref: "Reply", required: false }
}, {
    timestamps: true
});

export const RetweetReplyM = mongoose.model<IRetweetReply>("RetweetReply", retweetReplySchema);
export default mongoose.model<IRetweetPost>("RetweetPost", retweetPostSchema);