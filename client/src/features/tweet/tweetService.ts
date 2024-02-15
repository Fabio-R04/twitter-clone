import axios from "axios";
import { URL, getConfig } from "../../reusable";
import { TweetData } from "../../pages/Home";
import { HomeTweetsPayload, ITweet } from "./interfaces/tweetInterface";
import { IUser } from "../auth/authInterfaces";
import { ILikeReply, ILikeTweet } from "./interfaces/likeInterface";
import { RetweetData } from "../../components/home/HomeTweet";
import { IRetweetPost, IRetweetReply } from "./interfaces/retweetInterface";
import { EngagementsData } from "../../pages/Engagements";

// GET
const getForYouTweets = async (page: number, token: string | null): Promise<ITweet[]> => {
    const response = await axios.get(
        `${URL}/tweet/home-foryou`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page
            }
        }
    );
    return response.data;
}

const getFollowingTweets = async (page: number, token: string | null): Promise<ITweet[]> => {
    const response = await axios.get(
        `${URL}/tweet/home-following`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page
            }
        }
    );
    return response.data;
}

const getTweetRetweets = async (data: EngagementsData, token: string | null): Promise<IRetweetPost[] | IRetweetReply[]> => {
    const response = await axios.get(
        `${URL}/tweet/engagements/retweet/${data.elementId}/${data.type}`,
        getConfig(token)
    );
    return response.data;
}

const getTweetLikes = async (data: EngagementsData, token: string | null): Promise<ILikeTweet[] | ILikeReply[]> => {
    const response = await axios.get(
        `${URL}/tweet/engagements/like/${data.elementId}/${data.type}`,
        getConfig(token)
    );
    return response.data;
}

const getTweetDetails = async (tweetId: string, token: string | null): Promise<ITweet> => {
    const response = await axios.get(
        `${URL}/tweet/details/${tweetId}`,
        getConfig(token)
    );
    return response.data;
}

// POST
const createTweet = async (data: TweetData, token: string | null): Promise<ITweet> => {
    const { content, file } = data;

    const formData: FormData = new FormData();
    if (content) formData.append("content", content);
    formData.append("file", file);

    const response = await axios.post(
        `${URL}/tweet/create`,
        formData,
        getConfig(token)
    );

    return response.data;
}

// PUT
const likeTweet = async (tweetId: string, token: string | null): Promise<{
    tweetId: string;
    likes: ILikeTweet[];
}> => {
    const response = await axios.put(
        `${URL}/tweet/like/${tweetId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

const retweetPost = async (tweetId: string, token: string | null): Promise<{
    tweetId: string;
    retweets: IRetweetPost[];
}> => {
    const response = await axios.put(
        `${URL}/tweet/retweet/${tweetId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

// DELETE
const deleteTweet = async (tweetId: string, token: string | null): Promise<{ tweetId: string; }> => {
    const response = await axios.delete(
        `${URL}/tweet/delete/${tweetId}`,
        getConfig(token)
    );
    return response.data;
}

const tweetService = {
    createTweet,
    getForYouTweets,
    getFollowingTweets,
    likeTweet,
    retweetPost,
    deleteTweet,
    getTweetRetweets,
    getTweetLikes,
    getTweetDetails
}

export default tweetService;