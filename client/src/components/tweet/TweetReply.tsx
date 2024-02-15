import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { IUser } from "../../features/auth/authInterfaces";
import { getFormattedDuration } from "../../reusable";
import ProfilePicture from "../layout/ProfilePicture";
import ThreeDotsIcon from "../layout/svg/ThreeDotsIcon";
import TweetInfo from "../TweetInfo";
import { ILikeReply } from "../../features/tweet/interfaces/likeInterface";
import Spinner from "../pending/Spinner";
import { IRetweetReply } from "../../features/tweet/interfaces/retweetInterface";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { follow, resetAuth, setLoadingFollow } from "../../features/auth/authSlice";
import DeleteIcon from "../home/svg/DeleteIcon";
import EngagementsIcon from "../home/svg/EngagementsIcon";
import FollowIcon from "../home/svg/FollowIcon";
import LikesIcon from "../home/svg/LikesIcon";
import RepliesIcon from "../home/svg/RepliesIcon";
import RetweetsIcon from "../home/svg/RetweetsIcon";
import UnfollowIcon from "../home/svg/UnfollowIcon";
import BookmarkIcon from "../layout/svg/BookmarkIcon";
import { IReply } from "../../features/tweet/interfaces/replyInterface";
import { deleteReply, likeReply, retweetReply, setLoadingLikeR, setLoadingRetweetR } from "../../features/reply/replySlice";
import ReplyPopup from "../home/ReplyPopup";
import { ITweet } from "../../features/tweet/interfaces/tweetInterface";
import { bookmarkReply, setLoadingBookmarkR } from "../../features/bookmark/bookmarkSlice";
import { IBookmarkReply } from "../../features/bookmark/bookmarkInterfaces";

interface TweetReplyProps {
    reply: IReply;
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

function TweetReply({ reply }: TweetReplyProps) {
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
        loadingReplyLike,
        loadingReplyRetweet,
        loadingReplyDelete
    } = useAppSelector((state) => state.reply);
    const {
        user,
        loadingAuthFollow,
        successAuth,
        messageAuth
    } = useAppSelector((state) => state.auth);
    const {
        loadingBookmarkReply
    } = useAppSelector((state) => state.bookmark);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (reply.retweets) {
            if ((reply.retweets as IRetweetReply[]).find((retweet: IRetweetReply) => (retweet.user as IUser)._id === user?._id)) {
                setRetweeted(true);
            } else {
                setRetweeted(false);
            }
        }
    }, [reply.retweets]);

    useEffect(() => {
        if (reply.likes) {
            if ((reply.likes as ILikeReply[]).find((like: ILikeReply) => (like.user as IUser)._id === user?._id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [reply.likes]);

    useEffect(() => {
        if (reply.bookmarks) {
            if ((reply.bookmarks as IBookmarkReply[]).find((bookmark: IBookmarkReply) => (bookmark.user as IUser)._id === user?._id)) {
                setBookmarked(true);
            } else {
                setBookmarked(false);
            }
        }
    }, [reply.bookmarks]);

    useEffect(() => {
        if (successAuth && (messageAuth === "REPLY DELETED")) {
            setMoreOptions({
                username: "",
                userId: "",
                active: false
            });
        }
        dispatch(resetAuth());
    }, [successAuth, messageAuth, dispatch]);

    const handleFollow = (): void => {
        dispatch(setLoadingFollow(reply.user._id));
        dispatch(follow(reply.user._id));
    }

    const handleReplyParentClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        const parent = event.currentTarget;
        const target = event.target;

        if (target === parent) {
            handleReplyNavigation();
        }
    }

    const handleReplyNavigation = (): void => {
        navigate(`/reply/${reply._id}`);
    }

    const handleReplyLike = (): void => {
        dispatch(setLoadingLikeR(reply._id));
        dispatch(likeReply(reply._id));
    }

    const handleReplyRetweet = (): void => {
        dispatch(setLoadingRetweetR(reply._id));
        dispatch(retweetReply(reply._id));
    }

    const handleReplyDelete = (): void => {
        dispatch(deleteReply(reply._id));
    }

    const handleBookmark = (): void => {
        dispatch(setLoadingBookmarkR(reply._id));
        dispatch(bookmarkReply(reply._id));
    }

    return (
        <>
            <div
                className="home__tweets-tweet"
                onClick={handleReplyParentClick}
            >
                <div className="home__tweets-tweet__left">
                    {(reply.retweeted !== undefined) && (
                        <div className="home__tweets-tweet__retweeted">
                            <RetweetsIcon />
                        </div>
                    )}
                    <div className="home__tweets-tweet__profile">
                        <ProfilePicture
                            user={reply.user}
                        />
                        <TweetInfo
                            userInfo={reply.user}
                            className="home__tweets-info"
                        />
                    </div>
                </div>
                <div onClick={handleReplyParentClick} className="home__tweets-tweet__details">
                    {(reply.retweeted !== undefined) && (
                        <p className="home__tweets-tweet__details-retweeted">
                            You reposted
                        </p>
                    )}
                    <div onClick={handleReplyParentClick} className="home__tweets-tweet__details-top">
                        <div className="home__tweets-tweet__details-top__user">
                            <div>
                                <p onClick={() => navigate(`/profile/${(reply.user as IUser)._id}`)}>{(reply.user as IUser).name}</p>
                                <p onClick={() => navigate(`/profile/${(reply.user as IUser)._id}`)}>@{(reply.user as IUser).username}</p>
                                <p>&middot;</p>
                                <p>{getFormattedDuration(((reply.retweeted !== undefined) || (location.pathname.startsWith("/profile") && location.pathname.endsWith("/likes")) || (location.pathname === "/bookmarks")) ? reply.originalCreatedAt! : reply.createdAt)}</p>
                            </div>
                            {((reply.retweeted !== undefined) || (location.pathname.startsWith("/profile") && location.pathname.endsWith("/likes")) || (location.pathname === "/bookmarks")) && (
                                <p onClick={() => {
                                    if (reply.surfaceLevel) {
                                        navigate(`/profile/${(reply.mainTweet as ITweet).user._id}`);
                                    } else {
                                        navigate(`/profile/${(reply.parentReply as IReply).user._id}`);
                                    }
                                }} className="home__tweets-tweet__details-top__user-retweeted">
                                    Replying to <span>@{reply.surfaceLevel ? (reply.mainTweet as ITweet).user.username : (reply.parentReply as IReply).user.username}</span>
                                </p>
                            )}
                            <p className="home__tweets-tweet__details-top__user-content" onClick={handleReplyNavigation}>{reply.content}</p>
                        </div>
                        <div onClick={() => setMoreOptions({
                            active: true,
                            username: reply.user.username,
                            userId: reply.user._id
                        })} title="More" className="home__tweets-tweet__details-top__options">
                            <ThreeDotsIcon />
                        </div>
                    </div>
                    {reply.file.present && (
                        <div onClick={handleReplyNavigation} style={{ marginTop: "0" }} className="home__form-content__preview">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${reply.file.data}`}
                                alt="File"
                            />
                        </div>
                    )}
                    <div onClick={handleReplyParentClick} className="home__tweets-tweet__details-interaction">
                        <div onClick={() => setReplyPopupActive(true)} title="Reply" className="home__tweets-tweet__details-interaction__option--replies">
                            <div>
                                <RepliesIcon />
                            </div>
                            {reply.replies.length > 0 && (
                                <p>{reply.replies.length}</p>
                            )}
                        </div>
                        <div onClick={handleReplyRetweet} title="Repost" className={`home__tweets-tweet__details-interaction__option--retweets ${retweeted ? "home__tweets-tweet__details-interaction__option--retweets-active" : ""}`}>
                            <div>
                                {(loadingReplyRetweet.active && (loadingReplyRetweet.replyId === reply._id)) ? (
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
                            {reply.retweets.length > 0 && (
                                <p>{reply.retweets.length}</p>
                            )}
                        </div>
                        <div onClick={handleReplyLike} title="Like" className={`home__tweets-tweet__details-interaction__option--likes ${liked ? "home__tweets-tweet__details-interaction__option--likes-active" : ""}`}>
                            <div>
                                {(loadingReplyLike.active && (reply._id === loadingReplyLike.replyId)) ? (
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
                            {reply.likes.length > 0 && (
                                <p>{reply.likes.length}</p>
                            )}
                        </div>
                        <div onClick={handleBookmark} title="Bookmark" className={`home__tweets-tweet__details-interaction__option--bookmarks ${bookmarked ? "home__tweets-tweet__details-interaction__option--bookmarks-active" : ""}`}>
                            <div>
                                {(loadingBookmarkReply.active && (loadingBookmarkReply.replyId === reply._id)) ? (
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
                        {reply.user._id === user?._id ? (
                            <div onClick={handleReplyDelete} className="home__tweets-more__delete">
                                {loadingReplyDelete ? (
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
                            reply.user.followersLookup[user?._id!] ? (
                                <div onClick={handleFollow} className="home__tweets-more__interact">
                                    {(loadingAuthFollow.active && (loadingAuthFollow.userId === reply.user._id)) ? (
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
                                    {(loadingAuthFollow.active && (loadingAuthFollow.userId === reply.user._id)) ? (
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
                        <Link to={`/engagements/${reply._id}/retweets/reply`} className="home__tweets-more__engagements">
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
                    key={reply._id}
                    setReplyPopupActive={setReplyPopupActive}
                    type={"reply"}
                    mainTweet={(reply.mainTweet as ITweet)._id}
                    target={reply}
                />
            )}
        </>
    )
}

export default TweetReply;