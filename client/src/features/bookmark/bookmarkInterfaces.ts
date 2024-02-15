import { IUser, TweetsAndReplies } from "../auth/authInterfaces";
import { IReply } from "../tweet/interfaces/replyInterface";
import { ITweet } from "../tweet/interfaces/tweetInterface";

export interface IBookmarkTweet {
    _id: string;
    user: string | IUser;
    tweet: string | ITweet;
    createdAt: Date;
    updatedAt: Date; 
}

export interface IBookmarkReply {
    _id: string;
    user: string | IUser;
    reply: string | IReply;
    createdAt: Date;
    updatedAt: Date;
}

export type BookmarkTweetsAndReplies = IBookmarkTweet | IBookmarkReply;

export interface BookmarkState {
    bookmarks: TweetsAndReplies[];
    loadingBookmarkTweet: {
        tweetId: string;
        active: boolean;
    };
    loadingBookmarkReply: {
        replyId: string;
        active: boolean;
    };
    loadingBookmarkAll: boolean;
    loadingBookmarkClear: boolean;
    successBookmark: boolean;
    errorBookmark: boolean;
    messageBookmark: string;
}