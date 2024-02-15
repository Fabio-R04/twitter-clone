import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";
import AuthLogo from "../auth/svg/AuthLogo";
import ProfilePicture from "./ProfilePicture";
import DownArrowIcon from "./svg/DownArrowIcon";
import ThreeDotsIcon from "./svg/ThreeDotsIcon";
import MobileSidebarNavigation from "./MobileSidebarNavigation";
import { SidebarProps } from "./Sidebar";
import PostIcon from "./svg/PostIcon";

function MobileSidebar({ profileActive, setProfileActive, setNewTweetActive, handleLogout }: SidebarProps) {
    const { user } = useAppSelector((state) => state.auth);
    
    return (
        <nav className="layout__sidebar layout__msidebar">
            <div className="layout__sidebar-top">
                <Link to="/home" className="layout__sidebar-brand">
                    <AuthLogo />
                </Link>
                <MobileSidebarNavigation />
                <button onClick={() => setNewTweetActive(true)} className="layout__sidebar-post layout__msidebar-post">
                    <PostIcon />
                </button>
            </div>
            <div onClick={() => setProfileActive(true)} className="layout__sidebar-profile layout__msidebar-profile">
                <ProfilePicture
                    key={user?._id}
                    user={user!}
                    className="layout__sidebar-profile__image"
                    preventNavigation={true}
                />
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

export default MobileSidebar;