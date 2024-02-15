import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getUserDetails } from "../features/auth/authSlice";
import Layout from "../components/layout/Layout";
import PrevIcon from "../components/svg/PrevIcon";
import Spinner from "../components/pending/Spinner";
import { IUser } from "../features/auth/authInterfaces";
import UserInfo from "../components/engagements/UserInfo";

function Followage() {
    const { userId } = useParams();
    const {
        userDetails,
        loadingAuthDetails
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if ((!userDetails || (userDetails._id !== userId)) && userId) {
            dispatch(getUserDetails(userId));
        }
    }, [userId]);

    return (
        <Layout>
            <div className="followage">
                {loadingAuthDetails ? (
                    <Spinner
                        absolute={false}
                        height="3rem"
                        width="3rem"
                        margin="2.5rem auto"
                    />
                ) : userDetails && (
                    <>
                        <header className="followage__header">
                            <div className="followage__header-top">
                                <div
                                    onClick={() => navigate(-1)}
                                    title="Back"
                                    className="followage__header-back"
                                >
                                    <PrevIcon />
                                </div>
                                <div className="followage__header-info">
                                    <p className="followage__header-info__name">{userDetails.name}</p>
                                    <p className="followage__header-info__username">@{userDetails.username}</p>
                                </div>
                            </div>
                            <nav className="followage__header-navigation">
                                <Link
                                    to={`/${userId}/followers`}
                                    className="followage__header-navigation__link"
                                >
                                    <div className={`followage__header-navigation__link-container ${location.pathname.endsWith("/followers") ? "followage__header-navigation__link-container__active" : ""}`}>
                                        <p>Followers</p>
                                        <div></div>
                                    </div>
                                </Link>
                                <Link
                                    to={`/${userId}/following`}
                                    className="followage__header-navigation__link"
                                >
                                    <div className={`followage__header-navigation__link-container ${location.pathname.endsWith("/following") ? "followage__header-navigation__link-container__active" : ""}`}>
                                        <p>Following</p>
                                        <div></div>
                                    </div>
                                </Link>
                            </nav>
                        </header>
                        <div className="followage__all">
                            {location.pathname.endsWith("/followers") && (
                                userDetails.followers.length > 0 ? (
                                    (userDetails.followers as IUser[]).map((u: IUser) => (
                                        <UserInfo
                                            key={u._id}
                                            userInfo={u}
                                        />
                                    ))
                                ) : (
                                    <div className="followage__all-empty">
                                        <p className="followage__all-empty__title">
                                            Looking for<br />
                                            followers?
                                        </p>
                                        <p className="followage__all-empty__description">
                                            When someone follows this account, they'll show<br />
                                            up here. Posting and interacting with others helps<br />
                                            boost followers.
                                        </p>
                                    </div>
                                )
                            )}
                            {location.pathname.endsWith("/following") && (
                                userDetails.following.length > 0 ? (
                                    (userDetails.following as IUser[]).map((u: IUser) => (
                                        <UserInfo
                                            key={u._id}
                                            userInfo={u}
                                        />
                                    ))
                                ) : (
                                    <div className="followage__all-empty">
                                        <p className="followage__all-empty__title">
                                            Be in the know
                                        </p>
                                        <p className="followage__all-empty__description">
                                            Following accounts is an easy way to curate your<br />
                                            timeline and know what's happening with the<br />
                                            topics and people you're interested in.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Followage;