import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import tweetReducer from "../features/tweet/tweetSlice";
import replyReducer from "../features/reply/replySlice";
import bookmarkReducer from "../features/bookmark/bookmarkSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tweet: tweetReducer,
        reply: replyReducer,
        bookmark: bookmarkReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
