import { IReply } from "../tweet/interfaces/replyInterface";
import { ITweet } from "../tweet/interfaces/tweetInterface";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    hasPFP: {
        present: boolean;
        image: string;
    };
    hasBG: {
        present: boolean;
        color: string;
        image: string;
    };
    followers: string[] | IUser[];
    following: string[] | IUser[];
    followersLookup: { [key: string]: string };
    followingLookup: { [key: string]: string };
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthUser extends Omit<IUser, "followers" | "following"> {
    token: string;
}

export type TweetsAndReplies = ITweet | IReply;

export interface AuthState {
    user: AuthUser | null;
    userDetails: IUser | null;
    userTweets: TweetsAndReplies[];
    userTweetsAndReplies: TweetsAndReplies[];
    userMedia: ITweet[];
    userLikes: TweetsAndReplies[];
    searchResults: IUser[];
    suggestedUsers: IUser[];
    loadingAuthUser: boolean;
    loadingAuthGoogle: boolean;
    loadingAuthFollow: {
        userId: string;
        active: boolean;
    };
    loadingAuthDetails: boolean;
    loadingAuthEdit: boolean;
    loadingAuthTweets: boolean;
    loadingAuthTweetsAndReplies: boolean;
    loadingAuthMedia: boolean;
    loadingAuthLikes: boolean;
    loadingAuthSearch: boolean;
    loadingAuthSuggested: boolean;
    successAuth: boolean;
    errorAuth: boolean;
    messageAuth: string;
}