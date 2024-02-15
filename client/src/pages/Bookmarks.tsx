import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Layout from "../components/layout/Layout";
import ThreeDotsIcon from "../components/layout/svg/ThreeDotsIcon";
import { TweetsAndReplies } from "../features/auth/authInterfaces";
import { clearBookmarks, getBookmarks, resetBookmark } from "../features/bookmark/bookmarkSlice";
import Spinner from "../components/pending/Spinner";
import { isReply } from "../reusable";
import TweetReply from "../components/tweet/TweetReply";
import HomeTweet from "../components/home/HomeTweet";

function Bookmarks() {
    const [clearActive, setClearActive] = useState<boolean>(false);
    const { user } = useAppSelector((state) => state.auth);
    const {
        bookmarks,
        loadingBookmarkAll,
        loadingBookmarkClear,
        successBookmark,
        messageBookmark
    } = useAppSelector((state) => state.bookmark);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getBookmarks());
    }, []);

    useEffect(() => {
        if (successBookmark && (messageBookmark === "CLEARED")) {
            setClearActive(false);
        }
        dispatch(resetBookmark());
    }, [successBookmark, messageBookmark, dispatch]);

    const handleClearBookmarks = (): void => {
        dispatch(clearBookmarks());
    }

    return (
        <Layout>
            <div className="bookmarks">
                <header className="bookmarks__header">
                    <div className="bookmarks__header-details">
                        <p className="bookmarks__header-details__title">Bookmarks</p>
                        <p className="bookmarks__header-details__username">@{user?.username}</p>
                    </div>
                    {bookmarks.length > 0 && (
                        <div onClick={() => setClearActive(true)} title="More" className="bookmarks__header-more">
                            <ThreeDotsIcon />
                        </div>
                    )}
                    {clearActive && (
                        <div onClick={() => {
                            if (!loadingBookmarkClear) {
                                handleClearBookmarks();
                            }
                        }} className="bookmarks__header-clear" id="bookmarks__clear">
                            {loadingBookmarkClear ? (
                                <Spinner
                                    absolute={false}
                                    height="1.8rem"
                                    width="1.8rem"
                                    margin="0 auto"
                                />
                            ) : (
                                <p>Clear all Bookmarks</p>
                            )}
                        </div>
                    )}
                </header>
                {loadingBookmarkAll ? (
                    <Spinner
                        absolute={false}
                        height="3rem"
                        width="3rem"
                        margin="2.5rem auto"
                    />
                ) : (
                    bookmarks.length > 0 ? (
                        <div className="bookmarks__all">
                            {bookmarks.map((element: TweetsAndReplies) => {
                                if (isReply(element)) {
                                    return (
                                        <TweetReply
                                            key={element._id}
                                            reply={element}
                                        />
                                    );
                                } else {
                                    return (
                                        <HomeTweet
                                            key={element._id}
                                            tweet={element}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ) : (
                        <div className="bookmarks__empty">
                            <p className="bookmarks__empty-title">
                                Save posts for later
                            </p>
                            <p className="bookmarks__empty-subtitle">
                                Bookmark posts to easily find them again in the<br />
                                future.
                            </p>
                        </div>
                    )
                )}
            </div>
            {clearActive && (
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    const target = event.target as HTMLDivElement;
                    if (target.id === "bookmarks__container") {
                        setClearActive(false);
                    }
                }}
                    className="bookmarks__container"
                    id="bookmarks__container"
                ></div>
            )}
        </Layout>
    )
}

export default Bookmarks;