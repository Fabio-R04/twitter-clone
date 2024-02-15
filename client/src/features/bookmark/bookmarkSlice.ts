import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import bookmarkService from "./bookmarkService";
import { BookmarkState, BookmarkTweetsAndReplies, IBookmarkReply, IBookmarkTweet } from "./bookmarkInterfaces";
import { RootState } from "../../app/store";
import { checkTokenValidity } from "../../reusable";
import { follow, logout } from "../auth/authSlice";
import toast from "react-hot-toast";
import { TweetsAndReplies } from "../auth/authInterfaces";
import { ITweet } from "../tweet/interfaces/tweetInterface";
import { IReply } from "../tweet/interfaces/replyInterface";
import { deleteTweet, likeTweet, retweetPost } from "../tweet/tweetSlice";
import { ILikeReply, ILikeTweet } from "../tweet/interfaces/likeInterface";
import { deleteReply, likeReply, retweetReply } from "../reply/replySlice";
import { IRetweetPost, IRetweetReply } from "../tweet/interfaces/retweetInterface";

const initialState: BookmarkState = {
    bookmarks: [],
    loadingBookmarkTweet: {
        tweetId: "",
        active: false
    },
    loadingBookmarkReply: {
        replyId: "",
        active: false
    },
    loadingBookmarkAll: false,
    loadingBookmarkClear: false,
    successBookmark: false,
    errorBookmark: false,
    messageBookmark: ""
}

// GET
export const getBookmarks = createAsyncThunk("bookmark/all", async (_, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await bookmarkService.getBookmarks(token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// POST
export const bookmarkTweet = createAsyncThunk("bookmark/tweet", async (tweetId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await bookmarkService.bookmarkTweet(tweetId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const bookmarkReply = createAsyncThunk("bookmark/reply", async (replyId: string, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await bookmarkService.bookmarkReply(replyId, token);
    } catch (error: any) {
        const message: string = error.response.data.error;
        if (!checkTokenValidity) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

// DELETE
export const clearBookmarks = createAsyncThunk("bookmark/clear", async (_, thunkAPI) => {
    try {
        const token: string | null = (thunkAPI.getState() as RootState).auth.user?.token ?? null;
        return await bookmarkService.clearBookmarks(token);
    } catch (error: any) {
        const message: string = error.response.datat.error;
        if (!checkTokenValidity(error)) {
            thunkAPI.dispatch(logout());
        }
        return thunkAPI.rejectWithValue(message);
    }
});

const bookmarkSlice = createSlice({
    name: "bookmark",
    initialState,
    reducers: {
        resetBookmark: (state) => {
            state.successBookmark = false;
            state.errorBookmark = false;
            state.messageBookmark = "";
        },
        setLoadingBookmarkT: (state, action: PayloadAction<string>) => {
            state.loadingBookmarkTweet.tweetId = action.payload;
        },
        setLoadingBookmarkR: (state, action: PayloadAction<string>) => {
            state.loadingBookmarkReply.replyId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getBookmarks.pending, (state) => {
                state.loadingBookmarkAll = true;
            })
            .addCase(getBookmarks.fulfilled, (state, action: PayloadAction<TweetsAndReplies[]>) => {
                state.loadingBookmarkAll = false;
                state.bookmarks = action.payload;
            })
            // POST
            .addCase(bookmarkTweet.pending, (state) => {
                state.loadingBookmarkTweet.active = true;
            })
            .addCase(bookmarkTweet.fulfilled, (state, action: PayloadAction<{
                message: string;
                tweetId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkTweet;
            }>) => {
                state.loadingBookmarkTweet = {
                    tweetId: "",
                    active: false
                };
                const location: string = window.location.pathname;
                const { message, tweetId, bookmarkId, newBookmark } = action.payload;
                let bookmarks: TweetsAndReplies[] | undefined = undefined;

                if (location === "/bookmarks") {
                    bookmarks = state.bookmarks;
                }

                if (bookmarks) {
                    if (message === "ADDED") {
                        let tweet: ITweet | undefined = (bookmarks.find((element: TweetsAndReplies) => element._id === tweetId) as ITweet);
                        if (!tweet) {
                            bookmarks.unshift(newBookmark!.tweet as ITweet);
                            tweet = (bookmarks[0] as ITweet);
                        }
                        (tweet.bookmarks as IBookmarkTweet[]).push(newBookmark!);
                    } else if (message === "DELETED") {
                        for (let i = 0; i < bookmarks.length; i++) {
                            if (bookmarks[i]._id === tweetId) {
                                const updatedBookmarks: IBookmarkTweet[] = (bookmarks[i].bookmarks as IBookmarkTweet[]).filter((bookmark: IBookmarkTweet) => {
                                    if (bookmark._id !== bookmarkId) {
                                        return bookmark;
                                    }
                                });
                                bookmarks[i].bookmarks = updatedBookmarks;
                                break;
                            }
                        }
                    }
                }
            })
            .addCase(bookmarkTweet.rejected, (state, action: PayloadAction<any>) => {
                state.loadingBookmarkTweet = {
                    tweetId: "",
                    active: false
                };
                toast.error(action.payload);
            })
            .addCase(bookmarkReply.pending, (state) => {
                state.loadingBookmarkReply.active = true;
            })
            .addCase(bookmarkReply.fulfilled, (state, action: PayloadAction<{
                message: string;
                replyId: string;
                bookmarkId?: string;
                newBookmark?: IBookmarkReply;
            }>) => {
                state.loadingBookmarkReply = {
                    replyId: "",
                    active: false
                };
                const location: string = window.location.pathname;
                const { message, replyId, bookmarkId, newBookmark } = action.payload;
                let bookmarks: TweetsAndReplies[] | undefined = undefined;

                if (location === "/bookmarks") {
                    bookmarks = state.bookmarks;
                }

                if (bookmarks) {
                    if (message === "ADDED") {
                        let reply: IReply | undefined = (bookmarks.find((element: TweetsAndReplies) => element._id === replyId) as IReply);
                        if (!reply) {
                            bookmarks.push(newBookmark!.reply as IReply);
                            reply = (bookmarks[0] as IReply);
                        }
                        (reply.bookmarks as IBookmarkReply[]).push(newBookmark!);
                    } else if (message === "DELETED") {
                        for (let i = 0; i < bookmarks.length; i++) {
                            if (bookmarks[i]._id === replyId) {
                                const updatedBookmarks: IBookmarkReply[] = (bookmarks[i].bookmarks as IBookmarkReply[]).filter((bookmark: IBookmarkReply) => {
                                    if (bookmark._id !== bookmarkId) {
                                        return bookmark;
                                    }
                                });
                                bookmarks[i].bookmarks = updatedBookmarks;
                                break;
                            }
                        }
                    }
                }
            })
            .addCase(bookmarkReply.rejected, (state, action: PayloadAction<any>) => {
                state.loadingBookmarkReply = {
                    replyId: "",
                    active: false
                };
                toast.error(action.payload);
            })
            // PUT
            .addCase(likeTweet.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                likes: ILikeTweet[];
            }>) => {
                const location: string = window.location.pathname;

                if (location === "/bookmarks") {
                    for (let i = 0; i < state.bookmarks.length; i++) {
                        if (state.bookmarks[i]._id === action.payload.tweetId) {
                            state.bookmarks[i].likes = action.payload.likes;
                            break;
                        }
                    }
                }
            })
            .addCase(likeReply.fulfilled, (state, action: PayloadAction<{
                replyId: string;
                likes: ILikeReply[];
            }>) => {
                const location: string = window.location.pathname;

                if (location === "/bookmarks") {
                    for (let i = 0; i < state.bookmarks.length; i++) {
                        if (state.bookmarks[i]._id === action.payload.replyId) {
                            state.bookmarks[i].likes = action.payload.likes;
                            break;
                        }
                    }
                }
            })
            .addCase(retweetPost.fulfilled, (state, action: PayloadAction<{
                tweetId: string;
                retweets: IRetweetPost[];
            }>) => {
                const location: string = window.location.pathname;

                if (location === "/bookmarks") {
                    for (let i = 0; i < state.bookmarks.length; i++) {
                        if (state.bookmarks[i]._id === action.payload.tweetId) {
                            state.bookmarks[i].retweets = action.payload.retweets;
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

                if (location === "/bookmarks") {
                    for (let i = 0; i < state.bookmarks.length; i++) {
                        if (state.bookmarks[i]._id === action.payload.replyId) {
                            state.bookmarks[i].retweets = action.payload.retweets;
                            break;
                        }
                    }
                }
            })
            .addCase(follow.fulfilled, (state, action: PayloadAction<{
                message: string;
                targetUserId: string;
                mainUserId: string;
            }>) => {
                const location: string = window.location.pathname;
                let elementsByUserId: Map<string, TweetsAndReplies[]> = new Map<string, TweetsAndReplies[]>();
                let elements: TweetsAndReplies[] | undefined = undefined;

                if (location === "/bookmarks") {
                    elements = state.bookmarks;
                }

                if (elements) {
                    elements.forEach((element: TweetsAndReplies) => {
                        const userId: string = element.user._id;
                        if (!elementsByUserId.has(userId)) {
                            elementsByUserId.set(userId, []);
                        }
                        elementsByUserId.get(userId)?.push(element);
                    });

                    const targetUserElements: TweetsAndReplies[] | undefined = elementsByUserId.get(action.payload.targetUserId);

                    if (targetUserElements) {
                        targetUserElements.forEach((element: TweetsAndReplies) => {
                            const followers: { [key: string]: string } = element.user.followersLookup;

                            if (action.payload.message === "FOLLOWED") {
                                followers[action.payload.mainUserId] = action.payload.mainUserId;
                            } else if (action.payload.message === "UNFOLLOWED") {
                                delete followers[action.payload.mainUserId];
                            }
                        });
                    }
                }
            })
            // DELETE
            .addCase(clearBookmarks.pending, (state) => {
                state.loadingBookmarkClear = true;
            })
            .addCase(clearBookmarks.fulfilled, (state, action: PayloadAction<{ success: string; }>) => {
                state.loadingBookmarkClear = false;
                state.successBookmark = true;
                state.messageBookmark = "CLEARED";
                state.bookmarks = [];
            })
            .addCase(clearBookmarks.rejected, (state, action: PayloadAction<any>) => {
                state.loadingBookmarkClear = false;
                toast.success(action.payload);
            })
            .addCase(deleteTweet.fulfilled, (state, action: PayloadAction<{ tweetId: string; }>) => {
                const location: string = window.location.pathname;

                if (location === "/bookmarks") {
                    const updatedBookmarks: TweetsAndReplies[] = state.bookmarks.filter((element: TweetsAndReplies) => {
                        if (element._id !== action.payload.tweetId) {
                            return element;
                        }
                    });
                    state.bookmarks = updatedBookmarks;
                }
            })
            .addCase(deleteReply.fulfilled, (state, action: PayloadAction<{ replyId: string; }>) => {
                const location: string = window.location.pathname;

                if (location === "/bookmarks") {
                    const updatedBookmarks: TweetsAndReplies[] = state.bookmarks.filter((element: TweetsAndReplies) => {
                        if (element._id !== action.payload.replyId) {
                            return element;
                        }
                    });
                    state.bookmarks = updatedBookmarks;
                }
            })
    }
});

export const { resetBookmark, setLoadingBookmarkT, setLoadingBookmarkR } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;