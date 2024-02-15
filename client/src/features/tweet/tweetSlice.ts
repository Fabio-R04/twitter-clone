import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import tweetService from "./tweetService";
import { ITweet, TweetState } from "./interfaces/tweetInterface";
import { TweetData } from "../../pages/Home";
import { RootState } from "../../app/store";
import { checkTokenValidity } from "../../reusable";
import { follow, logout } from "../auth/authSlice";
import toast from "react-hot-toast";
import { ILikeReply, ILikeTweet } from "./interfaces/likeInterface";
import { IRetweetPost, IRetweetReply } from "./interfaces/retweetInterface";
import { IUser } from "../auth/authInterfaces";
import { createReply, createReplyR, deleteReply, likeReply, retweetReply } from "../reply/replySlice";
import { IReply } from "./interfaces/replyInterface";
import { EngagementsData } from "../../pages/Engagements";
import { bookmarkReply, bookmarkTweet } from "../bookmark/bookmarkSlice";
import { IBookmarkReply, IBookmarkTweet } from "../bookmark/bookmarkInterfaces";

const initialState: TweetState = {
    tweetDetails: null,
    engagements: {
        retweets: [],
        likes: []
    },
    forYouTweets: [],
    followingTweets: [],
    currentPageForYou: 1,
    currentPageFollowing: 1,
    loadingTweetCreate: false,
    loadingTweetHome: false,
    loadingTweetLike: {
        tweetId: "",
        active: false
    },
    loadingTweetRetweetP: {
        tweetId: "",
        active: false
    },
    loadingTweetDelete: false,
    loadingTweetRetweets: false,
    loadingTweetLikes: false,
    loadingTweetDetails: false,
    successTweet: false,
    errorTweet: false,
    messageTweet: ""
}

// GET
export const getForYouTweets = createAsyncThunk("tweet/for-you", async (page: number, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return tweetService.getForYouTweets(page, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getFollowingTweets = createAsyncThunk("tweet/following", async (page: number, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return tweetService.getFollowingTweets(page, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTweetRetweets = createAsyncThunk("tweet/engagements-retweets", async (data: EngagementsData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.getTweetRetweets(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTweetLikes = createAsyncThunk("tweet/engagements-likes", async (data: EngagementsData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.getTweetLikes(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTweetDetails = createAsyncThunk("tweet/details", async (tweetId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.getTweetDetails(tweetId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const createTweet = createAsyncThunk("tweet/create", async (data: TweetData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.createTweet(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const likeTweet = createAsyncThunk("tweet/like", async (tweetId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.likeTweet(tweetId, token);
    } catch (error: any) {
        console.log(error);
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const retweetPost = createAsyncThunk("tweet/retweet", async (tweetId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.retweetPost(tweetId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// DELETE
export const deleteTweet = createAsyncThunk("tweet/delete", async (tweetId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await tweetService.deleteTweet(tweetId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const tweetSlice = createSlice({
    name: "tweet",
    initialState,
    reducers: {
        resetTweet: (state) => {
            state.successTweet = false;
            state.errorTweet = false;
            state.messageTweet = "";
        },
        fetchNextPageForYou: (state) => {
            state.currentPageForYou += 1;
        },
        fetchNextPageFollowing: (state) => {
            state.currentPageFollowing += 1;
        },
        resetHomeTweets: (state) => {
            state.forYouTweets = [];
            state.followingTweets = [];
        },
        setLoadingLikeId: (state, action: PayloadAction<string>) => {
            state.loadingTweetLike.tweetId = action.payload;
        },
        setLoadingRetweetPId: (state, action: PayloadAction<string>) => {
            state.loadingTweetRetweetP.tweetId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getForYouTweets.pending, (state) => {
                state.loadingTweetHome = true;
            })
            .addCase(getForYouTweets.fulfilled, (state, action: PayloadAction<ITweet[]>) => {
                state.loadingTweetHome = false;
                if (action.payload.length > 0) {
                    for (const tweet of action.payload) {
                        if (!state.forYouTweets.find((t: ITweet) => tweet._id === t._id)) {
                            state.forYouTweets.push(tweet);
                        }
                    }
                } else {
                    if (state.currentPageForYou > 1) {
                        state.currentPageForYou -= 1;
                    }
                }
            })
            .addCase(getFollowingTweets.pending, (state) => {
                state.loadingTweetHome = true;
            })
            .addCase(getFollowingTweets.fulfilled, (state, action: PayloadAction<ITweet[]>) => {
                state.loadingTweetHome = false;
                if (action.payload.length > 0) {
                    for (const tweet of action.payload) {
                        if (!state.followingTweets.find((t: ITweet) => tweet._id === t._id)) {
                            state.followingTweets.push(tweet);
                        }
                    }
                } else {
                    if (state.currentPageFollowing > 1) {
                        state.currentPageFollowing -= 1;
                    }
                }
            })
            .addCase(getTweetRetweets.pending, (state) => {
                state.loadingTweetRetweets = true;
            })
            .addCase(getTweetRetweets.fulfilled, (state, action: PayloadAction<IRetweetPost[] | IRetweetReply[]>) => {
                state.loadingTweetRetweets = false;
                state.engagements.retweets = action.payload;
            })
            .addCase(getTweetLikes.pending, (state) => {
                state.loadingTweetLikes = true;
            })
            .addCase(getTweetLikes.fulfilled, (state, action: PayloadAction<ILikeTweet[] | ILikeReply[]>) => {
                state.loadingTweetLikes = false;
                state.engagements.likes = action.payload;
            })
            .addCase(getTweetDetails.pending, (state) => {
                state.loadingTweetDetails = true;
            })
            .addCase(getTweetDetails.fulfilled, (state, action: PayloadAction<ITweet>) => {
                state.loadingTweetDetails = false;
                state.tweetDetails = action.payload;
            })
            // POST
            .addCase(createTweet.pending, (state) => {
                state.loadingTweetCreate = true;
            })
            .addCase(createTweet.fulfilled, (state, action: PayloadAction<ITweet>) => {
                state.loadingTweetCreate = false;
                state.forYouTweets.unshift(action.payload);
                state.successTweet = true;
                state.messageTweet = "TWEET CREATED";
            })
            .addCase(createTweet.rejected, (state, action: PayloadAction<any>) => {
                state.loadingTweetCreate = false;
                toast.error(action.payload);
            })
            .addCase(createReply.fulfilled, (state, action: PayloadAction<IReply>) => {
                const location: string = window.location.pathname;
                if (location.startsWith("/tweet") && state.tweetDetails && (state.tweetDetails._id === action.payload.mainTweet)) {
                    (state.tweetDetails.replies as IReply[]).unshift(action.payload);
                } else if (location === "/home") {
                    const forYouTweets: ITweet[] = state.forYouTweets;
                    for (let i = 0; i < forYouTweets.length; i++) {
                        if (forYouTweets[i]._id === action.payload.mainTweet) {
                            (forYouTweets[i].replies as string[]).push(action.payload._id);
                            break;
                        }
                    }
                } else if (location === "/home/following") {
                    const followingTweets: ITweet[] = state.followingTweets;
                    for (let i = 0; i < followingTweets.length; i++) {
                        if (followingTweets[i]._id === action.payload.mainTweet) {
                            (followingTweets[i].replies as string[]).push(action.payload._id);
                            break;
                        }
                    }
                }
            })
            .addCase(createReplyR.fulfilled, (state, action: PayloadAction<{
                type?: string;
                parentReplyId: string;
                newReply: IReply;
            }>) => {
                const { newReply, parentReplyId } = action.payload;
                const location: string = window.location.pathname;

                if (location.startsWith("/tweet") && state.tweetDetails) {
                    const replies: IReply[] = (state.tweetDetails.replies as IReply[]);
                    for (let i = 0; i < replies.length; i++) {
                        if (replies[i]._id === parentReplyId) {
                            (replies[i].replies as string[]).push(newReply._id);
                            break;
                        }
                    }
                }
            })
            .addCase(bookmarkTweet.fulfilled, (state, action: PayloadAction<{
                message: string;
                tweetId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkTweet;
            }>) => {
                const location: string = window.location.pathname;
                let tweets: ITweet[] | undefined = undefined;

                if (location === "/home") {
                    tweets = state.forYouTweets;
                } else if (location === "/home/following") {
                    tweets = state.followingTweets;
                } else if (location.startsWith("/tweet") && state.tweetDetails && (state.tweetDetails._id === action.payload.tweetId)) {
                    if (action.payload.message === "ADDED") {
                        (state.tweetDetails.bookmarks as IBookmarkTweet[]).push(action.payload.newBookmark!);
                    } else if (action.payload.message === "DELETED") {
                        const updatedBookmarks: IBookmarkTweet[] = (state.tweetDetails.bookmarks as IBookmarkTweet[]).filter((bookmark: IBookmarkTweet) => {
                            if (bookmark._id !== action.payload.bookmarkId) {
                                return bookmark;
                            }
                        });
                        state.tweetDetails.bookmarks = updatedBookmarks;
                    }
                }

                if (tweets) {
                    if (action.payload.message === "ADDED") {
                        for (let i = 0; i < tweets.length; i++) {
                            if (tweets[i]._id === action.payload.tweetId) {
                                (tweets[i].bookmarks as IBookmarkTweet[]).push(action.payload.newBookmark!);
                                break;
                            }
                        }
                    } else if (action.payload.message === "DELETED") {
                        for (let i = 0; i < tweets.length; i++) {
                            if (tweets[i]._id === action.payload.tweetId) {
                                const updatedBookmarks: IBookmarkTweet[] = (tweets[i].bookmarks as IBookmarkTweet[]).filter((bookmark: IBookmarkTweet) => {
                                    if (bookmark._id !== action.payload.bookmarkId) {
                                        return bookmark;
                                    }
                                });
                                tweets[i].bookmarks = updatedBookmarks;
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
                let replies: IReply[] | undefined = undefined;

                if (location.startsWith("/tweet") && state.tweetDetails) {
                    replies = (state.tweetDetails.replies as IReply[]);
                }

                if (replies) {
                    if (action.payload.message === "ADDED") {
                        for (let i = 0; i < replies.length; i++) {
                            if (replies[i]._id === action.payload.replyId) {
                                (replies[i].bookmarks as IBookmarkReply[]).push(action.payload.newBookmark!);
                                break;
                            }
                        }
                    } else if (action.payload.message === "DELETED") {
                        for (let i = 0; i < replies.length; i++) {
                            if (replies[i]._id === action.payload.replyId) {
                                const updatedBookmarks: IBookmarkReply[] = (replies[i].bookmarks as IBookmarkReply[]).filter((bookmark: IBookmarkReply) => {
                                    if (bookmark._id !== action.payload.bookmarkId) {
                                        return bookmark;
                                    }
                                });
                                replies[i].bookmarks = updatedBookmarks;
                                break;
                            }
                        }
                    }
                }
            })
            // PUT
            .addCase(likeTweet.pending, (state) => {
                state.loadingTweetLike.active = true;
            })
            .addCase(likeTweet.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                likes: ILikeTweet[];
            }>) => {
                state.loadingTweetLike = {
                    tweetId: "",
                    active: false
                };

                const location: string = window.location.pathname;
                if (location === "/home") {
                    for (let i = 0; i < state.forYouTweets.length; i++) {
                        if (state.forYouTweets[i]._id === action.payload.tweetId) {
                            state.forYouTweets[i].likes = action.payload.likes;
                            break;
                        }
                    }
                } else if (location === "/home/following") {
                    for (let i = 0; i < state.followingTweets.length; i++) {
                        if (state.followingTweets[i]._id === action.payload.tweetId) {
                            state.followingTweets[i].likes = action.payload.likes;
                            break;
                        }
                    }
                } else if (location.startsWith("/tweet") && state.tweetDetails) {
                    if (action.payload.tweetId === action.payload.tweetId) {
                        state.tweetDetails.likes = action.payload.likes;
                    }
                }
            })
            .addCase(retweetPost.pending, (state) => {
                state.loadingTweetRetweetP.active = true;
            })
            .addCase(retweetPost.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                retweets: IRetweetPost[];
            }>) => {
                state.loadingTweetRetweetP = {
                    tweetId: "",
                    active: false
                };

                const location: string = window.location.pathname;
                if (location === "/home") {
                    for (let i = 0; i < state.forYouTweets.length; i++) {
                        if (state.forYouTweets[i]._id === action.payload.tweetId) {
                            state.forYouTweets[i].retweets = action.payload.retweets;
                            break;
                        }
                    }
                } else if (location === "/home/following") {
                    for (let i = 0; i < state.followingTweets.length; i++) {
                        if (state.followingTweets[i]._id === action.payload.tweetId) {
                            state.followingTweets[i].retweets = action.payload.retweets;
                            break;
                        }
                    }
                } else if (location.startsWith("/tweet")) {
                    if (state.tweetDetails && state.tweetDetails._id === action.payload.tweetId) {
                        state.tweetDetails.retweets = action.payload.retweets;
                    }
                }
            })
            .addCase(follow.fulfilled, (state, action: PayloadAction<{
                message: string;
                targetUserId: string;
                mainUserId: string;
            }>) => {
                type AllTypes = ITweet | IRetweetPost | IRetweetReply | ILikeReply | ILikeTweet | IReply;
                const location: string = window.location.pathname;
                let elementsByUserId: Map<string, AllTypes[]> = new Map<string, AllTypes[]>();
                let elements: AllTypes[] | undefined = undefined;

                if (location === "/home") {
                    elements = state.forYouTweets;
                } else if (location === "/home/following") {
                    elements = state.followingTweets;
                } else if (location.includes("retweets")) {
                    elements = state.engagements.retweets;
                } else if (location.includes("likes")) {
                    elements = state.engagements.likes;
                } else if (location.startsWith("/tweet")) {
                    if (state.tweetDetails) {
                        if (state.tweetDetails.user._id !== action.payload.mainUserId) {
                            const followers: { [key: string]: string } = state.tweetDetails.user.followersLookup as { [key: string]: string };
                            if (action.payload.message === "FOLLOWED") {
                                followers[action.payload.mainUserId] = action.payload.mainUserId;
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followers[action.payload.mainUserId];
                            }
                            elements = (state.tweetDetails.replies as IReply[]);
                        } else {
                            elements = (state.tweetDetails.replies as IReply[]);
                        }
                    }
                } else {
                    elements = undefined;
                }

                if (elements) {
                    elements.forEach((element: AllTypes) => {
                        const userId: string = (element.user as IUser)._id;
                        if (!elementsByUserId.has(userId)) {
                            elementsByUserId.set(userId, []);
                        }
                        elementsByUserId.get(userId)?.push(element);
                    });

                    const targetUserElements: AllTypes[] | undefined = elementsByUserId.get(action.payload.targetUserId);

                    if (targetUserElements) {
                        targetUserElements.forEach((element: AllTypes) => {
                            const followers: { [key: string]: string } = ((element.user as IUser).followersLookup as { [key: string]: string });

                            if (action.payload.message === "FOLLOWED") {
                                followers[action.payload.mainUserId] = action.payload.mainUserId;
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followers[action.payload.mainUserId];
                            }
                        });
                    }
                }
            })
            .addCase(likeReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                likes: ILikeReply[];
            }>) => {
                const location: string = window.location.pathname;
                if (location.startsWith("/tweet") && state.tweetDetails) {
                    const replies: IReply[] = (state.tweetDetails.replies as IReply[]);
                    for (let i = 0; i < replies.length; i++) {
                        if (replies[i]._id === action.payload.replyId) {
                            replies[i].likes = action.payload.likes;
                            break;
                        }
                    }
                }
            })
            .addCase(retweetReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                retweets: IRetweetReply[];
            }>) => {
                const location: string = window.location.pathname;
                if (location.startsWith("/tweet") && state.tweetDetails) {
                    const replies: IReply[] = (state.tweetDetails.replies as IReply[]);
                    for (let i = 0; i < replies.length; i++) {
                        if (replies[i]._id === action.payload.replyId) {
                            replies[i].retweets = action.payload.retweets;
                            break;
                        }
                    }
                }
            })
            // DELETE
            .addCase(deleteTweet.pending, (state) => {
                state.loadingTweetDelete = true;
            })
            .addCase(deleteTweet.fulfilled, (state, action: PayloadAction<{ tweetId: string; }>) => {
                state.loadingTweetDelete = false;
                const location: string = window.location.pathname;

                if (location === "/home") {
                    state.forYouTweets = state.forYouTweets.filter((tweet: ITweet) => {
                        if (tweet._id !== action.payload.tweetId) {
                            return tweet;
                        }
                    });
                } else if (location === "/home/following") {
                    state.followingTweets = state.followingTweets.filter((tweet: ITweet) => {
                        if (tweet._id !== action.payload.tweetId) {
                            return tweet;
                        }
                    });
                } else if (location.startsWith("/tweet")) {
                    if (state.tweetDetails && state.tweetDetails._id === action.payload.tweetId) {
                        state.successTweet = true;
                        window.location.href = "/home";
                    }
                } else if (location.startsWith("/reply")) {
                    if (state.tweetDetails) {
                        window.location.href = "/home";
                        state.tweetDetails = null;
                    }
                }
            })
            .addCase(deleteTweet.rejected, (state, action: PayloadAction<any>) => {
                state.loadingTweetDelete = false;
                toast.error(action.payload);
            })
            .addCase(deleteReply.fulfilled, (state, action: PayloadAction<{ replyId: string; }>) => {
                const location: string = window.location.pathname;

                if (location.startsWith("/tweet") && state.tweetDetails) {
                    state.tweetDetails.replies = (state.tweetDetails.replies as IReply[]).filter((reply: IReply) => {
                        if (reply._id !== action.payload.replyId) {
                            return reply;
                        }
                    });
                }
            })

    }
});

export const {
    resetTweet,
    resetHomeTweets,
    setLoadingLikeId,
    setLoadingRetweetPId,
    fetchNextPageForYou,
    fetchNextPageFollowing
} = tweetSlice.actions;
export default tweetSlice.reducer;