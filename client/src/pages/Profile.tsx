import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { follow, getUserDetails, getUserLikes, getUserMedia, getUserTweets, getUserTweetsAndReplies, setLoadingFollow } from "../features/auth/authSlice";
import moment from "moment";
import Layout from "../components/layout/Layout";
import PrevIcon from "../components/svg/PrevIcon";
import BackgroundPicture from "../components/profile/BackgroundPicture";
import ProfilePicture from "../components/layout/ProfilePicture";
import ThreeDotsIcon from "../components/layout/svg/ThreeDotsIcon";
import MessageIcon from "../components/layout/svg/MessageIcon";
import Spinner from "../components/pending/Spinner";
import LocationIcon from "../components/home/svg/LocationIcon";
import WebsiteIcon from "../components/profile/svg/WebsiteIcon";
import CalendarIcon from "../components/profile/svg/CalendarIcon";
import EditProfile from "../components/profile/EditProfile";
import { ITweet } from "../features/tweet/interfaces/tweetInterface";
import HomeTweet from "../components/home/HomeTweet";
import { TweetsAndReplies } from "../features/auth/authInterfaces";
import { isReply } from "../reusable";
import TweetReply from "../components/tweet/TweetReply";
import ProfileReply from "../components/profile/ProfileReply";
import toast from "react-hot-toast";

function Profile() {
    const [profileOptions, setProfileOptions] = useState<boolean>(false);
    const [editProfileActive, setEditProfileActive] = useState<boolean>(false);
    const { userId } = useParams();
    const {
        user,
        userDetails,
        userTweets,
        userTweetsAndReplies,
        userMedia,
        userLikes,
        loadingAuthFollow,
        loadingAuthDetails,
        loadingAuthTweets,
        loadingAuthTweetsAndReplies,
        loadingAuthMedia,
        loadingAuthLikes
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (userId) {
            dispatch(getUserDetails(userId));
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            if (location.pathname === `/profile/${userId}`) {
                dispatch(getUserTweets(userId));
            } else if (location.pathname === `/profile/${userId}/with_replies`) {
                dispatch(getUserTweetsAndReplies(userId));
            } else if (location.pathname === `/profile/${userId}/media`) {
                dispatch(getUserMedia(userId));
            } else if (location.pathname === `/profile/${userId}/likes`) {
                dispatch(getUserLikes(userId));
            }
        }
    }, [userId, location.pathname]);

    const handleFollow = (): void => {
        if (userDetails) {
            dispatch(setLoadingFollow(userDetails._id));
            dispatch(follow(userDetails._id));
        }
    }

    return (
        <Layout>
            <div className="profile">
                {loadingAuthDetails ? (
                    <Spinner
                        absolute={false}
                        height="3rem"
                        width="3rem"
                        margin="2.5rem auto"
                    />
                ) : userDetails && (
                    <>
                        <header className="profile__header">
                            <div onClick={() => navigate(-1)} title="Back" className="profile__header-back">
                                <PrevIcon />
                            </div>
                            <div className="profile__header-details">
                                <p className="profile__header-details__name">{userDetails?.name}</p>
                                <p className="profile__header-details__count">0 posts</p>
                            </div>
                        </header>
                        <section className="profile__bg">
                            <BackgroundPicture
                                key={userDetails._id}
                                user={userDetails}
                                classNameDiv="profile__bg-default"
                                classNameImage="profile__bg-image"
                            />
                        </section>
                        <section className="profile__details">
                            <div className="profile__details-profile">
                                <div className="profile__details-profile__image">
                                    <ProfilePicture
                                        key={userDetails._id}
                                        user={userDetails}
                                        preventNavigation={true}
                                    />
                                </div>
                                {user?._id === userDetails?._id ? (
                                    <button
                                        onClick={() => setEditProfileActive(true)}
                                        className="profile__details-profile__edit"
                                    >Edit profile</button>
                                ) : (
                                    <div className="profile__details-profile__interaction">
                                        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                            const target = event.target as HTMLDivElement;
                                            if (target.id !== "profile__options-container") {
                                                setProfileOptions(true);
                                            }
                                        }} title={profileOptions ? "" : "More"} className="profile__details-profile__interaction-more">
                                            <ThreeDotsIcon />
                                            {profileOptions && (
                                                <div onClick={() => {
                                                    setProfileOptions(false);
                                                    const profileURL: string = `${process.env.REACT_APP_CLIENT_URL}/profile/${userDetails._id}`;
                                                    navigator.clipboard.writeText(profileURL);
                                                    toast.success("Copied to clipboard");
                                                }} className="profile__options-container" id="profile__options-container">
                                                    <WebsiteIcon
                                                        id="profile__options-container"
                                                    />
                                                    <p id="profile__options-container">Copy link to profile</p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ cursor: "not-allowed" }} title="Message" className="profile__details-profile__interaction-message">
                                            <MessageIcon />
                                        </div>
                                        {userDetails?.followersLookup[user?._id!] ? (
                                            <button onClick={handleFollow} className="profile__details-profile__interaction-following">
                                                {(loadingAuthFollow.active && (loadingAuthFollow.userId === userDetails._id)) ? (
                                                    <Spinner
                                                        absolute={false}
                                                        height="1.6rem"
                                                        width="1.6rem"
                                                    />
                                                ) : (
                                                    "Following"
                                                )}
                                            </button>
                                        ) : (
                                            <button onClick={handleFollow} className="profile__details-profile__interaction-follow">
                                                {(loadingAuthFollow.active && (loadingAuthFollow.userId === userDetails._id)) ? (
                                                    <Spinner
                                                        absolute={false}
                                                        height="1.6rem"
                                                        width="1.6rem"
                                                    />
                                                ) : (
                                                    "Follow"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="profile__details-info">
                                <div className="profile__details-info__user">
                                    <p>{userDetails.name}</p>
                                    <p>@{userDetails.username}</p>
                                </div>
                                {userDetails.bio.length > 0 && (
                                    <p className="profile__details-info__bio">{userDetails.bio}</p>
                                )}
                                <div className="profile__details-info__about">
                                    {userDetails.location.length > 0 && (
                                        <div>
                                            <LocationIcon />
                                            <p>{userDetails.location}</p>
                                        </div>
                                    )}
                                    {userDetails.website.length > 0 && (
                                        <div>
                                            <WebsiteIcon />
                                            <Link
                                                onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                                                    event.preventDefault();
                                                    const url: string = userDetails.website;
                                                    const fullURL: string = url.startsWith("http") ? url : `https://${url}`;
                                                    window.open(fullURL, "_blank");
                                                }}
                                                to="#"
                                            >{userDetails.website}</Link>
                                        </div>
                                    )}
                                    <div>
                                        <CalendarIcon />
                                        <p>Joined {moment(userDetails.createdAt).format("MMMM YYYY")}</p>
                                    </div>
                                </div>
                                <div className="profile__details-info__stats">
                                    <Link to={`/${userDetails._id}/following`}><span>{userDetails.following.length}</span> Following</Link>
                                    <Link to={`/${userDetails._id}/followers`}><span>{userDetails.followers.length}</span> Followers</Link>
                                </div>
                            </div>
                        </section>
                        <nav className="profile__details-navigation">
                            <div onClick={() => navigate(`/profile/${userId}`)} className="profile__details-navigation__container">
                                <Link
                                    to={`/profile/${userId}`}
                                    className={`profile__details-navigation__link ${location.pathname === `/profile/${userId}` ? "profile__details-navigation__link--active" : ""}`}
                                >
                                    <p className="profile__details-navigation__link-name">Posts</p>
                                    <div className="profile__details-navigation__link-border"></div>
                                </Link>
                            </div>
                            <div onClick={() => navigate(`/profile/${userId}/with_replies`)} className="profile__details-navigation__container">
                                <Link
                                    to={`/profile/${userId}/with_replies`}
                                    className={`profile__details-navigation__link ${location.pathname.endsWith("/with_replies") ? "profile__details-navigation__link--active" : ""}`}
                                >
                                    <p className="profile__details-navigation__link-name">Replies</p>
                                    <div className="profile__details-navigation__link-border"></div>
                                </Link>
                            </div>
                            <div onClick={() => navigate(`/profile/${userId}/media`)} className="profile__details-navigation__container">
                                <Link
                                    to={`/profile/${userId}/media`}
                                    className={`profile__details-navigation__link ${location.pathname.endsWith("/media") ? "profile__details-navigation__link--active" : ""}`}
                                >
                                    <p className="profile__details-navigation__link-name">Media</p>
                                    <div className="profile__details-navigation__link-border"></div>
                                </Link>
                            </div>
                            <div onClick={() => navigate(`/profile/${userId}/likes`)} className="profile__details-navigation__container">
                                <Link
                                    to={`/profile/${userId}/likes`}
                                    className={`profile__details-navigation__link ${location.pathname.endsWith("/likes") ? "profile__details-navigation__link--active" : ""}`}
                                >
                                    <p className="profile__details-navigation__link-name">Likes</p>
                                    <div className="profile__details-navigation__link-border"></div>
                                </Link>
                            </div>
                        </nav>
                        <div className="profile__content">
                            {(loadingAuthTweets || loadingAuthTweetsAndReplies || loadingAuthMedia || loadingAuthLikes) ? (
                                <Spinner
                                    absolute={false}
                                    height="3rem"
                                    width="3rem"
                                    margin="2.5rem auto"
                                />
                            ) : (
                                <>
                                    {location.pathname === `/profile/${userDetails._id}` && (
                                        userTweets.length > 0 ? (
                                            userTweets.map((element: TweetsAndReplies, index: number) => {
                                                if (isReply(element)) {
                                                    return (
                                                        <TweetReply
                                                            key={index}
                                                            reply={element}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <HomeTweet
                                                            key={index}
                                                            tweet={element}
                                                        />
                                                    )
                                                }
                                            })
                                        ) : (
                                            <div className="followage__all-empty">
                                                <p className="followage__all-empty__title">
                                                    @{userDetails.username} hasn't<br />
                                                    posted
                                                </p>
                                                <p className="followage__all-empty__description">
                                                    When they do, their posts will show up here.
                                                </p>
                                            </div>
                                        )
                                    )}
                                    {location.pathname === `/profile/${userDetails._id}/with_replies` && (
                                        userTweetsAndReplies.length > 0 ? (
                                            userTweetsAndReplies.map((element: TweetsAndReplies) => {
                                                if (isReply(element)) {
                                                    return (
                                                        <ProfileReply
                                                            key={element._id}
                                                            replyInfo={element}
                                                        />
                                                    )
                                                } else {
                                                    return (
                                                        <HomeTweet
                                                            key={element._id}
                                                            tweet={element}
                                                        />
                                                    )
                                                }
                                            })
                                        ) : (
                                            <div className="followage__all-empty">
                                                <p className="followage__all-empty__title">
                                                    @{userDetails.username} hasn't<br />
                                                    posted
                                                </p>
                                                <p className="followage__all-empty__description">
                                                    When they do, their posts will show up here.
                                                </p>
                                            </div>
                                        )
                                    )}
                                    {location.pathname === `/profile/${userDetails._id}/media` && (
                                        userMedia.length > 0 ? (
                                            userMedia.map((t: ITweet) => (
                                                <HomeTweet
                                                    key={t._id}
                                                    tweet={t}
                                                />
                                            ))
                                        ) : (
                                            <div className="followage__all-empty">
                                                <p className="followage__all-empty__title">
                                                    Lights, camera ...<br />
                                                    attachments!
                                                </p>
                                                <p className="followage__all-empty__description">
                                                    When you post photos or videos, they will show<br />
                                                    up here.
                                                </p>
                                            </div>
                                        )
                                    )}
                                    {location.pathname === `/profile/${userDetails._id}/likes` && (
                                        userLikes.length > 0 ? (
                                            userLikes.map((element: TweetsAndReplies) => {
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
                                            })
                                        ) : (
                                            <div className="followage__all-empty">
                                                <p className="followage__all-empty__title">
                                                    You don't have any<br />
                                                    likes yet
                                                </p>
                                                <p className="followage__all-empty__description">
                                                    Tap the heart on any post to show it some love.<br />
                                                    When you do, it'll show up here.
                                                </p>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </div>
                        {editProfileActive && (
                            <EditProfile
                                key={userDetails._id}
                                userInfo={userDetails}
                                setEditProfileActive={setEditProfileActive}
                            />
                        )}
                        {profileOptions && (
                            <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                const target = event.target as HTMLDivElement;
                                if (target.id === "profile__options") {
                                    setProfileOptions(false);
                                }
                            }} className="profile__options" id="profile__options"></div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Profile;