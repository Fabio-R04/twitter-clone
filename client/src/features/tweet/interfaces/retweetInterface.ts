import { IUser } from "../../auth/authInterfaces";
import { IReply } from "./replyInterface";
import { ITweet } from "./tweetInterface";

export interface IRetweetPost {
    _id: string;
    user: string | IUser;
    tweet: string | ITweet;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRetweetReply {
    _id: string;
    user: string | IUser;
    reply: string | IReply;
    createdAt: Date;
    updatedAt: Date;
}