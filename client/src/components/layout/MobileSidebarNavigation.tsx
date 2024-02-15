import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import BookmarkIcon from "./svg/BookmarkIcon";
import ExploreIcon from "./svg/ExploreIcon";
import HomeIcon from "./svg/HomeIcon";
import ListIcon from "./svg/ListIcon";
import MessageIcon from "./svg/MessageIcon";
import MoreIcon from "./svg/MoreIcon";
import NotificationIcon from "./svg/NotificationIcon";
import ProfileIcon from "./svg/ProfileIcon";

function MobileSidebarNavigation() {
    const { user } = useAppSelector((state) => state.auth);

    const location = useLocation();

    const checkLocation = (pathname: string, startsWith: boolean = false, endsWith: boolean = false): boolean => {
        if (startsWith && (location.pathname.startsWith(pathname))) {
            return true;
        } else if (endsWith && (location.pathname.endsWith(pathname))) {
            return true;
        } else if (location.pathname === pathname) {
            return true;
        }
        return false;
    }

    return (
        <div className="layout__sidebar-navigation">
            <Link to="/home" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <HomeIcon
                        fill={(checkLocation("/home") || checkLocation("/home/following")) ? true : false}
                    />
                </div>
            </Link>
            <Link title="Coming soon..." style={{ cursor: "not-allowed" }} to="#" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <ExploreIcon />
                </div>
            </Link>
            <Link title="Coming soon..." style={{ cursor: "not-allowed" }} to="#" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <NotificationIcon />
                </div>
            </Link>
            <Link title="Coming soon..." style={{ cursor: "not-allowed" }} to="#" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <MessageIcon />
                </div>
            </Link>
            <Link title="Coming soon..." style={{ cursor: "not-allowed" }} to="#" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <ListIcon />
                </div>
            </Link>
            <Link to="/bookmarks" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <BookmarkIcon
                        fill={checkLocation("/bookmarks") ? true : false}
                    />
                </div>

            </Link>
            <Link to={`/profile/${user?._id}`} className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <ProfileIcon
                        fill={checkLocation("/profile", true) ? true : false}
                    />
                </div>

            </Link>
            <Link title="Coming soon..." style={{ cursor: "not-allowed" }} to="#" className={`layout__sidebar-navigation__link layout__msidebar-navigation__link`}>
                <div>
                    <MoreIcon />
                </div>
            </Link>
        </div>
    )
}

export default MobileSidebarNavigation;