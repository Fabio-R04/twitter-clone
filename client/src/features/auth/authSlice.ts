import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { AuthState, AuthUser, IUser, TweetsAndReplies } from "./authInterfaces";
import { RegisterData } from "../../components/auth/RegisterPopup";
import toast from "react-hot-toast";
import { LoginData } from "../../components/auth/LoginPopup";
import { RootState } from "../../app/store";
import { checkTokenValidity, isReply } from "../../reusable";
import { EditProfileData } from "../../components/profile/EditProfile";
import { ITweet } from "../tweet/interfaces/tweetInterface";
import { IReply } from "../tweet/interfaces/replyInterface";
import { createTweet, deleteTweet, likeTweet, retweetPost } from "../tweet/tweetSlice";
import { deleteReply, likeReply, retweetReply } from "../reply/replySlice";
import { ILikeReply, ILikeTweet } from "../tweet/interfaces/likeInterface";
import { IRetweetPost, IRetweetReply } from "../tweet/interfaces/retweetInterface";
import { SearchData } from "../../pages/Search";
import { bookmarkReply, bookmarkTweet } from "../bookmark/bookmarkSlice";
import { IBookmarkReply, IBookmarkTweet } from "../bookmark/bookmarkInterfaces";

const user: string | null = localStorage.getItem("user");

const initialState: AuthState = {
    user: user ? JSON.parse(user) : null,
    userDetails: null,
    userTweets: [],
    userTweetsAndReplies: [],
    userMedia: [],
    userLikes: [],
    searchResults: [],
    suggestedUsers: [],
    loadingAuthUser: false,
    loadingAuthGoogle: false,
    loadingAuthFollow: {
        userId: "",
        active: false
    },
    loadingAuthDetails: false,
    loadingAuthEdit: false,
    loadingAuthTweets: false,
    loadingAuthTweetsAndReplies: false,
    loadingAuthMedia: false,
    loadingAuthLikes: false,
    loadingAuthSearch: false,
    loadingAuthSuggested: false,
    successAuth: false,
    errorAuth: false,
    messageAuth: ""
}

// GET
export const getUserDetails = createAsyncThunk("auth/details", async (userId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return authService.getUserDetails(userId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserTweets = createAsyncThunk("auth/tweets", async (userId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await authService.getUserTweets(userId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserTweetsAndReplies = createAsyncThunk("auth/tweets-replies", async (userId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return authService.getUserTweetsAndReplies(userId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserMedia = createAsyncThunk("auth/media", async (userId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return authService.getUserMedia(userId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserLikes = createAsyncThunk("auth/liked", async (userId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return authService.getUserLikes(userId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getSuggestedUsers = createAsyncThunk("auth/suggested", async (limit: number, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await authService.getSuggestedUsers(limit, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const register = createAsyncThunk("auth/register", async (data: RegisterData, thunkAPI) => {
    try {
        return await authService.register(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const login = createAsyncThunk("auth/login", async (data: LoginData, thunkAPI) => {
    try {
        return await authService.login(data);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const googleLogin = createAsyncThunk("auth/goolge-login", async (googleAccessToken: string, thunkAPI) => {
    try {
        return await authService.googleLogin(googleAccessToken);
    } catch (error: any) {
        const message: string = error.response.data.error;
        return thunkAPI.rejectWithValue(message);
    }
});

export const searchUsers = createAsyncThunk("auth/search", async (data: SearchData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await authService.searchUsers(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const follow = createAsyncThunk("auth/follow", async (targetUserId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await authService.follow(targetUserId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const editProfile = createAsyncThunk("auth/edit-profile", async (data: EditProfileData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await authService.editProfile(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.successAuth = false;
            state.errorAuth = false;
            state.messageAuth = "";
        },
        logout: (state) => {
            localStorage.removeItem("user");
            state.user = null;
            document.location.href = "/";
        },
        setLoadingFollow: (state, action: PayloadAction<string>) => {
            state.loadingAuthFollow.userId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getUserDetails.pending, (state) => {
                state.loadingAuthDetails = true;
            })
            .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loadingAuthDetails = false;
                state.userDetails = action.payload;
            })
            .addCase(getUserTweets.pending, (state) => {
                state.loadingAuthTweets = true;
            })
            .addCase(getUserTweets.fulfilled, (state, action: PayloadAction<TweetsAndReplies[]>) => {
                state.loadingAuthTweets = false;
                state.userTweets = action.payload;
            })
            .addCase(getUserTweetsAndReplies.pending, (state) => {
                state.loadingAuthTweetsAndReplies = true;
            })
            .addCase(getUserTweetsAndReplies.fulfilled, (state, action: PayloadAction<TweetsAndReplies[]>) => {
                state.loadingAuthTweetsAndReplies = false;
                state.userTweetsAndReplies = action.payload;
            })
            .addCase(getUserMedia.pending, (state) => {
                state.loadingAuthMedia = true;
            })
            .addCase(getUserMedia.fulfilled, (state, action: PayloadAction<ITweet[]>) => {
                state.loadingAuthMedia = false;
                state.userMedia = action.payload;
            })
            .addCase(getUserLikes.pending, (state) => {
                state.loadingAuthLikes = true;
            })
            .addCase(getUserLikes.fulfilled, (state, action: PayloadAction<TweetsAndReplies[]>) => {
                state.loadingAuthLikes = false;
                state.userLikes = action.payload;
            })
            .addCase(getSuggestedUsers.pending, (state) => {
                state.loadingAuthSuggested = true;
            })
            .addCase(getSuggestedUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                state.loadingAuthSuggested = false;
                state.suggestedUsers = action.payload;
            })
            // POST
            .addCase(register.pending, (state) => {
                state.loadingAuthUser = true;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuthUser = false;
                state.user = action.payload;
                state.successAuth = true
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthUser = false;
                toast.error(action.payload);
            })
            .addCase(login.pending, (state) => {
                state.loadingAuthUser = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuthUser = false;
                state.user = action.payload;
                state.successAuth = true;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthUser = action.payload;
                toast.error(action.payload);
            })
            .addCase(googleLogin.pending, (state) => {
                state.loadingAuthGoogle = true;
            })
            .addCase(googleLogin.fulfilled, (state, action: PayloadAction<AuthUser>) => {
                state.loadingAuthUser = false;
                state.user = action.payload;
                state.successAuth = true;
            })
            .addCase(googleLogin.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthGoogle = false;
                toast.error(action.payload);
            })
            .addCase(searchUsers.pending, (state) => {
                state.loadingAuthSearch = true;
            })
            .addCase(searchUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
                state.loadingAuthSearch = false;
                state.searchResults = action.payload;
            })
            .addCase(bookmarkTweet.fulfilled, (state, action: PayloadAction<{
                message: string;
                tweetId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkTweet;
            }>) => {
                const location: string = window.location.pathname;
                let elements: TweetsAndReplies[] | undefined = undefined;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (location === `/profile/${state.userDetails._id}`) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/media")) {
                        elements = state.userMedia;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        let parentBookmarks: IBookmarkTweet[] | undefined = undefined;
                        let bookmarks: IBookmarkTweet[] | undefined = undefined;
                        let type: string = "";
                        if (elements[i]._id === action.payload.tweetId) {
                            bookmarks = (elements[i].bookmarks as IBookmarkTweet[]);
                            type = "TWEET";
                        } else if (isReply(elements[i]) && (((elements[i] as IReply).mainTweet as ITweet)._id === action.payload.tweetId)) {
                            bookmarks = (((elements[i] as IReply).mainTweet as ITweet).bookmarks as IBookmarkTweet[]);
                            type = "REPLY";
                        }

                        if (bookmarks) {
                            if (action.payload.message === "ADDED") {
                                bookmarks.push(action.payload.newBookmark!);
                            } else if (action.payload.message === "DELETED") {
                                const updatedBookmarks: IBookmarkTweet[] = bookmarks.filter((bookmark: IBookmarkTweet) => {
                                    if (bookmark._id !== action.payload.bookmarkId) {
                                        return bookmark;
                                    }
                                });

                                if (type === "TWEET") {
                                    elements[i].bookmarks = updatedBookmarks;
                                } else if (type === "REPLY") {
                                    (((elements[i] as IReply).mainTweet as ITweet).bookmarks as IBookmarkTweet[]) = updatedBookmarks;
                                }
                            }
                        }
                    }
                }
            })
            .addCase(bookmarkReply.fulfilled, (state, action: PayloadAction<{
                message: string;
                replyId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkReply;
            }>) => {
                const location: string = window.location.pathname;
                let elements: TweetsAndReplies[] | undefined = undefined;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (location === `/profile/${state.userDetails._id}`) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/media")) {
                        elements = state.userMedia;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        let bookmarks: IBookmarkReply[] | undefined = undefined;
                        let type: string = "";
                        if (elements[i]._id === action.payload.replyId) {
                            bookmarks = (elements[i].bookmarks as IBookmarkReply[]);
                            type = "MAIN";
                        } else if (((elements[i] as IReply).parentReply) && (((elements[i] as IReply).parentReply as IReply)._id === action.payload.replyId)) {
                            bookmarks = (((elements[i] as IReply).parentReply as IReply).bookmarks as IBookmarkReply[]);
                            type = "PARENT";
                        }

                        if (bookmarks) {
                            if (action.payload.message === "ADDED") {
                                bookmarks.push(action.payload.newBookmark!);
                            } else if (action.payload.message === "DELETED") {
                                const updatedBookmarks: IBookmarkReply[] = bookmarks.filter((bookmark: IBookmarkReply) => {
                                    if (bookmark._id !== action.payload.bookmarkId) {
                                        return bookmark;
                                    }
                                });

                                if (type === "MAIN") {
                                    elements[i].bookmarks = updatedBookmarks;
                                } else if (type === "PARENT") {
                                    (((elements[i] as IReply).parentReply as IReply).bookmarks as IBookmarkReply[]) = updatedBookmarks;
                                }
                            }
                            break;
                        }
                    }
                }
            })
            .addCase(createTweet.fulfilled, (state, action: PayloadAction<ITweet>) => {
                const location: string = window.location.pathname;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (location === `/profile/${state.userDetails._id}`) {
                        state.userTweets.unshift(action.payload);
                    } else if (location.endsWith("/with_replies")) {
                        state.userTweetsAndReplies.unshift(action.payload);
                    } else if (location.endsWith("/media")) {
                        if (action.payload.file.present) {
                            state.userMedia.unshift(action.payload);
                        }
                    }
                }
            })
            // PUT
            .addCase(follow.pending, (state) => {
                state.loadingAuthFollow.active = true;
            })
            .addCase(follow.fulfilled, (state, action: PayloadAction<{
                message: string;
                targetUserId: string;
                mainUserId: string;
            }>) => {
                state.loadingAuthFollow = {
                    userId: "",
                    active: false
                };
                type AllTypes = ITweet | IReply;
                const location: string = window.location.pathname;
                let users: IUser[] | undefined = undefined;
                let elementsByUserId: Map<string, AllTypes[]> = new Map<string, AllTypes[]>();
                let elements: AllTypes[] | undefined = undefined;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (action.payload.targetUserId === state.userDetails._id) {
                        if (action.payload.message === "FOLLOWED") {
                            state.userDetails.followersLookup[action.payload.mainUserId] = action.payload.mainUserId;
                            if (action.payload.mainUserId === state.user?._id) {
                                (state.userDetails.followers as IUser[]).push((state.user as unknown as IUser));
                            }
                        } else if (action.payload.message === "UNFOLLOWED") {
                            delete state.userDetails.followersLookup[action.payload.mainUserId];
                            const updatedFollowers: IUser[] = (state.userDetails.followers as IUser[]).filter((user: IUser) => user._id !== action.payload.mainUserId);
                            state.userDetails.followers = updatedFollowers;
                        }
                    }

                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        elements = state.userTweets;
                    } else if (location.endsWith(`/with_replies`)) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith(`/media`)) {
                        elements = state.userMedia;
                    } else if (location.endsWith(`/likes`)) {
                        elements = state.userLikes;
                    }
                } else if (location.endsWith("/following") && state.userDetails) {
                    users = state.userDetails.following as IUser[];
                } else if (location.endsWith("/followers") && state.userDetails) {
                    users = state.userDetails.followers as IUser[];
                }

                for (const user of state.suggestedUsers) {
                    const followers: { [key: string]: string } = user.followersLookup;

                    if (user._id === action.payload.targetUserId) {
                        if (action.payload.message === "FOLLOWED") {
                            followers[action.payload.mainUserId] = action.payload.mainUserId;
                        } else if (action.payload.message === "UNFOLLOWED") {
                            delete followers[action.payload.mainUserId];
                        }
                        break;
                    }
                }

                if (users) {
                    for (const user of users) {
                        const followers: { [key: string]: string } = user.followersLookup;

                        if (user._id === action.payload.targetUserId) {
                            if (action.payload.message === "FOLLOWED") {
                                followers[action.payload.mainUserId] = action.payload.mainUserId;
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followers[action.payload.mainUserId];
                            }
                            break;
                        }
                    };
                }

                if (elements) {
                    elements.forEach((element: AllTypes) => {
                        let userId: string | undefined;
                        if (isReply(element)) {
                            if (element.surfaceLevel) {
                                userId = (element.mainTweet as ITweet).user._id;
                            } else {
                                userId = (element.parentReply as IReply).user._id;
                            }

                            if (userId !== action.payload.targetUserId) {
                                userId = element.user._id;
                            }
                        } else {
                            userId = element.user._id;
                        }

                        if (!elementsByUserId.has(userId)) {
                            elementsByUserId.set(userId, []);
                        }

                        elementsByUserId.get(userId)?.push(element);
                    });

                    const targetElements: AllTypes[] | undefined = elementsByUserId.get(action.payload.targetUserId);

                    if (targetElements) {
                        targetElements.forEach((element: AllTypes) => {
                            let followers: { [key: string]: string };
                            let mainReplyFollowers: { [key: string]: string } | undefined = undefined;
                            if (isReply(element)) {
                                let userId: string;
                                if (element.surfaceLevel) {
                                    userId = (element.mainTweet as ITweet).user._id;
                                    followers = (element.mainTweet as ITweet).user.followersLookup;
                                } else {
                                    userId = (element.parentReply as IReply).user._id;
                                    followers = (element.parentReply as IReply).user.followersLookup;
                                }

                                if ((userId === action.payload.targetUserId) && (element.user._id === action.payload.targetUserId)) {
                                    mainReplyFollowers = element.user.followersLookup;
                                } else if (userId !== action.payload.targetUserId) {
                                    followers = element.user.followersLookup;
                                }
                            } else {
                                followers = element.user.followersLookup;
                            }

                            if (action.payload.message === "FOLLOWED") {
                                followers[action.payload.mainUserId] = action.payload.mainUserId;
                                if (mainReplyFollowers) {
                                    mainReplyFollowers[action.payload.mainUserId] = action.payload.mainUserId;
                                }
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followers[action.payload.mainUserId];
                                if (mainReplyFollowers) {
                                    delete mainReplyFollowers[action.payload.mainUserId];
                                }
                            }
                        });
                    }
                }
            })
            .addCase(editProfile.pending, (state) => {
                state.loadingAuthEdit = true;
            })
            .addCase(editProfile.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loadingAuthEdit = false;
                const previousData: AuthUser = JSON.parse((localStorage.getItem("user") as string));
                const updatedData: AuthUser = {
                    ...previousData,
                    hasBG: action.payload.hasBG,
                    hasPFP: action.payload.hasPFP,
                    name: action.payload.name,
                    bio: action.payload.bio,
                    location: action.payload.location,
                    website: action.payload.website
                }

                state.user = updatedData;
                localStorage.setItem("user", JSON.stringify(updatedData));
                if (state.userDetails && (state.userDetails._id === action.payload._id)) {
                    state.userDetails = {
                        ...state.userDetails,
                        hasBG: action.payload.hasBG,
                        hasPFP: action.payload.hasPFP,
                        name: action.payload.name,
                        bio: action.payload.bio,
                        location: action.payload.location,
                        website: action.payload.website
                    }
                }

                state.successAuth = true;
                state.messageAuth = "PROFILE UPDATED";
                toast.success("Profile Updated!");
            })
            .addCase(editProfile.rejected, (state, action: PayloadAction<any>) => {
                state.loadingAuthEdit = false;
                toast.error(action.payload);
            })
            .addCase(likeTweet.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                likes: ILikeTweet[];
            }>) => {
                type AllTypes = ITweet | IReply;
                let elements: AllTypes[] | undefined = undefined;

                const location: string = window.location.pathname;
                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/media")) {
                        elements = state.userMedia;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        if (isReply(elements[i]) && (((elements[i] as IReply).mainTweet as ITweet)._id === action.payload.tweetId)) {
                            ((elements[i] as IReply).mainTweet as ITweet).likes = action.payload.likes;
                        }

                        if (elements[i]._id === action.payload.tweetId) {
                            elements[i].likes = action.payload.likes;
                        }
                    }
                }
            })
            .addCase(retweetPost.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                retweets: IRetweetPost[];
            }>) => {
                type AllTypes = ITweet | IReply;
                let elements: AllTypes[] | undefined = undefined;

                const location: string = window.location.pathname;
                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/media")) {
                        elements = state.userMedia;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        if (isReply(elements[i]) && (((elements[i] as IReply).mainTweet as ITweet)._id === action.payload.tweetId)) {
                            ((elements[i] as IReply).mainTweet as ITweet).retweets = action.payload.retweets;
                        }

                        if (elements[i]._id === action.payload.tweetId) {
                            elements[i].retweets = action.payload.retweets;
                        }
                    }
                }
            })
            .addCase(likeReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                likes: ILikeReply[];
            }>) => {
                type AllTypes = ITweet | IReply;
                let elements: AllTypes[] | undefined = undefined;

                const location: string = window.location.pathname;
                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i]._id === action.payload.replyId) {
                            elements[i].likes = action.payload.likes;
                            break;
                        } else if (isReply(elements[i]) && ((elements[i] as IReply).parentReply !== undefined)) {
                            if (((elements[i] as IReply).parentReply as IReply)._id === action.payload.replyId) {
                                ((elements[i] as IReply).parentReply as IReply).likes = action.payload.likes;
                                break;
                            }
                        }
                    }
                }
            })
            .addCase(retweetReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                retweets: IRetweetReply[];
            }>) => {
                type AllTypes = ITweet | IReply;
                let elements: AllTypes[] | undefined = undefined;

                const location: string = window.location.pathname;
                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        elements = state.userTweets;
                    } else if (location.endsWith("/with_replies")) {
                        elements = state.userTweetsAndReplies;
                    } else if (location.endsWith("/likes")) {
                        elements = state.userLikes;
                    }
                }

                if (elements) {
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i]._id === action.payload.replyId) {
                            elements[i].retweets = action.payload.retweets;
                            break;
                        } else if (isReply(elements[i]) && ((elements[i] as IReply).parentReply !== undefined)) {
                            if (((elements[i] as IReply).parentReply as IReply)._id === action.payload.replyId) {
                                ((elements[i] as IReply).parentReply as IReply).retweets = action.payload.retweets;
                                break;
                            }
                        }
                    }
                }
            })
            // DELETE
            .addCase(deleteTweet.fulfilled, (state, action: PayloadAction<{ tweetId: string; }>) => {
                state.successAuth = true;
                state.messageAuth = "TWEET DELETED";
                type AllTypes = ITweet | IReply;
                const location: string = window.location.pathname;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        const updatedElements: AllTypes[] = state.userTweets.filter((element: AllTypes) => {
                            if (element._id !== action.payload.tweetId) {
                                return element;
                            }
                        });
                        state.userTweets = updatedElements;
                    } else if (location.endsWith("/with_replies")) {
                        const updatedElements: AllTypes[] = state.userTweetsAndReplies.filter((element: AllTypes) => {
                            if (isReply(element)) {
                                if ((element.mainTweet as ITweet)._id !== action.payload.tweetId) {
                                    return element;
                                }
                            } else {
                                if (element._id !== action.payload.tweetId) {
                                    return element;
                                }
                            }
                        });
                        state.userTweetsAndReplies = updatedElements;
                    } else if (location.endsWith("/media")) {
                        const updatedMedia: ITweet[] = state.userMedia.filter((tweet: ITweet) => {
                            if (tweet._id !== action.payload.tweetId) {
                                return tweet;
                            }
                        });
                        state.userMedia = updatedMedia;
                    } else if (location.endsWith("/likes")) {
                        const updatedElements: AllTypes[] = state.userLikes.filter((element: AllTypes) => {
                            if (element._id !== action.payload.tweetId) {
                                return element;
                            }
                        });
                        state.userLikes = updatedElements;
                    }
                }
            })
            .addCase(deleteReply.fulfilled, (state, action: PayloadAction<{ replyId: string }>) => {
                state.successAuth = true;
                state.messageAuth = "REPLY DELETED";
                type AllTypes = ITweet | IReply;
                const location: string = window.location.pathname;

                if (location.startsWith("/profile") && state.userDetails) {
                    if (location.endsWith(`/${state.userDetails._id}`)) {
                        const updatedElements: AllTypes[] = state.userTweets.filter((element: AllTypes) => {
                            if (element._id !== action.payload.replyId) {
                                return element;
                            }
                        });
                        state.userTweets = updatedElements;
                    } else if (location.endsWith("/with_replies")) {
                        const updatedElements: AllTypes[] = state.userTweetsAndReplies.filter((element: AllTypes) => {
                            if (element._id !== action.payload.replyId) {
                                return element;
                            }
                        });
                        state.userTweetsAndReplies = updatedElements;
                    } else if (location.endsWith("/likes")) {
                        const updatedElements: AllTypes[] = state.userLikes.filter((element: AllTypes) => {
                            if (element._id !== action.payload.replyId) {
                                return element;
                            }
                        });
                        state.userLikes = updatedElements;
                    }
                }
            })
    }
});

export const { resetAuth, logout, setLoadingFollow } = authSlice.actions;
export default authSlice.reducer;