import axios from "axios";
import { URL, getConfig } from "../../reusable";
import { IReply } from "../tweet/interfaces/replyInterface";
import { ILikeReply } from "../tweet/interfaces/likeInterface";
import { IRetweetReply } from "../tweet/interfaces/retweetInterface";
import { ReplyData } from "../../pages/Reply";

// GET
const getReplyDetails = async (replyId: string, token: string | null): Promise<IReply> => {
    const response = await axios.get(
        `${URL}/reply/details/${replyId}`,
        getConfig(token)
    );
    return response.data;
}

// POST
const createReply = async (data: ReplyData, token: string | null): Promise<IReply> => {
    const { mainTweet, parentReply, content, surfaceLevel, file } = data;

    const formData: FormData = new FormData();
    if (mainTweet) formData.append("mainTweet", mainTweet);
    if (parentReply) formData.append("parentReply", parentReply);
    if (content) formData.append("content", content);
    if (surfaceLevel !== undefined) formData.append("surfaceLevel", surfaceLevel.toString());
    if (file) formData.append("file", file);

    const response = await axios.post(
        `${URL}/reply/create`,
        formData,
        getConfig(token)
    );

    return response.data;
}

const createReplyR = async (data: ReplyData, token: string | null): Promise<{
    type?: string;
    parentReplyId: string;
    newReply: IReply;
}> => {
    const { type, mainTweet, parentReply, content, surfaceLevel, file } = data;

    const formData: FormData = new FormData();
    if (type) formData.append("type", type);
    if (mainTweet) formData.append("mainTweet", mainTweet);
    if (parentReply) formData.append("parentReply", parentReply);
    if (content) formData.append("content", content);
    if (surfaceLevel !== undefined) formData.append("surfaceLevel", surfaceLevel.toString());
    if (file) formData.append("file", file);

    const response = await axios.post(
        `${URL}/reply/create-r`,
        formData,
        getConfig(token)
    );

    return response.data;
}

// PUT
const likeReply = async (replyId: string, token: string | null): Promise<{
    replyId: string;
    likes: ILikeReply[];
}> => {
    const response = await axios.put(
        `${URL}/reply/like/${replyId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

const retweetReply = async (replyId: string, token: string | null): Promise<{
    replyId: string;
    retweets: IRetweetReply[];
}> => {
    const response = await axios.put(
        `${URL}/reply/retweet/${replyId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

// DELETE
const deleteReply = async (replyId: string, token: string | null): Promise<{ replyId: string; }> => {
    const response = await axios.delete(
        `${URL}/reply/delete/${replyId}`,
        getConfig(token)
    );
    return response.data;
}

const replyService = {
    createReply,
    likeReply,
    retweetReply,
    deleteReply,
    getReplyDetails,
    createReplyR
}

export default replyService;