import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../authModel";
import Reply, { IReply } from "./replyModel";
import RetweetPost, { IRetweetPost } from "./retweetModel";
import LikeTweet, { ILikeTweet } from "./likeModel";
import BookmarkTweet, { IBookmarkTweet } from "../bookmarkModel";

export interface ITweet {
    _id: string;
    user: string | IUser;
    content: string;
    file: {
        present: boolean;
        data: string;
    };
    replies: string[] | IReply[];
    retweets: string[] | IRetweetPost[];
    likes: string[] | ILikeTweet[];
    bookmarks: string[] | IBookmarkTweet[];
    retweeted?: boolean;
    originalCreatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    populate: any;
    save: any;
    _doc: any;
}

const tweetSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: false, default: "" },
    file: { type: {
        present: Boolean,
        data: String
    }, _id: false, required: false, default: { present: false, data: "" } },
    replies: { type: [{
        type: Schema.Types.ObjectId,
        ref: Reply,
        _id: false
    }], required: false, default: [] },
    retweets: { type: [{
        type: Schema.Types.ObjectId,
        ref: RetweetPost,
        _id: false
    }], required: false, default: [] },
    likes: { type: [{
        type: Schema.Types.ObjectId,
        ref: LikeTweet,
        _id: false
    }], required: false, default: [] },
    bookmarks: { type: [{
        type: Schema.Types.ObjectId,
        ref: BookmarkTweet,
        _id: false
    }], required: false, default: [] }
}, {
    timestamps: true
});

export default mongoose.model<ITweet>("Tweet", tweetSchema);