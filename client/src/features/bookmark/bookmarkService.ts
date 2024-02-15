import axios from "axios";
import { URL, getConfig } from "../../reusable";
import { IBookmarkReply, IBookmarkTweet } from "./bookmarkInterfaces";
import { TweetsAndReplies } from "../auth/authInterfaces";

// GET
const getBookmarks = async (token: string | null): Promise<TweetsAndReplies[]> => {
    const response = await axios.get(
        `${URL}/bookmark/all`,
        getConfig(token)
    );
    return response.data;
}

// POST
const bookmarkTweet = async (tweetId: string, token: string | null): Promise<{
    message: string;
    tweetId: string;
    bookmarkId?: string;
    newBookmark?: IBookmarkTweet;
}> => {
    const response = await axios.post(
        `${URL}/bookmark/tweet/${tweetId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

const bookmarkReply = async (replyId: string, token: string | null): Promise<{
    message: string;
    replyId: string;
    bookmarkId?: string;
    newBookmark: IBookmarkReply;
}> => {
    const response = await axios.post(
        `${URL}/bookmark/reply/${replyId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

// DELETE
const clearBookmarks = async (token: string | null): Promise<{ success: string; }> => {
    const response = await axios.delete(
        `${URL}/bookmark/all`,
        getConfig(token)
    );
    return response.data;
}

const bookmarkService = {
    bookmarkTweet,
    bookmarkReply,
    getBookmarks,
    clearBookmarks
}
export default bookmarkService;