import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getTweetRetweets, getTweetLikes } from "../features/tweet/tweetSlice";
import { IRetweetPost } from "../features/tweet/interfaces/retweetInterface";
import { ILikeTweet } from "../features/tweet/interfaces/likeInterface";
import { IUser } from "../features/auth/authInterfaces";
import Layout from "../components/layout/Layout";
import PrevIcon from "../components/svg/PrevIcon";
import Spinner from "../components/pending/Spinner";
import UserInfo from "../components/engagements/UserInfo";

export interface EngagementsData {
    elementId: string;
    type: string;
}

function Engagements() {
    const { elementId, type } = useParams();
    const {
        engagements,
        loadingTweetRetweets,
        loadingTweetLikes
    } = useAppSelector((state) => state.tweet);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (elementId && type) {
            if (location.pathname.includes("retweets")) {
                dispatch(getTweetRetweets({
                    elementId,
                    type
                }));
            } else if (location.pathname.includes("likes")) {
                dispatch(getTweetLikes({
                    elementId,
                    type
                }));
            }
        }
    }, [elementId, type, location.pathname]);

    return (
        <Layout>
            <div className="engagements">
                <header className="engagements__heading">
                    <div className="engagements__heading-title">
                        <div onClick={() => navigate(-1)} title="Back" className="engagements__heading-title__prev">
                            <PrevIcon />
                        </div>
                        <p className="engagements__heading-title__name">Post engagements</p>
                    </div>
                    <nav className="engagements__heading-navigation">
                        <div onClick={() => navigate(`/engagements/${elementId}/retweets/${type}`)} className="engagements__heading-navigation__container">
                            <Link to={`/engagements/${elementId}/retweets/${type}`} className={`engagements__heading-navigation__link ${location.pathname.includes("/retweets") ? "engagements__heading-navigation__link--active" : ""}`}>
                                <p>Reposts</p>
                                <div></div>
                            </Link>
                        </div>
                        <div onClick={() => navigate(`/engagements/${elementId}/likes/${type}`)} className="engagements__heading-navigation__container">
                            <Link to={`/engagements/${elementId}/likes/${type}`} className={`engagements__heading-navigation__link ${location.pathname.includes("/likes") ? "engagements__heading-navigation__link--active" : ""}`}>
                                <p>Likes</p>
                                <div></div>
                            </Link>
                        </div>
                    </nav>
                </header>
                <div className="engagements__users">
                    {(loadingTweetRetweets || loadingTweetLikes) ? (
                        <Spinner
                            absolute={false}
                            height="3.5rem"
                            width="3.5rem"
                            margin="3rem 0"
                        />
                    ) : (
                        location.pathname.includes("/retweets") ? (
                            engagements.retweets.length > 0 ? (
                                engagements.retweets.map((retweet) => (
                                    <UserInfo
                                        key={retweet._id}
                                        userInfo={(retweet.user as IUser)}
                                    />
                                ))
                            ) : (
                                <div className="engagements__users-empty">
                                    <p className="engagements__users-empty__title">
                                        No Reposts yet
                                    </p>
                                    <p className="engagements__users-empty__description">
                                        Share someone else's post on your timeline by<br />
                                        reposting it. When you do, it'll show up here.
                                    </p>
                                </div>
                            )
                        ) : (
                            engagements.likes.length > 0 ? (
                                engagements.likes.map((like) => (
                                    <UserInfo
                                        key={like._id}
                                        userInfo={(like.user as IUser)}
                                    />
                                ))
                            ) : (
                                <div className="engagements__users-empty">
                                    <p className="engagements__users-empty__title">
                                        No likes yet
                                    </p>
                                    <p className="engagements__users-empty__description">
                                        When someone taps the heart to Like this post, it'll<br />
                                        show up here.
                                    </p>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Engagements;