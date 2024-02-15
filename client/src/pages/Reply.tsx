import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { likeTweet, retweetPost, deleteTweet, setLoadingLikeId, setLoadingRetweetPId } from "../features/tweet/tweetSlice";
import { follow } from "../features/auth/authSlice";
import { ILikeReply, ILikeTweet } from "../features/tweet/interfaces/likeInterface";
import { IUser } from "../features/auth/authInterfaces";
import { IRetweetPost, IRetweetReply } from "../features/tweet/interfaces/retweetInterface";
import Layout from "../components/layout/Layout";
import PrevIcon from "../components/svg/PrevIcon";
import ProfilePicture from "../components/layout/ProfilePicture";
import ThreeDotsIcon from "../components/layout/svg/ThreeDotsIcon";
import moment from "moment";
import Spinner from "../components/pending/Spinner";
import RepliesIcon from "../components/home/svg/RepliesIcon";
import RetweetsIcon from "../components/home/svg/RetweetsIcon";
import LikesIcon from "../components/home/svg/LikesIcon";
import BookmarkIcon from "../components/layout/svg/BookmarkIcon";
import EmojiIcon from "../components/home/svg/EmojiIcon";
import GifIcon from "../components/home/svg/GifIcon";
import LocationIcon from "../components/home/svg/LocationIcon";
import MediaIcon from "../components/home/svg/MediaIcon";
import EngagementsIcon from "../components/home/svg/EngagementsIcon";
import TweetInfo from "../components/TweetInfo";
import {
    createReplyR,
    deleteReply,
    getReplyDetails,
    likeReply,
    retweetReply,
    setLoadingLikeR,
    setLoadingRetweetR
} from "../features/reply/replySlice";
import CloseIcon from "../components/svg/CloseIcon";
import { IReply } from "../features/tweet/interfaces/replyInterface";
import TweetReply from "../components/tweet/TweetReply";
import { ITweet } from "../features/tweet/interfaces/tweetInterface";
import MoreOptions from "../components/MoreOptions";
import { IBookmarkReply, IBookmarkTweet } from "../features/bookmark/bookmarkInterfaces";
import { bookmarkReply, bookmarkTweet, setLoadingBookmarkR, setLoadingBookmarkT } from "../features/bookmark/bookmarkSlice";

type ParentRetweets = IRetweetPost | IRetweetReply;
type ParentLikes = ILikeTweet | ILikeReply;
type ParentBookmarks = IBookmarkTweet | IBookmarkReply;

export interface ReplyData {
    type?: string;
    mainTweet: string;
    parentReply?: string;
    surfaceLevel: boolean;
    content: string;
    file: File | null;
}

function Reply() {
    const [parentElement, setParentElement] = useState<ITweet | IReply | null>(null);
    const [retweetedParent, setRetweetedParent] = useState<boolean>(false);
    const [likedParent, setLikedParent] = useState<boolean>(false);
    const [bookmarkedParent, setBookmarkedParent] = useState<boolean>(false);
    const [retweetedMain, setRetweetedMain] = useState<boolean>(false);
    const [likedMain, setLikedMain] = useState<boolean>(false);
    const [bookmarkedMain, setBookmarkedMain] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [blobURL, setBlobURL] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const [replyActive, setReplyActive] = useState<boolean>(false);
    const [moreOptionsParentActive, setMoreOptionsParentActive] = useState<boolean>(false);
    const [moreOptionsMainActive, setMoreOptionsMainActive] = useState<boolean>(false);
    const replyRef = useRef<HTMLTextAreaElement | null>(null);
    const { replyId } = useParams();
    const {
        loadingTweetLike,
        loadingTweetRetweetP
    } = useAppSelector((state) => state.tweet);
    const {
        replyDetails,
        loadingReplyDetails,
        loadingReplyCreate,
        loadingReplyLike,
        loadingReplyRetweet
    } = useAppSelector((state) => state.reply);
    const {
        loadingBookmarkTweet,
        loadingBookmarkReply
    } = useAppSelector((state) => state.bookmark);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (replyId) {
            dispatch(getReplyDetails(replyId));
        }
    }, [replyId]);

    useEffect(() => {
        if (replyRef.current) {
            const element: HTMLTextAreaElement = replyRef.current;
            element.style.height = "27px";
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [reply]);

    useEffect(() => {
        if (parentElement && parentElement.retweets) {
            if ((parentElement.retweets as ParentRetweets[]).find((element: ParentRetweets) => (element.user as IUser)._id === user?._id)) {
                setRetweetedParent(true);
            } else {
                setRetweetedParent(false);
            }
        }
    }, [parentElement, parentElement?.retweets]);

    useEffect(() => {
        if (parentElement && parentElement.likes) {
            if ((parentElement.likes as ParentLikes[]).find((element: ParentLikes) => (element.user as IUser)._id === user?._id)) {
                setLikedParent(true);
            } else {
                setLikedParent(false);
            }
        }
    }, [parentElement, parentElement?.likes]);

    useEffect(() => {
        if (parentElement && parentElement.bookmarks) {
            if ((parentElement.bookmarks as ParentBookmarks[]).find((element: ParentBookmarks) => (element.user as IUser)._id === user?._id)) {
                setBookmarkedParent(true);
            } else {
                setBookmarkedParent(false);
            }
        }
    }, [parentElement, parentElement?.bookmarks]);

    useEffect(() => {
        if (replyDetails?.retweets) {
            if ((replyDetails.retweets as IRetweetReply[]).find((retweet: IRetweetReply) => (retweet.user as IUser)._id === user?._id)) {
                setRetweetedMain(true);
            } else {
                setRetweetedMain(false);
            }
        }
    }, [replyDetails?.retweets]);

    useEffect(() => {
        if (replyDetails?.likes) {
            if ((replyDetails.likes as ILikeReply[]).find((like: ILikeReply) => (like.user as IUser)._id === user?._id)) {
                setLikedMain(true);
            } else {
                setLikedMain(false);
            }
        }
    }, [replyDetails?.likes]);

    useEffect(() => {
        if (replyDetails?.bookmarks) {
            if ((replyDetails.bookmarks as IBookmarkReply[]).find((bookmark: IBookmarkReply) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarkedMain(true);
            } else {
                setBookmarkedMain(false);
            }
        }
    }, [replyDetails?.bookmarks]);

    useEffect(() => {
        if (replyDetails && (replyDetails.surfaceLevel === true)) {
            setParentElement((replyDetails.mainTweet as ITweet));
        } else if (replyDetails && (replyDetails.surfaceLevel === false)) {
            setParentElement((replyDetails.parentReply as IReply));
        }
    }, [replyDetails, replyDetails?.surfaceLevel]);

    const handleReplyChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setReply(event.target.value);
    }

    const handleFileClick = (): void => {
        const fileInput: HTMLInputElement = document.querySelector("#tweet__file") as HTMLInputElement;
        fileInput.value = "";
        fileInput.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const file: File = event.target.files[0];
            const url: string = URL.createObjectURL(file);

            setFile(file);
            setBlobURL(url);
        }
    }

    const handleLikeParent = (): void => {
        if (replyDetails && parentElement) {
            if (replyDetails.surfaceLevel === true) {
                dispatch(setLoadingLikeId(parentElement._id));
                dispatch(likeTweet(parentElement._id));
            } else if (replyDetails.surfaceLevel === false) {
                dispatch(setLoadingLikeR(parentElement._id));
                dispatch(likeReply(parentElement._id));
            }
        }
    }

    const handleRetweetParent = (): void => {
        if (replyDetails && parentElement) {
            if (replyDetails.surfaceLevel === true) {
                dispatch(setLoadingRetweetPId(parentElement._id));
                dispatch(retweetPost(parentElement._id));
            } else if (replyDetails.surfaceLevel === false) {
                dispatch(setLoadingRetweetR(parentElement._id));
                dispatch(retweetReply(parentElement._id));
            }
        }
    }

    const handleBookmarkParent = (): void => {
        if (replyDetails && parentElement) {
            if (replyDetails.surfaceLevel === true) {
                dispatch(setLoadingBookmarkT(parentElement._id));
                dispatch(bookmarkTweet(parentElement._id));
            } else if (replyDetails.surfaceLevel === false) {
                dispatch(setLoadingBookmarkR(parentElement._id));
                dispatch(bookmarkReply(parentElement._id));
            }
        }
    }

    const handleLikeMain = (): void => {
        if (replyDetails) {
            dispatch(setLoadingLikeR(replyDetails._id));
            dispatch(likeReply(replyDetails._id));
        }
    }

    const handleRetweetMain = (): void => {
        if (replyDetails) {
            dispatch(setLoadingRetweetR(replyDetails._id));
            dispatch(retweetReply(replyDetails._id));
        }
    }

    const handleBookmarkMain = (): void => {
        if (replyDetails) {
            dispatch(setLoadingBookmarkR(replyDetails._id));
            dispatch(bookmarkReply(replyDetails._id));
        }
    }

    const handleDeleteParent = (): void => {
        if (replyDetails) {
            if (replyDetails.surfaceLevel === true) {
                dispatch(deleteTweet((replyDetails.mainTweet as ITweet)._id));
            } else if (replyDetails.surfaceLevel === false) {
                dispatch(deleteReply((replyDetails.parentReply as IReply)._id));
            }
        }
    }

    const handleDeleteMain = (): void => {
        if (replyDetails) {
            dispatch(deleteReply(replyDetails._id));
        }
    }

    const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (replyDetails) {
            dispatch(createReplyR({
                type: "DIRECT",
                mainTweet: (replyDetails.mainTweet as ITweet)._id,
                content: reply,
                parentReply: replyDetails._id,
                surfaceLevel: false,
                file
            }));
            setReply("");
            setFile(null);
            setBlobURL("");
        }
    }

    return (
        <Layout>
            <div className="tweet reply">
                <header className="tweet__heading reply__heading">
                    <div onClick={() => navigate(-1)} title="Back" className="tweet__heading-back reply__heading-back">
                        <PrevIcon />
                    </div>
                    <p className="tweet__heading-name reply__heading-name">Post</p>
                </header>
                <section className="tweet__details reply__details">
                    {loadingReplyDetails ? (
                        <Spinner
                            absolute={false}
                            height="3rem"
                            width="3rem"
                            margin="2.5rem auto"
                        />
                    ) : (
                        <>
                            <div className="tweet__user reply__user">
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
                                    <div className="reply__user-details__container">
                                        <div onClick={() => navigate(`/profile/${parentElement?.user?._id}`)}>
                                            <p className="tweet__user-details__name reply__user-details__name">{parentElement?.user?.name}</p>
                                            <p className="tweet__user-details__username reply__user-details__username">@{parentElement?.user?.username}</p>
                                        </div>
                                        <div onClick={() => setMoreOptionsParentActive(true)} title="More" className="tweet__user-options reply__user-options">
                                            <ThreeDotsIcon />
                                        </div>
                                    </div>
                                    <p className="tweet__description reply__description">{parentElement?.content}</p>
                                    {parentElement?.file?.present && (
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}/uploads/${parentElement?.file?.data}`}
                                            className="tweet__image reply__image"
                                            alt="Tweet Image"
                                        />
                                    )}
                                    <div className={`home__tweets-tweet__details-interaction ${parentElement?.file.present ? "mt-sm" : ""}`}>
                                        <div title="Reply" className="home__tweets-tweet__details-interaction__option--replies">
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
                                                {((loadingBookmarkTweet.active || loadingBookmarkReply.active) && ((loadingBookmarkTweet.tweetId === parentElement?._id) || (loadingBookmarkReply.replyId === parentElement?._id))) ? (
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
                            </div>
                            <div className="tweet__user reply__user reply__main">
                                <div className="reply__user-profile">
                                    {replyDetails && (
                                        <>
                                            <ProfilePicture
                                                user={replyDetails.user}
                                                className="tweet__user-profile__img reply__user-profile__img"
                                            />
                                            <TweetInfo
                                                userInfo={replyDetails.user}
                                                className="tweet__user-profile__info reply__user-profile__info"
                                            />
                                        </>
                                    )}
                                </div>
                                <div onClick={() => navigate(`/profile/${replyDetails?.user?._id}`)} className="tweet__user-details reply__user-details">
                                    <p className="tweet__user-details__name reply__user-details__name">{replyDetails?.user?.name}</p>
                                    <p className="tweet__user-details__username reply__user-details__username">@{replyDetails?.user?.username}</p>
                                </div>
                                <div onClick={() => setMoreOptionsMainActive(true)} title="More" className="tweet__user-options reply__user-options">
                                    <ThreeDotsIcon />
                                </div>
                                {moreOptionsMainActive && (
                                    <MoreOptions
                                        type="reply"
                                        details={replyDetails!}
                                        setMoreOptionsActive={setMoreOptionsMainActive}
                                        handleDelete={handleDeleteMain}

                                    />
                                )}
                            </div>
                            <p className="tweet__description">{replyDetails?.content}</p>
                            {replyDetails?.file?.present && (
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${replyDetails?.file?.data}`}
                                    className="tweet__image"
                                    alt="Tweet Image"
                                />
                            )}
                            <p className="tweet__info reply__info">
                                {moment(replyDetails?.createdAt).format("h:mm A")} &middot; {moment(replyDetails?.createdAt).format("MMM D, YYYY")}
                            </p>
                            <Link to={`/engagements/${replyDetails?._id}/retweets/reply`} className="tweet__engagements reply__engagements">
                                <EngagementsIcon />
                                <p>View post engagements</p>
                            </Link>
                            <div className="tweet__interaction reply__interaction">
                                <div title="Reply" className="tweet__interaction-option tweet__interaction-option--replies">
                                    <div className="tweet__interaction-option__container">
                                        <RepliesIcon />
                                    </div>
                                    <p className="tweet__interaction-option__amount">{replyDetails?.replies.length}</p>
                                </div>
                                <div onClick={handleRetweetMain} title="Repost" className={`tweet__interaction-option tweet__interaction-option--retweets ${retweetedMain ? "tweet__interaction-option--retweets-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {(loadingReplyRetweet.active && (loadingReplyRetweet.replyId === replyDetails?._id)) ? (
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
                                    <p className="tweet__interaction-option__amount">{replyDetails?.retweets.length}</p>
                                </div>
                                <div onClick={handleLikeMain} title="Like" className={`tweet__interaction-option tweet__interaction-option--likes ${likedMain ? "tweet__interaction-option--likes-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {(loadingReplyLike.active && (loadingReplyLike.replyId === replyDetails?._id)) ? (
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
                                    <p className="tweet__interaction-option__amount">{replyDetails?.likes.length}</p>
                                </div>
                                <div onClick={handleBookmarkMain} title="Bookmark" className={`tweet__interaction-option tweet__interaction-option--bookmarks ${bookmarkedMain ? "tweet__interaction-option--bookmarks-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {(loadingBookmarkReply.active && (loadingBookmarkReply.replyId === replyDetails?._id)) ? (
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
                                    <p className="tweet__interaction-option__amount">{replyDetails?.bookmarks.length}</p>
                                </div>
                            </div>
                            <form onSubmit={handleReplySubmit} className={`tweet__form ${replyActive ? "tweet__form-active" : ""}`}>
                                <div className="tweet__form-profile">
                                    <ProfilePicture
                                        user={user!}
                                        className="tweet__form-profile__image"
                                    />
                                </div>
                                <div onClick={() => setReplyActive(true)} className="tweet__form-content">
                                    <div className="tweet__form-content__container">
                                        {replyActive && (
                                            <p className="tweet__form-content__replying">Replying to <span>@{replyDetails?.user?.username}</span></p>
                                        )}
                                        <textarea
                                            onFocus={() => setReplyActive(true)}
                                            ref={replyRef}
                                            value={reply}
                                            onChange={handleReplyChange}
                                            className="tweet__form-content__reply"
                                            placeholder="Post your reply"
                                            maxLength={280}
                                            minLength={0}
                                        />
                                        {(file && blobURL) && (
                                            <div className="tweet__form-content__preview">
                                                <img
                                                    src={blobURL}
                                                    alt="File Preview"
                                                    className="tweet__form-content__preview-image"
                                                />
                                                <div onClick={() => {
                                                    setFile(null);
                                                    setBlobURL("");
                                                }} title="Remove" className="tweet__form-content__preview-remove">
                                                    <CloseIcon />
                                                </div>
                                            </div>
                                        )}
                                        <div className="tweet__form-content__media-container">
                                            {replyActive && (
                                                <div className="home__form-content__options tweet__form-content__media">
                                                    <div onClick={handleFileClick} title="Media">
                                                        <MediaIcon />
                                                        <input
                                                            type="file"
                                                            id="tweet__file"
                                                            onChange={handleFileChange}
                                                            hidden={true}
                                                            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
                                                        />
                                                    </div>
                                                    <div title="GIF">
                                                        <GifIcon />
                                                    </div>
                                                    <div title="Emoji">
                                                        <EmojiIcon />
                                                    </div>
                                                    <div title="Location">
                                                        <LocationIcon />
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                className="tweet__form-content__button"
                                                disabled={reply.trim().length > 0 ? false : true}
                                            >
                                                {loadingReplyCreate ? (
                                                    <Spinner
                                                        absolute={false}
                                                        height="1.4rem"
                                                        width="1.4rem"
                                                    />
                                                ) : (
                                                    "Reply"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                    {moreOptionsParentActive && (
                        <MoreOptions
                            type={replyDetails?.surfaceLevel ? "tweet" : "reply"}
                            details={parentElement!}
                            setMoreOptionsActive={setMoreOptionsParentActive}
                            handleDelete={handleDeleteParent}
                        />
                    )}
                </section>
                <section className="tweet__replies">
                    {replyDetails?.replies.map((r) => {
                        const reply: IReply = (r as IReply);
                        return (
                            <TweetReply
                                key={reply._id}
                                reply={reply}
                            />
                        )
                    })}
                </section>
            </div>
        </Layout>
    )
}

export default Reply;