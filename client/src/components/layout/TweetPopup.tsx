import React, { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { createTweet, resetTweet } from "../../features/tweet/tweetSlice";
import CloseIcon from "../svg/CloseIcon";
import ProfilePicture from "./ProfilePicture";
import EmojiIcon from "../home/svg/EmojiIcon";
import GifIcon from "../home/svg/GifIcon";
import LocationIcon from "../home/svg/LocationIcon";
import MediaIcon from "../home/svg/MediaIcon";
import PollIcon from "../home/svg/PollIcon";
import ScheduleIcon from "../home/svg/ScheduleIcon";
import GlobalIcon from "../home/svg/GlobalIcon";
import Spinner from "../pending/Spinner";
import toast from "react-hot-toast";

interface TweetPopupProps {
    setNewTweetActive: (value: boolean) => void;
}

function TweetPopup({ setNewTweetActive }: TweetPopupProps) {
    const [tweet, setTweet] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [blobURL, setBlobURL] = useState<string>("");
    const tweetRef = useRef<HTMLTextAreaElement | null>(null);
    const { user } = useAppSelector((state) => state.auth);
    const {
        loadingTweetCreate,
        successTweet,
        messageTweet
    } = useAppSelector((state) => state.tweet);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tweetRef.current) {
            const element: HTMLTextAreaElement = tweetRef.current;
            element.style.height = file ? "40px" : "100px";
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [tweet, file]);

    useEffect(() => {
        if (successTweet && messageTweet === "TWEET CREATED") {
            setFile(null);
            setBlobURL("");
            setTweet("");
            setNewTweetActive(false);
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
        const fileInput: HTMLInputElement = document.querySelector("#new-tweet__file") as HTMLInputElement;
        fileInput.value = "";
        fileInput.click();
    }

    const handlePostSubmit = (): void => {
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
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLDivElement;
            if (target.id === "new-tweet") {
                setNewTweetActive(false);
            }
        }} className="new-tweet" id="new-tweet">
            <div className="new-tweet__popup">
                <div className="new-tweet__popup-heading">
                    <div onClick={() => setNewTweetActive(false)} title="Close" className="new-tweet__popup-heading__close">
                        <CloseIcon />
                    </div>
                    <div className="new-tweet__popup-heading__drafts">
                        <p>Drafts</p>
                    </div>
                </div>
                <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                }} className="new-tweet__popup-form">
                    <div className="new-tweet__popup-form__profile">
                        <ProfilePicture
                            user={user!}
                        />
                    </div>
                    <div className="new-tweet__popup-form__details">
                        <textarea
                            placeholder="What is happening?!"
                            className="home__form-content__tweet"
                            value={tweet}
                            ref={tweetRef}
                            onChange={handleTweetChange}
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
                    </div>
                </form>
                <div className="new-tweet__popup-reply">
                    <div>
                        <GlobalIcon />
                        <p>Everyone can reply</p>
                    </div>
                </div>
                <div className="new-tweet__popup-interaction">
                    <div className="new-tweet__popup-interaction__options">
                        <div onClick={handleFileClick} title="Media">
                            <MediaIcon />
                            <input
                                type="file"
                                id="new-tweet__file"
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
                        className="new-tweet__popup-interaction__button"
                        style={loadingTweetCreate ? { backgroundColor: "rgba(29, 155, 240, .5)" } : {}}
                        onClick={handlePostSubmit}
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
        </div>
    )
}

export default TweetPopup;