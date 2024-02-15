import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import AuthLogo from "../auth/svg/AuthLogo";
import ProfilePicture from "./ProfilePicture";
import DownArrowIcon from "./svg/DownArrowIcon";
import ThreeDotsIcon from "./svg/ThreeDotsIcon";
import Navigation from "./Navigation";

export interface SidebarProps {
    profileActive: boolean;
    setNewTweetActive: (value: boolean) => void;
    setProfileActive: (value: boolean) => void;
    handleLogout: () => void;
}

function Sidebar({ profileActive, setProfileActive, setNewTweetActive, handleLogout  }: SidebarProps) {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <nav className="layout__sidebar">
            <div className="layout__sidebar-top">
                <Link to="/home" className="layout__sidebar-brand">
                    <AuthLogo />
                </Link>
                <Navigation />
                <button onClick={() => setNewTweetActive(true)} className="layout__sidebar-post">Post</button>
            </div>
            <div onClick={() => setProfileActive(true)} className="layout__sidebar-profile">
                <ProfilePicture
                    key={user?._id}
                    user={user!}
                    className="layout__sidebar-profile__image"
                />
                <div className="layout__sidebar-profile__details">
                    <p>{user?.name}</p>
                    <p>@{user?.username}</p>
                </div>
                <ThreeDotsIcon />
                {profileActive && (
                    <>
                        <div onClick={handleLogout} className="layout__sidebar-profile__logout">
                            <p>Log out @{user?.username}</p>
                            <DownArrowIcon />
                        </div>
                        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                            event.stopPropagation();
                            const target = event.target as HTMLDivElement;
                            if (target.id === "layout__container") {
                                setProfileActive(false);
                            }
                        }} className="layout__container" id="layout__container"></div>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Sidebar;