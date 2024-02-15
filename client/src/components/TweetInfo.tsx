import React from "react";
import { IUser } from "../features/auth/authInterfaces";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { follow, setLoadingFollow } from "../features/auth/authSlice";
import ProfilePicture from "./layout/ProfilePicture";
import Spinner from "./pending/Spinner";

interface TweetInfoProps {
    userInfo: IUser;
    className?: string;
}

function TweetInfo({ userInfo, className }: TweetInfoProps) {
    const {
        user,
        loadingAuthFollow
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleFollow = (): void => {
        dispatch(setLoadingFollow(userInfo._id));
        dispatch(follow(userInfo._id));
    }

    return (
        <div className={`tweet-info ${className}`}>
            <div className="tweet-info__profile">
                <ProfilePicture
                    user={userInfo}
                    className="tweet-info__profile-img"
                    pointer={true}
                />
                {userInfo._id !== user?._id && (
                    userInfo.followersLookup[user?._id!] ? (
                        <button onClick={handleFollow} className="tweet-info__profile-interact">
                            {(loadingAuthFollow.active && (loadingAuthFollow.userId === userInfo._id)) ? (
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
                        <button onClick={handleFollow} className="tweet-info__profile-interact">
                            {(loadingAuthFollow.active && (loadingAuthFollow.userId === userInfo._id)) ? (
                                <Spinner
                                    absolute={false}
                                    height="1.3rem"
                                    width="1.3rem"
                                />
                            ) : (
                                "Follow"
                            )}
                        </button>
                    )
                )}
            </div>
            <div onClick={() => navigate(`/profile/${userInfo._id}`)} className="tweet-info__user">
                <p>{userInfo.name}</p>
                <p>@{userInfo.username}</p>
            </div>
            <p className="tweet-info__bio">{userInfo.bio}</p>
            <div className="tweet-info__data">
                <div>
                    <p>{userInfo.following.length}</p>
                    <p>Following</p>
                </div>
                <div>
                    <p>{userInfo.followers.length}</p>
                    <p>Followers</p>
                </div>
            </div>
        </div>
    )
}

export default TweetInfo;