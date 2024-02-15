import { IUser } from "../../auth/authInterfaces";
import { IBookmarkTweet } from "../../bookmark/bookmarkInterfaces";
import { ILikeReply, ILikeTweet } from "./likeInterface";
import { IReply } from "./replyInterface";
import { IRetweetPost, IRetweetReply } from "./retweetInterface";

export interface ITweet {
    _id: string;
    user: IUser;
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
}

export interface HomeTweetsPayload {
    forYouTweets: ITweet[];
    followingTweets: ITweet[];
}

export interface TweetState {
    tweetDetails: ITweet | null;
    engagements: {
        retweets: IRetweetPost[] | IRetweetReply[];
        likes: ILikeTweet[] | ILikeReply[];
    };
    forYouTweets: ITweet[];
    followingTweets: ITweet[];
    currentPageForYou: number;
    currentPageFollowing: number;
    loadingTweetCreate: boolean;
    loadingTweetHome: boolean;
    loadingTweetLike: {
        tweetId: string;
        active: boolean;
    };
    loadingTweetRetweetP: {
        tweetId: string;
        active: boolean;
    };
    loadingTweetDelete: boolean;
    loadingTweetRetweets: boolean;
    loadingTweetLikes: boolean;
    loadingTweetDetails: boolean;
    successTweet: boolean;
    errorTweet: boolean;
    messageTweet: string;
}