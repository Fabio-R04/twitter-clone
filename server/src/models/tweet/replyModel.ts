import mongoose, { Schema, Document } from "mongoose";
import { ITweet } from "./tweetModel";
import { IBookmarkReply } from "../bookmarkModel";

export interface IReply extends Omit<ITweet, "bookmarks"> {
    bookmarks: string[] | IBookmarkReply[];
    mainTweet: string | ITweet;
    parentReply: string | IReply;
    surfaceLevel: boolean;
}

const replySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false },
    file: {
        type: {
            present: Boolean,
            data: String
        }, _id: false, required: false, default: { present: false, data: "" }
    },
    replies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Reply",
            _id: false
        }], required: false, default: []
    },
    retweets: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "RetweetReply",
            _id: false
        }], required: false, default: []
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "LikeReply",
            _id: false
        }], required: false, default: []
    },
    bookmarks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "BookmarkReply",
            _id: false
        }], required: false, default: []
    },
    mainTweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
    parentReply: { type: Schema.Types.ObjectId, ref: "Reply", required: false },
    surfaceLevel: { type: Boolean, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IReply>("Reply", replySchema);