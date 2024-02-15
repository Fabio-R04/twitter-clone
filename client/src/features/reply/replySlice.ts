import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import replyService from "./replyService";
import { ReplyState } from "../tweet/interfaces/replyInterface";
import { RootState } from "../../app/store";
import { checkTokenValidity } from "../../reusable";
import { follow, logout } from "../auth/authSlice";
import { IReply } from "../tweet/interfaces/replyInterface";
import toast from "react-hot-toast";
import { ILikeReply, ILikeTweet } from "../tweet/interfaces/likeInterface";
import { IRetweetPost, IRetweetReply } from "../tweet/interfaces/retweetInterface";
import { ITweet } from "../tweet/interfaces/tweetInterface";
import { likeTweet, retweetPost } from "../tweet/tweetSlice";
import { ReplyData } from "../../pages/Reply";
import { IUser } from "../auth/authInterfaces";
import { bookmarkReply, bookmarkTweet } from "../bookmark/bookmarkSlice";
import { IBookmarkReply, IBookmarkTweet } from "../bookmark/bookmarkInterfaces";

const initialState: ReplyState = {
    replyDetails: null,
    loadingReplyCreate: false,
    loadingReplyLike: {
        replyId: "",
        active: false
    },
    loadingReplyRetweet: {
        replyId: "",
        active: false
    },
    loadingReplyDelete: false,
    loadingReplyDetails: false,
    successReply: false,
    errorReply: false,
    messageReply: ""
}

// GET
export const getReplyDetails = createAsyncThunk("reply/details", async (replyId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return replyService.getReplyDetails(replyId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const createReply = createAsyncThunk("reply/create", async (data: ReplyData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await replyService.createReply(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const createReplyR = createAsyncThunk("reply/create-r", async (data: ReplyData, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return replyService.createReplyR(data, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// PUT
export const likeReply = createAsyncThunk("reply/like", async (replyId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await replyService.likeReply(replyId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const retweetReply = createAsyncThunk("reply/retweet", async (replyId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await replyService.retweetReply(replyId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// DELETE
export const deleteReply = createAsyncThunk("reply/delete", async (replyId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await replyService.deleteReply(replyId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const replySlice = createSlice({
    name: "reply",
    initialState,
    reducers: {
        resetReply: (state) => {
            state.successReply = false;
            state.errorReply = false;
            state.messageReply = "";
        },
        setLoadingLikeR: (state, action: PayloadAction<string>) => {
            state.loadingReplyLike.replyId = action.payload;
        },
        setLoadingRetweetR: (state, action: PayloadAction<string>) => {
            state.loadingReplyRetweet.replyId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getReplyDetails.pending, (state) => {
                state.loadingReplyDetails = true;
            })
            .addCase(getReplyDetails.fulfilled, (state, action: PayloadAction<IReply>) => {
                state.loadingReplyDetails = false;
                state.replyDetails = action.payload;
            })
            // POST
            .addCase(createReply.pending, (state) => {
                state.loadingReplyCreate = true;
            })
            .addCase(createReply.fulfilled, (state, action: PayloadAction<IReply>) => {
                state.loadingReplyCreate = false;
            })
            .addCase(createReply.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReplyCreate = false;
                toast.error(action.payload);
            })
            .addCase(createReplyR.pending, (state) => {
                state.loadingReplyCreate = true;
            })
            .addCase(createReplyR.fulfilled, (state, action: PayloadAction<{
                type?: string;
                parentReplyId: string;
                newReply: IReply;
            }>) => {
                state.loadingReplyCreate = false;

                const { type, newReply, parentReplyId } = action.payload;
                const location: string = window.location.pathname;

                if (state.replyDetails && type) {
                    switch (type) {
                        case "DIRECT":
                            if (location.startsWith("/reply")) {
                                (state.replyDetails.replies as IReply[]).unshift(newReply);
                            }
                            break;
                        case "PARENT":
                            if (location.startsWith("/reply")) {
                                const replies: IReply[] = (state.replyDetails.replies as IReply[]);
                                for (let i = 0; i < replies.length; i++) {
                                    if (replies[i]._id === parentReplyId) {
                                        (replies[i].replies as string[]).push(newReply._id);
                                        break;
                                    }
                                }
                            }
                            break;
                    }
                }
            })
            .addCase(createReplyR.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReplyCreate = false;
            })
            .addCase(bookmarkTweet.fulfilled, (state, action: PayloadAction<{
                message: string;
                tweetId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkTweet;
            }>) => {
                const location: string = window.location.pathname;
                let bookmarks: IBookmarkTweet[] | undefined = undefined;

                if (location.startsWith("/reply") && state.replyDetails) {
                    if ((state.replyDetails.mainTweet as ITweet)._id === action.payload.tweetId) {
                        bookmarks = ((state.replyDetails.mainTweet as ITweet).bookmarks as IBookmarkTweet[]);
                    }
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
                        ((state.replyDetails!.mainTweet as ITweet).bookmarks as IBookmarkTweet[]) = updatedBookmarks;
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
                let bookmarks: IBookmarkReply[] | undefined = undefined;
                let replies: IReply[] | undefined = undefined;
                let type: string = "";

                if (location.startsWith("/reply") && state.replyDetails) {
                    if (state.replyDetails._id === action.payload.replyId) {
                        bookmarks = (state.replyDetails.bookmarks as IBookmarkReply[]);
                        type = "MAIN";
                    } else if (state.replyDetails.parentReply && ((state.replyDetails.parentReply as IReply)._id === action.payload.replyId)) {
                        bookmarks = ((state.replyDetails.parentReply as IReply).bookmarks as IBookmarkReply[]);
                        type = "PARENT";
                    } else {
                        replies = (state.replyDetails.replies as IReply[]);
                    }
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
                            (state.replyDetails!.bookmarks as IBookmarkReply[]) = updatedBookmarks; 
                        } else if (type === "PARENT") {
                            ((state.replyDetails!.parentReply as IReply).bookmarks as IBookmarkReply[]) = updatedBookmarks;
                        }
                    }
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
                                (replies[i].bookmarks as IBookmarkReply[]) = updatedBookmarks;
                                break;
                            }
                        }
                    }
                }
            })
            // PUT
            .addCase(likeReply.pending, (state) => {
                state.loadingReplyLike.active = true;
            })
            .addCase(likeReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                likes: ILikeReply[];
            }>) => {
                state.loadingReplyLike = {
                    replyId: "",
                    active: false,
                }
                const location: string = window.location.pathname;

                if (location.startsWith("/reply")) {
                    if (state.replyDetails) {
                        if (state.replyDetails._id === action.payload.replyId) {
                            state.replyDetails.likes = action.payload.likes;
                        } else if (state.replyDetails.parentReply && (state.replyDetails.parentReply as IReply)._id === action.payload.replyId) {
                            (state.replyDetails.parentReply as IReply).likes = action.payload.likes;
                        } else {
                            const replies: IReply[] = (state.replyDetails.replies as IReply[]);
                            for (let i = 0; i < replies.length; i++) {
                                if (replies[i]._id === action.payload.replyId) {
                                    replies[i].likes = action.payload.likes;
                                    break;
                                }
                            }
                        }
                    }
                }
            })
            .addCase(likeReply.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReplyLike = {
                    replyId: "",
                    active: false
                }
                toast.error(action.payload);
            })
            .addCase(retweetReply.pending, (state) => {
                state.loadingReplyRetweet.active = true;
            })
            .addCase(retweetReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                retweets: IRetweetReply[];
            }>) => {
                state.loadingReplyRetweet = {
                    replyId: "",
                    active: false
                }
                const location: string = window.location.pathname;

                if (location.startsWith("/reply")) {
                    if (state.replyDetails) {
                        if (state.replyDetails._id === action.payload.replyId) {
                            state.replyDetails.retweets = action.payload.retweets;
                        } else if (state.replyDetails.parentReply && (state.replyDetails.parentReply as IReply)._id === action.payload.replyId) {
                            (state.replyDetails.parentReply as IReply).retweets = action.payload.retweets;
                        } else {
                            const replies: IReply[] = (state.replyDetails.replies as IReply[]);
                            for (let i = 0; i < replies.length; i++) {
                                if (replies[i]._id === action.payload.replyId) {
                                    replies[i].retweets = action.payload.retweets;
                                    break;
                                }
                            }
                        }
                    }
                }
            })
            .addCase(retweetReply.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReplyRetweet = {
                    replyId: "",
                    active: false
                }
                toast.error(action.payload);
            })
            .addCase(follow.fulfilled, (state, action: PayloadAction<{
                message: string;
                targetUserId: string;
                mainUserId: string;
            }>) => {
                const location: string = window.location.pathname;

                if (location.startsWith("/reply")) {
                    if (state.replyDetails) {
                        let followersArr: { [key: string]: string }[] = [];

                        if (state.replyDetails.user._id === action.payload.targetUserId) {
                            followersArr.push(state.replyDetails.user.followersLookup as { [key: string]: string });
                        }

                        if ((state.replyDetails.mainTweet as ITweet).user._id === action.payload.targetUserId) {
                            followersArr.push((state.replyDetails.mainTweet as ITweet).user.followersLookup as { [key: string]: string });
                        }

                        if (state.replyDetails.parentReply && (state.replyDetails.parentReply as IReply).user._id === action.payload.targetUserId) {
                            followersArr.push((state.replyDetails.parentReply as IReply).user.followersLookup as { [key: string]: string });
                        }

                        const replies: IReply[] = (state.replyDetails.replies as IReply[]);
                        for (let i = 0; i < replies.length; i++) {
                            if (replies[i].user._id === action.payload.targetUserId) {
                                followersArr.push((replies[i].user.followersLookup as { [key: string]: string }));
                            }
                        }

                        for (let i = 0; i < followersArr.length; i++) {
                            if (action.payload.message === "FOLLOWED") {
                                followersArr[i][action.payload.mainUserId] = action.payload.mainUserId;
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followersArr[i][action.payload.mainUserId];
                            }
                        }
                    }
                }
            })
            .addCase(likeTweet.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                likes: ILikeTweet[];
            }>) => {
                const location: string = window.location.pathname;

                if (location.startsWith("/reply")) {
                    if (state.replyDetails) {
                        if ((state.replyDetails.mainTweet as ITweet)._id === action.payload.tweetId) {
                            (state.replyDetails.mainTweet as ITweet).likes = action.payload.likes;
                        }
                    }
                }
            })
            .addCase(retweetPost.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                retweets: IRetweetPost[];
            }>) => {
                const location: string = window.location.pathname;

                if (location.startsWith("/reply")) {
                    if (state.replyDetails) {
                        if ((state.replyDetails.mainTweet as ITweet)._id === action.payload.tweetId) {
                            (state.replyDetails.mainTweet as ITweet).retweets = action.payload.retweets;
                        }
                    }
                }
            })
            // DELETE
            .addCase(deleteReply.pending, (state) => {
                state.loadingReplyDelete = true;
            })
            .addCase(deleteReply.fulfilled, (state, action: PayloadAction<{ replyId: string; }>) => {
                state.loadingReplyDelete = false;
                const location: string = window.location.pathname;

                if (state.replyDetails && location.startsWith("/reply")) {
                    if (state.replyDetails._id === action.payload.replyId) {
                        if (state.replyDetails.surfaceLevel === true) {
                            window.location.href = `/tweet/${(state.replyDetails.mainTweet as ITweet)._id}`;
                        } else if (state.replyDetails.surfaceLevel === false) {
                            window.location.href = `/reply/${(state.replyDetails.parentReply as IReply)._id}`;
                        }
                        state.replyDetails = null;
                    } else if (state.replyDetails.parentReply && ((state.replyDetails.parentReply as IReply)._id === action.payload.replyId)) {
                        window.location.href = `/tweet/${(state.replyDetails.mainTweet as ITweet)._id}`;
                        state.replyDetails = null;
                    } else {
                        state.replyDetails.replies = (state.replyDetails.replies as IReply[]).filter((reply: IReply) => {
                            if (reply._id !== action.payload.replyId) {
                                return reply;
                            }
                        });
                    }
                }
            })
            .addCase(deleteReply.rejected, (state, action: PayloadAction<any>) => {
                state.loadingReplyDelete = false;
                toast.error(action.payload);
            })
    }
});

export const {
    resetReply,
    setLoadingLikeR,
    setLoadingRetweetR
} = replySlice.actions;
export default replySlice.reducer;