import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Layout from "../components/layout/Layout";
import PrevIcon from "../components/svg/PrevIcon";
import GearIcon from "../components/svg/GearIcon";
import { follow, getSuggestedUsers, setLoadingFollow } from "../features/auth/authSlice";
import Spinner from "../components/pending/Spinner";
import { IUser } from "../features/auth/authInterfaces";
import ProfilePicture from "../components/layout/ProfilePicture";
import TweetInfo from "../components/TweetInfo";

function Suggested() {
    const {
        user,
        suggestedUsers,
        loadingAuthSuggested,
        loadingAuthFollow
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getSuggestedUsers(0));
    }, []);

    const handleParentClick = (event: React.MouseEvent<HTMLDivElement>, userId: string): void => {
        const parent = event.currentTarget;
        const target = event.target;

        if (target === parent) {
            handleNavigation(userId);
        }
    }

    const handleNavigation = (userId: string): void => {
        navigate(`/profile/${userId}`);
    }

    const handleFollow = (userId: string): void => {
        dispatch(setLoadingFollow(userId));
        dispatch(follow(userId));
    }

    return (
        <Layout>
            <div className="suggested">
                <header className="suggested__header">
                    <div onClick={() => navigate(-1)} title="Back" className="suggested__header-back">
                        <PrevIcon />
                    </div>
                    <p className="suggested__header-title">Connect</p>
                    <div title="Settings" className="suggested__header-settings">
                        <GearIcon />
                    </div>
                </header>
                {loadingAuthSuggested ? (
                    <Spinner
                        absolute={false}
                        height="3rem"
                        width="3rem"
                        margin="2.5rem auto"
                    />
                ) : (
                    <section className="suggested__users">
                        {suggestedUsers.map((u: IUser) => (
                            <div onClick={(event) => handleParentClick(event, u._id)} key={u._id} className="suggested__users-user">
                                <div className="suggested__users-user__image">
                                    <ProfilePicture
                                        key={u._id}
                                        user={u}
                                    />
                                    <TweetInfo
                                        key={u._id}
                                        userInfo={u}
                                        className="suggested__hover"
                                    />
                                </div>
                                <div className="suggested__users-content">
                                    <div onClick={(event) => handleParentClick(event, u._id)} className="suggested__users-content__details">
                                        <div onClick={() => handleNavigation(u._id)} className="suggested__users-content__details-info">
                                            <p>{u.name}</p>
                                            <p>@{u.username}</p>
                                        </div>
                                        {u.followersLookup[user?._id!] ? (
                                            <button onClick={() => handleFollow(u._id)} className="suggested__users-content__details-following">
                                                {(loadingAuthFollow.active && (loadingAuthFollow.userId === u._id)) ? (
                                                    <Spinner
                                                        absolute={false}
                                                        height="1.3rem"
                                                        width="1.3rem"
                                                    />
                                                ) : (
                                                    "Following"
                                                )}
                                            </button>
                                        ) : (
                                            <button onClick={() => handleFollow(u._id)} className="suggested__users-content__details-follow">
                                                {(loadingAuthFollow.active && (loadingAuthFollow.userId === u._id)) ? (
                                                    <Spinner
                                                        absolute={false}
                                                        height="1.3rem"
                                                        width="1.3rem"
                                                    />
                                                ) : (
                                                    "Follow"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {u.bio.length > 0 && (
                                        <p onClick={() => handleNavigation(u._id)} className="suggested__users-content__bio">{u.bio}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </Layout>
    )
}

export default Suggested;