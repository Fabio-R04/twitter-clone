import { IUser } from "../../auth/authInterfaces";
import { IReply } from "./replyInterface";
import { ITweet } from "./tweetInterface";

export interface ILikeTweet {
    _id: string;
    tweet: string | ITweet;
    user: string | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILikeReply {
    _id: string;
    reply: string | IReply;
    user: string | IUser;
    createdAt: Date;
    updatedAt: Date;
}