import { IUser } from "../../auth/authInterfaces";
import { IBookmarkReply } from "../../bookmark/bookmarkInterfaces";
import { ILikeReply } from "./likeInterface";
import { IRetweetReply } from "./retweetInterface";
import { ITweet } from "./tweetInterface";

export interface IReply {
    _id: string;
    user: IUser;
    content: string;
    file: {
        present: boolean;
        data: string;
    };
    replies: string[] | IReply[];
    retweets: string[] | IRetweetReply[];
    likes: string[] | ILikeReply[];
    bookmarks: string[] | IBookmarkReply[];
    mainTweet: string | ITweet;
    parentReply: string | IReply;
    surfaceLevel: boolean;
    retweeted?: boolean;
    originalCreatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReplyState {
    replyDetails: IReply | null;
    loadingReplyCreate: boolean;
    loadingReplyLike: {
        replyId: string;
        active: boolean;
    };
    loadingReplyRetweet: {
        replyId: string;
        active: boolean;
    };
    loadingReplyDelete: boolean;
    loadingReplyDetails: boolean;
    successReply: boolean;
    errorReply: boolean;
    messageReply: string;
}