import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { IUser } from "../../features/auth/authInterfaces";
import ProfilePicture from "../layout/ProfilePicture";
import { follow, setLoadingFollow } from "../../features/auth/authSlice";
import Spinner from "../pending/Spinner";

interface UserInfoProps {
    userInfo: IUser;
}

function UserInfo({ userInfo }: UserInfoProps) {
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
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const parent = event.currentTarget;
            const target = event.target;

            if (target === parent) {
                navigate(`/profile/${userInfo._id}`);
            }
        }} className="user-info">
            <div onClick={() => navigate(`/profile/${userInfo._id}`)} className="user-info__profile">
                <ProfilePicture
                    className="user-info__profile-img"
                    user={userInfo}
                />
            </div>
            <div onClick={() => navigate(`/profile/${userInfo._id}`)} className="user-info__details">
                <p className="user-info__details-name">{userInfo.name}</p>
                <p className="user-info__details-username">@{userInfo.username}</p>
                <p className="user-info__details-bio">{userInfo.bio}</p>
            </div>
            {userInfo._id !== user?._id && (
                userInfo.followersLookup[user?._id!] ? (
                    <button onClick={handleFollow} className="user-info__engage user-info__engage--following">
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
                    <button onClick={handleFollow} className="user-info__engage user-info__engage--follow">
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
    )
}

export default UserInfo;