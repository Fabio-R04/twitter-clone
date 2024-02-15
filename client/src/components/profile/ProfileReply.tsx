import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IReply } from "../../features/tweet/interfaces/replyInterface";
import { ITweet } from "../../features/tweet/interfaces/tweetInterface";
import TweetInfo from "../TweetInfo";
import LikesIcon from "../home/svg/LikesIcon";
import RepliesIcon from "../home/svg/RepliesIcon";
import RetweetsIcon from "../home/svg/RetweetsIcon";
import ProfilePicture from "../layout/ProfilePicture";
import BookmarkIcon from "../layout/svg/BookmarkIcon";
import ThreeDotsIcon from "../layout/svg/ThreeDotsIcon";
import Spinner from "../pending/Spinner";
import { getFormattedDuration } from "../../reusable";
import MoreOptions from "../MoreOptions";
import { resetAuth } from "../../features/auth/authSlice";
import { deleteReply, likeReply, retweetReply, setLoadingLikeR, setLoadingRetweetR } from "../../features/reply/replySlice";
import { deleteTweet, likeTweet, retweetPost, setLoadingLikeId, setLoadingRetweetPId } from "../../features/tweet/tweetSlice";
import { IUser } from "../../features/auth/authInterfaces";
import { ILikeReply, ILikeTweet } from "../../features/tweet/interfaces/likeInterface";
import { IRetweetPost, IRetweetReply } from "../../features/tweet/interfaces/retweetInterface";
import { bookmarkReply, bookmarkTweet, setLoadingBookmarkR, setLoadingBookmarkT } from "../../features/bookmark/bookmarkSlice";
import { IBookmarkReply, IBookmarkTweet } from "../../features/bookmark/bookmarkInterfaces";
import ReplyPopup from "../home/ReplyPopup";

interface ProfileReplyProps {
    replyInfo: IReply;
}

function ProfileReply({ replyInfo }: ProfileReplyProps) {
    const [replyPopupActiveParent, setReplyPopupActiveParent] = useState<boolean>(false);
    const [replyPopupActiveMain, setReplyPopupActiveMain] = useState<boolean>(false);
    const [retweetedParent, setRetweetedParent] = useState<boolean>(false);
    const [likedParent, setLikedParent] = useState<boolean>(false);
    const [bookmarkedParent, setBookmarkedParent] = useState<boolean>(false);
    const [retweetedMain, setRetweetedMain] = useState<boolean>(false);
    const [likedMain, setLikedMain] = useState<boolean>(false);
    const [bookmarkedMain, setBookmarkedMain] = useState<boolean>(false);
    const [moreOptionsMainActive, setMoreOptionsMainActive] = useState<boolean>(false);
    const [moreOptionsParentActive, setMoreOptionsParentActive] = useState<boolean>(false);
    const [parentElement, setParentElement] = useState<ITweet | IReply | null>(null);
    const {
        loadingTweetLike,
        loadingTweetRetweetP
    } = useAppSelector((state) => state.tweet);
    const {
        loadingReplyLike,
        loadingReplyRetweet
    } = useAppSelector((state) => state.reply);
    const {
        user,
        successAuth,
        messageAuth
    } = useAppSelector((state) => state.auth);
    const {
        loadingBookmarkTweet,
        loadingBookmarkReply
    } = useAppSelector((state) => state.bookmark);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (parentElement) {
            type TweetAndReplyLike = ILikeTweet | ILikeReply;
            type TweetAndReplyRetweet = IRetweetPost | IRetweetReply;
            type TweetAndReplyBookmark = IBookmarkTweet | IBookmarkReply;

            if ((parentElement.likes as TweetAndReplyLike[]).find((like: TweetAndReplyLike) => (like.user as IUser)._id === user?._id)) {
                setLikedParent(true);
            } else {
                setLikedParent(false);
            }

            if ((parentElement.retweets as TweetAndReplyRetweet[]).find((retweet: TweetAndReplyRetweet) => (retweet.user as IUser)._id === user?._id)) {
                setRetweetedParent(true);
            } else {
                setRetweetedParent(false);
            }

            if ((parentElement.bookmarks as TweetAndReplyBookmark[]).find((bookmark: TweetAndReplyBookmark) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarkedParent(true);
            } else {
                setBookmarkedParent(false);
            }
        }
    }, [parentElement]);

    useEffect(() => {
        if (replyInfo.likes) {
            if ((replyInfo.likes as ILikeReply[]).find((like: ILikeReply) => (like.user as IUser)._id === user?._id)) {
                setLikedMain(true);
            } else {
                setLikedMain(false);
            }
        }
    }, [replyInfo.likes]);

    useEffect(() => {
        if (replyInfo.retweets) {
            if ((replyInfo.retweets as IRetweetReply[]).find((retweet: IRetweetReply) => (retweet.user as IUser)._id === user?._id)) {
                setRetweetedMain(true);
            } else {
                setRetweetedMain(false);
            }
        }
    }, [replyInfo.retweets]);

    useEffect(() => {
        if (replyInfo.bookmarks) {
            if ((replyInfo.bookmarks as IBookmarkReply[]).find((bookmark: IBookmarkReply) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarkedMain(true);
            } else {
                setBookmarkedMain(false);
            }
        }
    }, [replyInfo.bookmarks]);

    useEffect(() => {
        if (replyInfo.surfaceLevel) {
            setParentElement((replyInfo.mainTweet as ITweet));
        } else {
            setParentElement((replyInfo.parentReply as IReply));
        }
    }, [replyInfo, replyInfo.surfaceLevel]);

    useEffect(() => {
        if (successAuth && (messageAuth === "TWEET DELETED")) {
            setMoreOptionsMainActive(false);
            setMoreOptionsParentActive(false);
        }
        dispatch(resetAuth());
    }, [successAuth, messageAuth, dispatch]);

    const handleParentClick = (event: React.MouseEvent<HTMLDivElement>, type: string): void => {
        const parent = event.currentTarget;
        const target = event.target;

        if (target === parent) {
            handleNavigation(type);
        }
    }

    const handleNavigation = (type: string): void => {
        if (type === "PARENT") {
            if (replyInfo.surfaceLevel) {
                navigate(`/tweet/${(replyInfo.mainTweet as ITweet)._id}`);
            } else {
                navigate(`/reply/${(replyInfo.parentReply as IReply)._id}`);
            }
        } else if (type === "MAIN") {
            navigate(`/reply/${replyInfo._id}`);
        }
    }

    const handleRetweetParent = (): void => {
        if (replyInfo.surfaceLevel) {
            const tweetId: string = (replyInfo.mainTweet as ITweet)._id;
            dispatch(setLoadingRetweetPId(tweetId));
            dispatch(retweetPost(tweetId));
        } else {
            const replyId: string = (replyInfo.parentReply as IReply)._id;
            dispatch(setLoadingRetweetR(replyId));
            dispatch(retweetReply(replyId));
        }
    }

    const handleLikeParent = (): void => {
        if (replyInfo.surfaceLevel) {
            const tweetId: string = (replyInfo.mainTweet as ITweet)._id;
            dispatch(setLoadingLikeId(tweetId));
            dispatch(likeTweet(tweetId));
        } else {
            const replyId: string = (replyInfo.parentReply as IReply)._id;
            dispatch(setLoadingLikeR(replyId));
            dispatch(likeReply(replyId));
        }
    }

    const handleDeleteParent = (): void => {
        if (replyInfo.surfaceLevel) {
            const tweetId: string = (replyInfo.mainTweet as ITweet)._id;
            dispatch(deleteTweet(tweetId));
        } else {
            const replyId: string = (replyInfo.parentReply as IReply)._id;
            dispatch(deleteReply(replyId));
        }
    }

    const handleBookmarkParent = (): void => {
        if (replyInfo.surfaceLevel) {
            const tweetId: string = (replyInfo.mainTweet as ITweet)._id;
            dispatch(setLoadingBookmarkT(tweetId));
            dispatch(bookmarkTweet(tweetId));
        } else {
            const replyId: string = (replyInfo.parentReply as IReply)._id;
            dispatch(setLoadingBookmarkR(replyId));
            dispatch(bookmarkReply(replyId));
        }
    }

    const handleRetweetMain = (): void => {
        dispatch(setLoadingRetweetR(replyInfo._id));
        dispatch(retweetReply(replyInfo._id));
    }

    const handleLikeMain = (): void => {
        dispatch(setLoadingLikeR(replyInfo._id));
        dispatch(likeReply(replyInfo._id));
    }

    const handleDeleteMain = (): void => {
        dispatch(deleteReply(replyInfo._id));
    }

    const handleBookmarkMain = (): void => {
        dispatch(setLoadingBookmarkR(replyInfo._id));
        dispatch(bookmarkReply(replyInfo._id));
    }

    return (
        <>
            <div className="profile-reply">
                <div onClick={(event) => handleParentClick(event, "PARENT")} className="tweet__user reply__user profile-reply__parent">
                    <div className="reply__user-profile">
                        {parentElement && (
                            <>
                                <ProfilePicture
                                    user={parentElement.user}
                                    className="tweet__user-profile__img reply__user-profile__img"
                                />
                                <TweetInfo
                                    userInfo={parentElement.user}
                                    className="tweet__user-profile__info reply__user-profile__info"
                                />
                            </>
                        )}
                        <div className="reply__user-profile__line"></div>
                    </div>
                    <div className="tweet__user-details reply__user-details">
                        <div onClick={(event) => handleParentClick(event, "PARENT")} className="reply__user-details__container">
                            <div onClick={() => navigate(`/profile/${parentElement?.user?._id}`)}>
                                <p className="tweet__user-details__name reply__user-details__name">{parentElement?.user?.name}</p>
                                <p className="tweet__user-details__username reply__user-details__username">@{parentElement?.user?.username}</p>
                                <p className="tweet__user-details__date">&middot;</p>
                                <p className="tweet__user-details__date">{getFormattedDuration(parentElement?.createdAt!)}</p>
                            </div>
                            <div onClick={() => setMoreOptionsParentActive(true)} title="More" className="tweet__user-options reply__user-options">
                                <ThreeDotsIcon />
                            </div>
                        </div>
                        <p onClick={() => handleNavigation("PARENT")} className="tweet__description reply__description">{parentElement?.content}</p>
                        {parentElement?.file?.present && (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${parentElement?.file?.data}`}
                                className="tweet__image reply__image"
                                alt="Tweet Image"
                            />
                        )}
                        <div onClick={(event) => handleParentClick(event, "PARENT")} className={`home__tweets-tweet__details-interaction ${parentElement?.file.present ? "mt-sm" : ""}`}>
                            <div onClick={() => setReplyPopupActiveParent(true)} title="Reply" className="home__tweets-tweet__details-interaction__option--replies">
                                <div>
                                    <RepliesIcon />
                                </div>
                                {parentElement?.replies.length! > 0 && (
                                    <p>{parentElement?.replies.length}</p>
                                )}
                            </div>
                            <div onClick={handleRetweetParent} title="Repost" className={`home__tweets-tweet__details-interaction__option--retweets ${retweetedParent ? "home__tweets-tweet__details-interaction__option--retweets-active" : ""}`}>
                                <div>
                                    {((loadingTweetRetweetP.active || loadingReplyRetweet.active) && ((loadingTweetRetweetP.tweetId === parentElement?._id) || (loadingReplyRetweet.replyId === parentElement?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <RetweetsIcon
                                            fill={retweetedParent ? true : false}
                                        />
                                    )}
                                </div>
                                {parentElement?.retweets.length! > 0 && (
                                    <p>{parentElement?.retweets.length}</p>
                                )}
                            </div>
                            <div onClick={handleLikeParent} title="Like" className={`home__tweets-tweet__details-interaction__option--likes ${likedParent ? "home__tweets-tweet__details-interaction__option--likes-active" : ""}`}>
                                <div>
                                    {((loadingTweetLike.active || loadingReplyLike.active) && ((loadingTweetLike.tweetId === parentElement?._id) || (loadingReplyLike.replyId === parentElement?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <LikesIcon
                                            fill={likedParent ? true : false}
                                        />
                                    )}
                                </div>
                                {parentElement?.likes.length! > 0 && (
                                    <p>{parentElement?.likes.length}</p>
                                )}
                            </div>
                            <div onClick={handleBookmarkParent} title="Bookmark" className={`home__tweets-tweet__details-interaction__option--bookmarks ${bookmarkedParent ? "home__tweets-tweet__details-interaction__option--bookmarks-active" : ""}`}>
                                <div>
                                    {((loadingBookmarkReply.active || loadingBookmarkTweet.active) && ((loadingBookmarkReply.replyId === parentElement?._id) || (loadingBookmarkTweet.tweetId === parentElement?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <BookmarkIcon
                                            fill={bookmarkedParent ? true : false}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {moreOptionsParentActive && (
                        <MoreOptions
                            type={replyInfo.surfaceLevel ? "tweet" : "reply"}
                            details={parentElement!}
                            setMoreOptionsActive={setMoreOptionsParentActive}
                            handleDelete={handleDeleteParent}
                        />
                    )}
                </div>
                <div onClick={(event) => handleParentClick(event, "MAIN")} className="tweet__user reply__user profile-reply__main">
                    <div className="reply__user-profile">
                        <ProfilePicture
                            user={replyInfo.user}
                            className="tweet__user-profile__img reply__user-profile__img"
                        />
                        <TweetInfo
                            userInfo={replyInfo.user}
                            className="tweet__user-profile__info reply__user-profile__info"
                        />
                    </div>
                    <div className="tweet__user-details reply__user-details">
                        <div onClick={(event) => handleParentClick(event, "MAIN")} className="reply__user-details__container">
                            <div onClick={() => navigate(`/profile/${replyInfo.user._id}`)}>
                                <p className="tweet__user-details__name reply__user-details__name">{replyInfo?.user?.name}</p>
                                <p className="tweet__user-details__username reply__user-details__username">@{replyInfo?.user?.username}</p>
                                <p className="tweet__user-details__date">&middot;</p>
                                <p className="tweet__user-details__date">{getFormattedDuration(replyInfo.createdAt)}</p>
                            </div>
                            <div onClick={() => setMoreOptionsMainActive(true)} title="More" className="tweet__user-options reply__user-options">
                                <ThreeDotsIcon />
                            </div>
                        </div>
                        <p onClick={() => handleNavigation("MAIN")} className="tweet__description reply__description">{replyInfo?.content}</p>
                        {replyInfo?.file?.present && (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${replyInfo?.file?.data}`}
                                className="tweet__image reply__image"
                                alt="Tweet Image"
                            />
                        )}
                        <div onClick={(event) => handleParentClick(event, "MAIN")} className={`home__tweets-tweet__details-interaction ${replyInfo?.file.present ? "mt-sm" : ""}`}>
                            <div onClick={() => setReplyPopupActiveMain(true)} title="Reply" className="home__tweets-tweet__details-interaction__option--replies">
                                <div>
                                    <RepliesIcon />
                                </div>
                                {replyInfo?.replies.length! > 0 && (
                                    <p>{replyInfo?.replies.length}</p>
                                )}
                            </div>
                            <div onClick={handleRetweetMain} title="Repost" className={`home__tweets-tweet__details-interaction__option--retweets ${retweetedMain ? "home__tweets-tweet__details-interaction__option--retweets-active" : ""}`}>
                                <div>
                                    {((loadingTweetRetweetP.active || loadingReplyRetweet.active) && ((loadingTweetRetweetP.tweetId === replyInfo?._id) || (loadingReplyRetweet.replyId === replyInfo?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <RetweetsIcon
                                            fill={retweetedMain ? true : false}
                                        />
                                    )}
                                </div>
                                {replyInfo?.retweets.length! > 0 && (
                                    <p>{replyInfo?.retweets.length}</p>
                                )}
                            </div>
                            <div onClick={handleLikeMain} title="Like" className={`home__tweets-tweet__details-interaction__option--likes ${likedMain ? "home__tweets-tweet__details-interaction__option--likes-active" : ""}`}>
                                <div>
                                    {((loadingTweetLike.active || loadingReplyLike.active) && ((loadingTweetLike.tweetId === replyInfo?._id) || (loadingReplyLike.replyId === replyInfo?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <LikesIcon
                                            fill={likedMain ? true : false}
                                        />
                                    )}
                                </div>
                                {replyInfo?.likes.length! > 0 && (
                                    <p>{replyInfo?.likes.length}</p>
                                )}
                            </div>
                            <div onClick={handleBookmarkMain} title="Bookmark" className={`home__tweets-tweet__details-interaction__option--bookmarks ${bookmarkedMain ? "home__tweets-tweet__details-interaction__option--bookmarks-active" : ""}`}>
                                <div>
                                    {((loadingBookmarkTweet.active || loadingBookmarkReply.active) && ((loadingBookmarkTweet.tweetId === replyInfo?._id) || (loadingBookmarkReply.replyId === replyInfo?._id))) ? (
                                        <Spinner
                                            absolute={false}
                                            height="55%"
                                            width="55%"
                                        />
                                    ) : (
                                        <BookmarkIcon
                                            fill={bookmarkedMain ? true : false}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {moreOptionsMainActive && (
                        <MoreOptions
                            type="reply"
                            details={replyInfo}
                            setMoreOptionsActive={setMoreOptionsMainActive}
                            handleDelete={handleDeleteMain}
                        />
                    )}
                </div>
            </div>
            {(replyPopupActiveParent && parentElement) && (
                <ReplyPopup
                    key={parentElement._id}
                    setReplyPopupActive={setReplyPopupActiveParent}
                    type={replyInfo.surfaceLevel ? "tweet" : "reply"}
                    mainTweet={replyInfo.surfaceLevel ? parentElement._id : (typeof (parentElement as IReply).mainTweet === "string") ? ((parentElement as IReply).mainTweet as string) : ((parentElement as IReply).mainTweet as ITweet)._id}
                    target={parentElement}
                />
            )}
            {replyPopupActiveMain && (
                <ReplyPopup
                    key={replyInfo._id}
                    setReplyPopupActive={setReplyPopupActiveMain}
                    type="reply"
                    mainTweet={(replyInfo.mainTweet as ITweet)._id}
                    target={replyInfo}
                />
            )}
        </>
    )
}

export default ProfileReply;