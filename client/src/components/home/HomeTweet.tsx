import React, { useState, useEffect, useRef, RefObject, LegacyRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { ITweet } from "../../features/tweet/interfaces/tweetInterface";
import { IUser } from "../../features/auth/authInterfaces";
import { getFormattedDuration } from "../../reusable";
import ProfilePicture from "../layout/ProfilePicture";
import ThreeDotsIcon from "../layout/svg/ThreeDotsIcon";
import RepliesIcon from "./svg/RepliesIcon";
import RetweetsIcon from "./svg/RetweetsIcon";
import LikesIcon from "./svg/LikesIcon";
import BookmarkIcon from "../layout/svg/BookmarkIcon";
import FollowIcon from "./svg/FollowIcon";
import UnfollowIcon from "./svg/UnfollowIcon";
import DeleteIcon from "./svg/DeleteIcon";
import TweetInfo from "../TweetInfo";
import { deleteTweet, likeTweet, retweetPost, setLoadingLikeId, setLoadingRetweetPId } from "../../features/tweet/tweetSlice";
import { ILikeTweet } from "../../features/tweet/interfaces/likeInterface";
import Spinner from "../pending/Spinner";
import { IRetweetPost } from "../../features/tweet/interfaces/retweetInterface";
import EngagementsIcon from "./svg/EngagementsIcon";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { follow, resetAuth, setLoadingFollow } from "../../features/auth/authSlice";
import ReplyPopup from "./ReplyPopup";
import { bookmarkTweet, setLoadingBookmarkT } from "../../features/bookmark/bookmarkSlice";
import { IBookmarkTweet } from "../../features/bookmark/bookmarkInterfaces";

interface HomeTweetProps {
    tweet: ITweet;
    ref?: LegacyRef<HTMLDivElement>;
}

export interface MoreOptions {
    username: string;
    userId: string;
    active: boolean;
}

export interface RetweetData {
    type: string;
    id: string;
}

const HomeTweet = React.forwardRef(({ tweet }: HomeTweetProps, ref) => {
    const [replyPopupActive, setReplyPopupActive] = useState<boolean>(false);
    const [retweeted, setRetweeted] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(false);
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    const [moreOptions, setMoreOptions] = useState<MoreOptions>({
        username: "",
        userId: "",
        active: false
    });
    const {
        loadingTweetLike,
        loadingTweetRetweetP,
        loadingTweetDelete
    } = useAppSelector((state) => state.tweet);
    const {
        user,
        loadingAuthFollow,
        successAuth,
        messageAuth
    } = useAppSelector((state) => state.auth);
    const {
        loadingBookmarkTweet
    } = useAppSelector((state) => state.bookmark);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (tweet.retweets) {
            if ((tweet.retweets as IRetweetPost[]).find((retweet: IRetweetPost) => (retweet.user as IUser)._id === user?._id)) {
                setRetweeted(true);
            } else {
                setRetweeted(false);
            }
        }
    }, [tweet.retweets]);

    useEffect(() => {
        if (tweet.likes) {
            if ((tweet.likes as ILikeTweet[]).find((like: ILikeTweet) => (like.user as IUser)._id === user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [tweet.likes]);

    useEffect(() => {
        if (tweet.bookmarks) {
            if ((tweet.bookmarks as IBookmarkTweet[]).find((bookmark: IBookmarkTweet) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarked(true);
            } else {
                setBookmarked(false);
            }
        }
    }, [tweet.bookmarks]);

    useEffect(() => {
        if (successAuth && (messageAuth === "TWEET DELETED")) {
            setMoreOptions({
                username: "",
                userId: "",
                active: false
            });
        }
        dispatch(resetAuth());
    }, [successAuth, messageAuth, dispatch]);

    const handleTweetLike = (): void => {
        dispatch(setLoadingLikeId(tweet._id));
        dispatch(likeTweet(tweet._id));
    }

    const handleTweetRetweet = (): void => {
        dispatch(setLoadingRetweetPId(tweet._id));
        dispatch(retweetPost(tweet._id));
    }

    const handleTweetRemoval = (): void => {
        dispatch(deleteTweet(tweet._id));
    }

    const handleFollow = (): void => {
        dispatch(setLoadingFollow(tweet.user._id));
        dispatch(follow(tweet.user._id));
    }

    const handleBookmark = (): void => {
        dispatch(setLoadingBookmarkT(tweet._id));
        dispatch(bookmarkTweet(tweet._id));
    }

    const handleTweetParentClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        const parent = event.currentTarget;
        const target = event.target;

        if (target === parent) {
            handleTweetNavigation();
        }
    }

    const handleTweetNavigation = (): void => {
        navigate(`/tweet/${tweet._id}`);
    }

    return (
        <>
            <div
                className="home__tweets-tweet"
                onClick={handleTweetParentClick}
                ref={ref as any}
            >
                <div className="home__tweets-tweet__left">
                    {(tweet.retweeted !== undefined) && (
                        <div className="home__tweets-tweet__retweeted">
                            <RetweetsIcon />
                        </div>
                    )}
                    <div className="home__tweets-tweet__profile">
                        <ProfilePicture
                            user={tweet.user}
                        />
                        <TweetInfo
                            userInfo={tweet.user}
                            className="home__tweets-info"
                        />
                    </div>
                </div>
                <div onClick={handleTweetParentClick} className="home__tweets-tweet__details">
                    {(tweet.retweeted !== undefined) && (
                        <p className="home__tweets-tweet__details-retweeted">
                            You reposted
                        </p>
                    )}
                    <div onClick={handleTweetParentClick} className="home__tweets-tweet__details-top">
                        <div className="home__tweets-tweet__details-top__user">
                            <div>
                                <p onClick={() => navigate(`/profile/${tweet.user._id}`)}>{(tweet.user as IUser).name}</p>
                                <p onClick={() => navigate(`/profile/${tweet.user._id}`)}>@{(tweet.user as IUser).username}</p>
                                <p>&middot;</p>
                                <p>{getFormattedDuration(((tweet.retweeted !== undefined) || (location.pathname.startsWith("/profile") && location.pathname.endsWith("/likes")) || (location.pathname === "/bookmarks")) ? tweet.originalCreatedAt! : tweet.createdAt)}</p>
                            </div>
                            <p className="home__tweets-tweet__details-top__user-content" onClick={handleTweetNavigation}>{tweet.content}</p>
                        </div>
                        <div onClick={() => setMoreOptions({
                            active: true,
                            username: tweet.user.username,
                            userId: tweet.user._id
                        })} title="More" className="home__tweets-tweet__details-top__options">
                            <ThreeDotsIcon />
                        </div>
                    </div>
                    {tweet.file.present && (
                        <div onClick={handleTweetNavigation} style={{ marginTop: "0" }} className="home__form-content__preview">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${tweet.file.data}`}
                                alt="File"
                            />
                        </div>
                    )}
                    <div onClick={handleTweetParentClick} className="home__tweets-tweet__details-interaction">
                        <div onClick={() => setReplyPopupActive(true)} title="Reply" className="home__tweets-tweet__details-interaction__option--replies">
                            <div>
                                <RepliesIcon />
                            </div>
                            {tweet.replies.length > 0 && (
                                <p>{tweet.replies.length}</p>
                            )}
                        </div>
                        <div title="Repost" onClick={handleTweetRetweet} className={`home__tweets-tweet__details-interaction__option--retweets ${retweeted ? "home__tweets-tweet__details-interaction__option--retweets-active" : ""}`}>
                            <div>
                                {(loadingTweetRetweetP.active && (loadingTweetRetweetP.tweetId === tweet._id)) ? (
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
                            {tweet.retweets.length > 0 && (
                                <p>{tweet.retweets.length}</p>
                            )}
                        </div>
                        <div title="Like" onClick={handleTweetLike} className={`home__tweets-tweet__details-interaction__option--likes ${liked ? "home__tweets-tweet__details-interaction__option--likes-active" : ""}`}>
                            <div>
                                {(loadingTweetLike.active && (loadingTweetLike.tweetId === tweet._id)) ? (
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
                            {tweet.likes.length > 0 && (
                                <p>{tweet.likes.length}</p>
                            )}
                        </div>
                        <div title="Bookmark" onClick={handleBookmark} className={`home__tweets-tweet__details-interaction__option--bookmarks ${bookmarked ? "home__tweets-tweet__details-interaction__option--bookmarks-active" : ""}`}>
                            <div>
                                {(loadingBookmarkTweet.active && (loadingBookmarkTweet.tweetId === tweet._id)) ? (
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
                        </div>
                    </div>
                </div>
                {moreOptions.active && (
                    <div className="home__tweets-more">
                        {tweet.user._id === user?._id ? (
                            <div onClick={handleTweetRemoval} className="home__tweets-more__delete">
                                {loadingTweetDelete ? (
                                    <Spinner
                                        absolute={false}
                                        height="1.8rem"
                                        width="1.8rem"
                                    />
                                ) : (
                                    <DeleteIcon />
                                )}
                                <p>Delete</p>
                            </div>
                        ) : (
                            tweet.user.followersLookup[user?._id!] ? (
                                <div onClick={handleFollow} className="home__tweets-more__interact">
                                    {(loadingAuthFollow.active && (loadingAuthFollow.userId === tweet.user._id)) ? (
                                        <Spinner
                                            absolute={false}
                                            height="1.8rem"
                                            width="1.8rem"
                                        />
                                    ) : (
                                        <UnfollowIcon />
                                    )}
                                    <p>Unfollow @{moreOptions.username}</p>
                                </div>
                            ) : (
                                <div onClick={handleFollow} className="home__tweets-more__interact">
                                    {(loadingAuthFollow.active && (loadingAuthFollow.userId === tweet.user._id)) ? (
                                        <Spinner
                                            absolute={false}
                                            height="1.8rem"
                                            width="1.8rem"
                                        />
                                    ) : (
                                        <FollowIcon />
                                    )}
                                    <p>Follow @{moreOptions.username}</p>
                                </div>
                            )
                        )}
                        <Link to={`/engagements/${tweet._id}/retweets/tweet`} className="home__tweets-more__engagements">
                            <EngagementsIcon />
                            <p>View post engagements</p>
                        </Link>
                    </div>
                )}
            </div>
            {moreOptions.active && (
                <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    const target = event.target as HTMLDivElement;
                    if (target.id === "home__tweets-more__container") {
                        setMoreOptions({
                            active: false,
                            username: "",
                            userId: ""
                        });
                    }
                }} className="home__tweets-more__container" id="home__tweets-more__container"></div>
            )}
            {replyPopupActive && (
                <ReplyPopup
                    key={tweet._id}
                    setReplyPopupActive={setReplyPopupActive}
                    mainTweet={tweet._id}
                    target={tweet}
                    type="tweet"
                />
            )}
        </>
    )
})

export default HomeTweet;