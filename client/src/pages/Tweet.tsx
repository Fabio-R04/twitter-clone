import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getTweetDetails, likeTweet, retweetPost, deleteTweet } from "../features/tweet/tweetSlice";
import { ILikeTweet } from "../features/tweet/interfaces/likeInterface";
import { IUser } from "../features/auth/authInterfaces";
import { IRetweetPost } from "../features/tweet/interfaces/retweetInterface";
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
import { createReply } from "../features/reply/replySlice";
import CloseIcon from "../components/svg/CloseIcon";
import { IReply } from "../features/tweet/interfaces/replyInterface";
import TweetReply from "../components/tweet/TweetReply";
import MoreOptions from "../components/MoreOptions";
import { IBookmarkTweet } from "../features/bookmark/bookmarkInterfaces";
import { bookmarkTweet, setLoadingBookmarkT } from "../features/bookmark/bookmarkSlice";

function Tweet() {
    const [retweeted, setRetweeted] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [blobURL, setBlobURL] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const [replyActive, setReplyActive] = useState<boolean>(false);
    const [moreOptionsActive, setMoreOptionsActive] = useState<boolean>(false);
    const replyRef = useRef<HTMLTextAreaElement | null>(null);
    const { tweetId } = useParams();
    const {
        tweetDetails,
        loadingTweetDetails,
        loadingTweetLike,
        loadingTweetRetweetP
    } = useAppSelector((state) => state.tweet);
    const { user } = useAppSelector((state) => state.auth);
    const { loadingReplyCreate } = useAppSelector((state) => state.reply);
    const { loadingBookmarkTweet } = useAppSelector((state) => state.bookmark);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (tweetId) {
            dispatch(getTweetDetails(tweetId));
        }
    }, [tweetId]);

    useEffect(() => {
        if (replyRef.current) {
            const element: HTMLTextAreaElement = replyRef.current;
            element.style.height = "27px";
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [reply]);

    useEffect(() => {
        if (tweetDetails?.retweets) {
            if ((tweetDetails.retweets as IRetweetPost[]).find((retweet: IRetweetPost) => (retweet.user as IUser)._id === user?._id)) {
                setRetweeted(true);
            } else {
                setRetweeted(false);
            }
        }
    }, [tweetDetails?.retweets]);

    useEffect(() => {
        if (tweetDetails?.likes) {
            if ((tweetDetails.likes as ILikeTweet[]).find((like: ILikeTweet) => (like.user as IUser)._id === user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [tweetDetails?.likes]);

    useEffect(() => {
        if (tweetDetails?.bookmarks) {
            if ((tweetDetails.bookmarks as IBookmarkTweet[]).find((bookmark: IBookmarkTweet) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarked(true);
            } else {
                setBookmarked(false);
            }
        }
    }, [tweetDetails?.bookmarks]);

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

    const handleLike = (): void => {
        dispatch(likeTweet(tweetDetails?._id!));
    }

    const handleRetweet = (): void => {
        dispatch(retweetPost(tweetDetails?._id!));
    }

    const handleDelete = (): void => {
        dispatch(deleteTweet(tweetDetails?._id!));
    }

    const handleBookmark = (): void => {
        dispatch(setLoadingBookmarkT(tweetDetails?._id!));
        dispatch(bookmarkTweet(tweetDetails?._id!));
    }

    const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        dispatch(createReply({
            mainTweet: tweetDetails?._id!,
            content: reply,
            surfaceLevel: true,
            file
        }));
        setReply("");
        setFile(null);
        setBlobURL("");
    }

    return (
        <Layout>
            <div className="tweet">
                <header className="tweet__heading">
                    <div onClick={() => navigate(-1)} title="Back" className="tweet__heading-back">
                        <PrevIcon />
                    </div>
                    <p className="tweet__heading-name">Post</p>
                </header>
                {loadingTweetDetails ? (
                    <Spinner
                        absolute={false}
                        height="3rem"
                        width="3rem"
                        margin="2.5rem auto"
                    />
                ) : (
                    <>
                        <section className="tweet__details">
                            <div className="tweet__user">
                                <div className="tweet__user-profile">
                                    {tweetDetails && (
                                        <>
                                            <ProfilePicture
                                                user={tweetDetails.user}
                                                className="tweet__user-profile__img"
                                            />
                                            <TweetInfo
                                                userInfo={tweetDetails.user}
                                                className="tweet__user-profile__info"
                                            />
                                        </>
                                    )}
                                </div>
                                <div onClick={() => navigate(`/profile/${tweetDetails?.user?._id}`)} className="tweet__user-details">
                                    <p className="tweet__user-details__name">{tweetDetails?.user?.name}</p>
                                    <p className="tweet__user-details__username">@{tweetDetails?.user?.username}</p>
                                </div>
                                <div onClick={() => setMoreOptionsActive(true)} title="More" className="tweet__user-options">
                                    <ThreeDotsIcon />
                                </div>
                            </div>
                            <p className="tweet__description">{tweetDetails?.content}</p>
                            {tweetDetails?.file?.present && (
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${tweetDetails?.file?.data}`}
                                    className="tweet__image"
                                    alt="Tweet Image"
                                />
                            )}
                            <p className="tweet__info">
                                {moment(tweetDetails?.createdAt).format("h:mm A")} &middot; {moment(tweetDetails?.createdAt).format("MMM D, YYYY")}
                            </p>
                            <Link to={`/engagements/${tweetDetails?._id}/retweets/tweet`} className="tweet__engagements">
                                <EngagementsIcon />
                                <p>View post engagements</p>
                            </Link>
                            <div className="tweet__interaction">
                                <div title="Reply" className="tweet__interaction-option tweet__interaction-option--replies">
                                    <div className="tweet__interaction-option__container">
                                        <RepliesIcon />
                                    </div>
                                    <p className="tweet__interaction-option__amount">{tweetDetails?.replies.length}</p>
                                </div>
                                <div onClick={handleRetweet} title="Repost" className={`tweet__interaction-option tweet__interaction-option--retweets ${retweeted ? "tweet__interaction-option--retweets-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {loadingTweetRetweetP.active ? (
                                            <Spinner
                                                absolute={false}
                                                height="55%"
                                                width="55%"
                                            />
                                        ) : (
                                            <RetweetsIcon
                                                fill={retweeted ? true : false}
                                            />
                                        )}
                                    </div>
                                    <p className="tweet__interaction-option__amount">{tweetDetails?.retweets.length}</p>
                                </div>
                                <div onClick={handleLike} title="Like" className={`tweet__interaction-option tweet__interaction-option--likes ${liked ? "tweet__interaction-option--likes-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {loadingTweetLike.active ? (
                                            <Spinner
                                                absolute={false}
                                                height="55%"
                                                width="55%"
                                            />
                                        ) : (
                                            <LikesIcon
                                                fill={liked ? true : false}
                                            />
                                        )}
                                    </div>
                                    <p className="tweet__interaction-option__amount">{tweetDetails?.likes.length}</p>
                                </div>
                                <div onClick={handleBookmark} title="Bookmark" className={`tweet__interaction-option tweet__interaction-option--bookmarks ${bookmarked ? "tweet__interaction-option--bookmarks-active" : ""}`}>
                                    <div className="tweet__interaction-option__container">
                                        {loadingBookmarkTweet.active ? (
                                            <Spinner
                                                absolute={false}
                                                height="55%"
                                                width="55%"
                                            />
                                        ) : (
                                            <BookmarkIcon
                                                fill={bookmarked ? true : false}
                                            />
                                        )}
                                    </div>
                                    <p className="tweet__interaction-option__amount">{tweetDetails?.bookmarks.length}</p>
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
                                            <p className="tweet__form-content__replying">Replying to <span>@{tweetDetails?.user?.username}</span></p>
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
                            {moreOptionsActive && (
                                <MoreOptions
                                    type="tweet"
                                    details={tweetDetails!}
                                    setMoreOptionsActive={setMoreOptionsActive}
                                    handleDelete={handleDelete}
                                />
                            )}
                        </section>
                        <section className="tweet__replies">
                            {tweetDetails && [...tweetDetails.replies]
                                .sort((a, b) => new Date((b as IReply).createdAt).valueOf() - new Date((a as IReply).createdAt).valueOf())
                                .map((r) => {
                                    const reply: IReply = (r as IReply);
                                    return (
                                        <TweetReply
                                            key={reply._id}
                                            reply={reply}
                                        />
                                    )
                                })}
                        </section>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Tweet;