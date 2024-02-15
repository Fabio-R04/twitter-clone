import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
    createTweet,
    getFollowingTweets,
    getForYouTweets,
    resetTweet,
    fetchNextPageForYou,
    fetchNextPageFollowing
} from "../features/tweet/tweetSlice";
import Layout from "../components/layout/Layout";
import GearIcon from "../components/svg/GearIcon";
import ProfilePicture from "../components/layout/ProfilePicture";
import MediaIcon from "../components/home/svg/MediaIcon";
import GifIcon from "../components/home/svg/GifIcon";
import PollIcon from "../components/home/svg/PollIcon";
import EmojiIcon from "../components/home/svg/EmojiIcon";
import ScheduleIcon from "../components/home/svg/ScheduleIcon";
import LocationIcon from "../components/home/svg/LocationIcon";
import GlobalIcon from "../components/home/svg/GlobalIcon";
import CloseIcon from "../components/svg/CloseIcon";
import toast from "react-hot-toast";
import Spinner from "../components/pending/Spinner";
import HomeTweet from "../components/home/HomeTweet";
import { useIntersection } from "@mantine/hooks";

export interface TweetData {
    content: string;
    file: File;
}

function Home() {
    const [canReplyActive, setCanReplyActive] = useState<boolean>(false);
    const [tweet, setTweet] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [blobURL, setBlobURL] = useState<string>("");
    const tweetRef = useRef<HTMLTextAreaElement>(null);
    const lastPostForYouRef = useRef<HTMLDivElement>(null);
    const lastPostFollowingRef = useRef<HTMLElement>(null);
    const { user } = useAppSelector((state) => state.auth);
    const {
        forYouTweets,
        followingTweets,
        currentPageForYou,
        currentPageFollowing,
        loadingTweetHome,
        loadingTweetCreate,
        successTweet,
        messageTweet
    } = useAppSelector((state) => state.tweet);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { ref: refForYou, entry: entryForYou } = useIntersection({
        root: lastPostForYouRef.current,
        threshold: 1
    });

    const { ref: refFollowing, entry: entryFollowing } = useIntersection({
        root: lastPostFollowingRef.current,
        threshold: 1
    });

    useEffect(() => {
        if (entryForYou?.isIntersecting) {
            dispatch(fetchNextPageForYou());
        }
    }, [entryForYou]);

    useEffect(() => {
        if (entryFollowing?.isIntersecting) {
            dispatch(fetchNextPageFollowing());
        }
    }, [entryFollowing]);

    useEffect(() => {
        if (currentPageForYou && (location.pathname === "/home")) {
            dispatch(getForYouTweets(currentPageForYou));
        }
    }, [currentPageForYou, location.pathname]);

    useEffect(() => {
        if (currentPageFollowing && (location.pathname === "/home/following")) {
            dispatch(getFollowingTweets(currentPageFollowing));
        }
    }, [currentPageFollowing, location.pathname]);

    useEffect(() => {
        if (tweetRef.current) {
            const element: HTMLTextAreaElement = tweetRef.current;
            element.style.height = "40px";
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [tweet]);

    useEffect(() => {
        if (successTweet && messageTweet === "TWEET CREATED") {
            setTweet("");
            setFile(null);
            setBlobURL("");
            setCanReplyActive(false);
        }
        dispatch(resetTweet());
    }, [successTweet, messageTweet, dispatch]);

    const handleTweetChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setTweet(event.target.value);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const url: string = URL.createObjectURL(event.target.files[0]);
            setFile(event.target.files[0]);
            setBlobURL(url);
        }
    }

    const handleFileClick = (): void => {
        setCanReplyActive(true);
        const fileInput: HTMLInputElement = document.querySelector("#home__file") as HTMLInputElement;
        fileInput.value = "";
        fileInput.click();
    }

    const handlePostSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if ((tweet.trim().length < 1) && !file) {
            toast.error("Content or file required.");
            return;
        }
        dispatch(createTweet({
            content: tweet,
            file: file!
        }));
    }

    return (
        <Layout>
            <div className="home">
                <nav className="home__navigation">
                    <div className="home__navigation-container">
                        <div onClick={() => navigate("/home")} className="home__navigation-container__link">
                            <Link to="/home" className={`home__navigation-link ${location.pathname === "/home" ? "home__navigation-link__active" : ""}`}>
                                <p className="home__navigation-text">For you</p>
                                <div className="home__navigation-border"></div>
                            </Link>
                        </div>
                        <div onClick={() => navigate("/home/following")} className="home__navigation-container__link">
                            <Link to="/home/following" className={`home__navigation-link ${location.pathname === "/home/following" ? "home__navigation-link__active" : ""}`}>
                                <p className="home__navigation-text">Following</p>
                                <div className="home__navigation-border"></div>
                            </Link>
                        </div>
                    </div>
                    <div className="home__navigation-timeline">
                        <div title="Timeline settings">
                            <GearIcon />
                        </div>
                    </div>
                </nav>
                <form onSubmit={handlePostSubmit} className="home__form">
                    <Link to={`/profile/${user?._id}`} className="home__form-profile">
                        <ProfilePicture
                            user={user!}
                            className="home__form-profile__image"
                            preventNavigation={true}
                        />
                    </Link>
                    <div className="home__form-content">
                        <textarea
                            placeholder="What is happening?!"
                            className="home__form-content__tweet"
                            value={tweet}
                            ref={tweetRef}
                            onChange={handleTweetChange}
                            onClick={() => setCanReplyActive(true)}
                            minLength={0}
                            maxLength={280}
                        ></textarea>
                        {file && blobURL && (
                            <div className="home__form-content__preview">
                                {file.type.includes("image") ? (
                                    <img
                                        src={blobURL}
                                        alt="File uploaded"
                                    />
                                ) : (
                                    <video
                                        src={blobURL}
                                        controls
                                    />
                                )}
                                <div onClick={() => {
                                    setFile(null);
                                    setBlobURL("");
                                }} title="Remove" className="home__form-content__preview-close">
                                    <CloseIcon />
                                </div>
                            </div>
                        )}
                        {canReplyActive && (
                            <div className="home__form-content__reply">
                                <div>
                                    <GlobalIcon />
                                    <p>Everyone can reply</p>
                                </div>
                            </div>
                        )}
                        <div className="home__form-content__details">
                            <div className="home__form-content__options">
                                <div onClick={handleFileClick} title="Media">
                                    <MediaIcon />
                                    <input
                                        type="file"
                                        id="home__file"
                                        onChange={handleFileChange}
                                        hidden={true}
                                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
                                    />
                                </div>
                                <div title="GIF">
                                    <GifIcon />
                                </div>
                                <div title="Poll">
                                    <PollIcon />
                                </div>
                                <div title="Emoji">
                                    <EmojiIcon />
                                </div>
                                <div title="Schedule">
                                    <ScheduleIcon />
                                </div>
                                <div title="Location">
                                    <LocationIcon />
                                </div>
                            </div>
                            <button
                                disabled={((tweet.trim().length > 0) || file) ? false : true}
                                className="home__form-content__button"
                                style={loadingTweetCreate ? { backgroundColor: "rgba(29, 155, 240, .5)" } : {}}
                            >
                                {loadingTweetCreate ? (
                                    <Spinner
                                        absolute={false}
                                        height="1.5rem"
                                        width="1.5rem"
                                    />
                                ) : (
                                    "Post"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
                <div className="home__tweets">
                    {(location.pathname === "/home") && (
                        forYouTweets.map((tweet, i) => {
                            if ((i + 1) === forYouTweets.length) {
                                return (
                                    <HomeTweet
                                        key={tweet._id}
                                        tweet={tweet}
                                        ref={refForYou}
                                    />
                                );
                            }

                            return (
                                <HomeTweet
                                    key={tweet._id}
                                    tweet={tweet}
                                />
                            );
                        })
                    )}
                    {(location.pathname === "/home/following") && (
                        followingTweets.length > 0 ? (
                            followingTweets.map((tweet, i) => {
                                if ((i + 1) === followingTweets.length) {
                                    return (
                                        <HomeTweet
                                            key={tweet._id}
                                            tweet={tweet}
                                            ref={refFollowing}
                                        />
                                    );
                                }

                                return (
                                    <HomeTweet
                                        key={tweet._id}
                                        tweet={tweet}
                                    />
                                );
                            })
                        ) : (
                            <div className="home__tweets-empty">
                                <p className="home__tweets-empty__title">
                                    Welcome to X!
                                </p>
                                <p className="home__tweets-empty__description">
                                    This is the best place to see what's happening in<br />
                                    your world. Find some people and topics to follow<br />
                                    now.
                                </p>
                                <Link to="#" className="home__tweets-empty__button">Let's go!</Link>
                            </div>
                        )
                    )}
                    <div className="home__fetching">
                        {loadingTweetHome && (
                            <Spinner
                                absolute={false}
                                height="3.5rem"
                                width="3.5rem"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home;