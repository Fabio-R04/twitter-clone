import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser, IUser } from "../../features/auth/authInterfaces";
const defaultProfilePicture = require("../../assets/images/default-profile.png");

interface ProfilePictureProps {
    user: IUser | AuthUser;
    className?: string;
    pointer?: boolean;
    preventNavigation?: boolean;
}

function ProfilePicture({ user, className, pointer, preventNavigation }: ProfilePictureProps) {
    const navigate = useNavigate();

    return (
        user.hasPFP.present ? (
            user.hasPFP.image.includes("google") ? (
                <img
                    src={user.hasPFP.image}
                    alt="Profile"
                    className={className}
                    referrerPolicy="no-referrer"
                    onClick={() => {
                        if ((preventNavigation !== undefined && (preventNavigation === true))) {
                            return;
                        }
                        navigate(`/profile/${user._id}`);

                    }}
                    style={pointer ? { cursor: "pointer" } : {}}
                />
            ) : (
                <img
                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${user.hasPFP.image}`}
                    alt="Profile"
                    className={className}
                    onClick={() => {
                        if ((preventNavigation !== undefined && (preventNavigation === true))) {
                            return;
                        }
                        navigate(`/profile/${user._id}`);
                    }}
                    style={pointer ? { cursor: "pointer" } : {}}
                />
            )
        ) : (
            <img
                src={defaultProfilePicture}
                alt="Profile"
                className={className}
                onClick={() => {
                    if ((preventNavigation !== undefined && (preventNavigation === true))) {
                        return;
                    }
                    navigate(`/profile/${user._id}`);
                }}
                style={pointer ? { cursor: "pointer" } : {}}
            />
        )
    )
}

export default ProfilePicture;