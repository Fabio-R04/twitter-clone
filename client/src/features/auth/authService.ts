import axios from "axios";
import { URL, getConfig } from "../../reusable";
import { RegisterData } from "../../components/auth/RegisterPopup";
import { AuthUser, IUser, TweetsAndReplies } from "./authInterfaces";
import { LoginData } from "../../components/auth/LoginPopup";
import { EditProfileData } from "../../components/profile/EditProfile";
import { ITweet } from "../tweet/interfaces/tweetInterface";
import { SearchData } from "../../pages/Search";

// GET
const getUserDetails = async (userId: string, token: string | null): Promise<IUser> => {
    const response = await axios.get(
        `${URL}/auth/details/${userId}`,
        getConfig(token)
    );
    return response.data;
}

const getUserTweets = async (userId: string,  token: string | null): Promise<TweetsAndReplies[]> => {
    const response = await axios.get(
        `${URL}/auth/user-tweets/${userId}`,
        getConfig(token)
    ); 
    return response.data;
}

const getUserTweetsAndReplies = async (userId: string, token: string | null): Promise<TweetsAndReplies[]> => {
    const response = await axios.get(
        `${URL}/auth/user-tweets-replies/${userId}`,
        getConfig(token)
    );
    return response.data;
}

const getUserMedia = async (userId: string, token: string | null): Promise<ITweet[]> => {
    const response = await axios.get(
        `${URL}/auth/user-media/${userId}`,
        getConfig(token)
    );
    return response.data;
}

const getUserLikes = async (userId: string, token: string | null): Promise<TweetsAndReplies[]> => {
    const response = await axios.get(
        `${URL}/auth/user-likes/${userId}`,
        getConfig(token)
    );
    return response.data;
}

const getSuggestedUsers = async (limit: number, token: string | null): Promise<IUser[]> => {
    const response = await axios.get(
        `${URL}/auth/user-suggested/${limit}`,
        getConfig(token)
    );
    return response.data;
}

// POST
const register = async (data: RegisterData): Promise<AuthUser> => {
    const response = await axios.post(
        `${URL}/auth/register`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const login = async (data: LoginData): Promise<AuthUser> => {
    const response = await axios.post(
        `${URL}/auth/login`,
        data,
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const googleLogin = async (googleAccessToken: string): Promise<AuthUser> => {
    const response = await axios.post(
        `${URL}/auth/google-login`,
        { googleAccessToken },
        undefined
    );

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
}

const searchUsers = async (data: SearchData, token: string | null): Promise<IUser[]> => {
    const { query, limit } = data;
    
    const response = await axios.post(
        `${URL}/auth/search/${limit}`,
        { query },
        getConfig(token)
    );

    return response.data;
}

// PUT
const follow = async (targetUserId: string, token: string | null): Promise<{
    message: string;
    targetUserId: string;
    mainUserId: string;
}> => {
    const response = await axios.put(
        `${URL}/auth/follow/${targetUserId}`,
        undefined,
        getConfig(token)
    );
    return response.data;
}

const editProfile = async (data: EditProfileData, token: string | null): Promise<IUser> => {
    const { removeBG, fileBGName, filePFPName, fileBG, filePFP, name, bio, location, website } = data;
    const fd: FormData = new FormData();

    fd.append("removeBG", removeBG.toString());
    if (fileBGName) fd.append("fileBGName", fileBGName);
    if (filePFPName) fd.append("filePFPName", filePFPName);
    if (fileBG) fd.append("files", fileBG);
    if (filePFP) fd.append("files", filePFP);
    if (name) fd.append("name", name);
    if (bio) fd.append("bio", bio);
    if (location) fd.append("location", location);
    if (website) fd.append("website", website);

    const response = await axios.put(
        `${URL}/auth/edit-profile`,
        fd,
        getConfig(token)
    );

    return response.data;
}

const authService = {
    register,
    login,
    googleLogin,
    follow,
    getUserDetails,
    editProfile,
    getUserTweets,
    getUserTweetsAndReplies,
    getUserMedia,
    getUserLikes,
    searchUsers,
    getSuggestedUsers
};
export default authService;