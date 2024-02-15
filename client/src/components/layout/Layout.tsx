import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ProfilePicture from "./ProfilePicture";
import TweetPopup from "./TweetPopup";
import ExploreIcon from "./svg/ExploreIcon";
import { follow, getSuggestedUsers, logout, searchUsers, setLoadingFollow } from "../../features/auth/authSlice";
import Spinner from "../pending/Spinner";
import { IUser } from "../../features/auth/authInterfaces";
import _debounce from "lodash/debounce";
import SearchIconBold from "./SearchIconBold";
import Trending from "./Trending";
import MobileSidebar from "./MobileSidebar";
import Media from "react-media";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const [profileActive, setProfileActive] = useState<boolean>(false);
    const [newTweetActive, setNewTweetActive] = useState<boolean>(false);
    const queryRef = useRef<HTMLInputElement>(null);
    const {
        user,
        searchResults,
        suggestedUsers,
        loadingAuthSearch,
        loadingAuthSuggested,
        loadingAuthFollow
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        dispatch(getSuggestedUsers(3));
    }, []);

    const debouncedSearch = _debounce((searchQuery: string) => {
        dispatch(searchUsers({
            query: searchQuery,
            limit: 13
        }));
    }, 500);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        debouncedSearch(value);
    }

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

    const handleLogout = (): void => {
        dispatch(logout());
    }

    return (
        <>
            <div className="layout">
                <Media query="(min-width: 75.063em)" render={() => (
                    <Sidebar
                        profileActive={profileActive}
                        setProfileActive={setProfileActive}
                        setNewTweetActive={setNewTweetActive}
                        handleLogout={handleLogout}
                    />
                )} />
                <Media query="(max-width: 75em)" render={() => (
                    <MobileSidebar
                        profileActive={profileActive}
                        setProfileActive={setProfileActive}
                        setNewTweetActive={setNewTweetActive}
                        handleLogout={handleLogout}
                    />
                )} />
                <main className="layout__content">
                    {children}
                </main>
                <div className="layout__info">
                    <div className="layout__info-search">
                        <ExploreIcon />
                        <input
                            ref={queryRef}
                            onChange={handleSearchChange}
                            type="text"
                            className="layout__info-search__input"
                            placeholder="Search"
                        />
                        <div className="layout__info-search__results">
                            {loadingAuthSearch ? (
                                <Spinner
                                    absolute={false}
                                    height="2.5rem"
                                    width="2.5rem"
                                    margin="auto 0"
                                />
                            ) : (
                                <div className="layout__info-search__results-container">
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="layout__info-search__results-search">
                                                <SearchIconBold />
                                                <p>{queryRef.current?.value}</p>
                                            </div>
                                            {searchResults.map((u: IUser) => (
                                                <div onClick={() => navigate(`/profile/${u._id}`)} key={u._id} className="layout__info-search__results-user">
                                                    <ProfilePicture
                                                        key={u._id}
                                                        user={u}
                                                        className="layout__info-search__results-user__image"
                                                    />
                                                    <div className="layout__info-search__results-user__details">
                                                        <p>{u.name}</p>
                                                        <p>@{u.username}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <p className="layout__info-search__results-empty">
                                            Try searching for people, lists, or keywords
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {!location.pathname.startsWith("/profile") && (
                        <Trending />
                    )}
                    {location.pathname !== "/suggested" && (
                        <div style={loadingAuthSuggested ? { height: "100%" } : {}} className="layout__info-suggested">
                            {loadingAuthSuggested ? (
                                <Spinner
                                    absolute={false}
                                    height="3rem"
                                    width="3rem"
                                />
                            ) : (
                                <div className="layout__info-suggested__container">
                                    <p className="layout__info-suggested__title">Who to follow</p>
                                    <div className="layout__info-suggested__users">
                                        {suggestedUsers.map((u: IUser) => (
                                            <div onClick={(event) => handleParentClick(event, u._id)} key={u._id} className="layout__info-suggested__user">
                                                <ProfilePicture
                                                    key={u._id}
                                                    user={u}
                                                    className="layout__info-suggested__user-image"
                                                />
                                                <div onClick={() => handleNavigation(u._id)} className="layout__info-suggested__user-details">
                                                    <p>{u.name}</p>
                                                    <p>@{u.username}</p>
                                                </div>
                                                {u.followersLookup[user?._id!] ? (
                                                    <button onClick={() => handleFollow(u._id)} className="layout__info-suggested__user-following">
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
                                                    <button onClick={() => handleFollow(u._id)} className="layout__info-suggested__user-follow">
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
                                        ))}
                                    </div>
                                    <Link
                                        to="/suggested"
                                        className="layout__info-suggested__more"
                                    >
                                        Show more
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    {location.pathname.startsWith("/profile") && (
                        <Trending />
                    )}
                    <div className="layout__info-terms">
                        <p>Terms of Service</p>
                        <p>Privacy Policy</p>
                        <p>Cookie Policy</p>
                        <p>Accessibility</p>
                        <p>Ads info</p>
                        <p>More&middot;&middot;&middot;</p>
                        <p>&#169; {new Date().getFullYear()} X Corp.</p>
                    </div>
                </div>
            </div >
            {newTweetActive && (
                <TweetPopup
                    setNewTweetActive={setNewTweetActive}
                />
            )
            }
        </>
    )
}

export default Layout;