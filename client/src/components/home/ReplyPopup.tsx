import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import CloseIcon from "../svg/CloseIcon";
import { ITweet } from "../../features/tweet/interfaces/tweetInterface";
import ProfilePicture from "../layout/ProfilePicture";
import { getFormattedDuration } from "../../reusable";
import { Link } from "react-router-dom";
import EmojiIcon from "./svg/EmojiIcon";
import GifIcon from "./svg/GifIcon";
import LocationIcon from "./svg/LocationIcon";
import MediaIcon from "./svg/MediaIcon";
import PollIcon from "./svg/PollIcon";
import ScheduleIcon from "./svg/ScheduleIcon";
import { createReply, createReplyR, resetReply } from "../../features/reply/replySlice";
import Spinner from "../pending/Spinner";
import { IReply } from "../../features/tweet/interfaces/replyInterface";

interface ReplyPopupProps {
    setReplyPopupActive: (value: boolean) => void;
    type: string;
    mainTweet: string;
    target: ITweet | IReply;
}

function ReplyPopup({ setReplyPopupActive, type, mainTweet, target }: ReplyPopupProps) {
    const [file, setFile] = useState<File | null>(null);
    const [blobURL, setBlobURL] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const replyRef = useRef<HTMLTextAreaElement | null>(null);
    const {
        loadingReplyCreate,
    } = useAppSelector((state) => state.reply);
    const { user } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (replyRef.current) {
            const element: HTMLTextAreaElement = replyRef.current;
            element.style.height = file ? "40px" : "100px";
            element.style.height = `${element.scrollHeight}px`;
        }
    }, [reply, file]);

    const handleReplyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReply(event.target.value);
    }

    const handleFileClick = (): void => {
        const fileInput: HTMLInputElement = document.querySelector("#reply-popup__file") as HTMLInputElement;
        fileInput.value = "";
        fileInput.click();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const file: File = event.target.files[0];
            const url: string = URL.createObjectURL(file);
            setFile(file);
            setBlobURL(url);
        }
    }

    const handleReplySubmit = (): void => {
        if (type === "tweet") {
            dispatch(createReply({
                mainTweet,
                surfaceLevel: true,
                content: reply,
                file
            }));
        } else if (type === "reply") {
            dispatch(createReplyR({
                type: "PARENT",
                mainTweet,
                parentReply: target._id,
                surfaceLevel: false,
                content: reply,
                file
            }));
        }
        setReply("");
        setFile(null);
        setBlobURL("");
        setReplyPopupActive(false);
    }

    return (
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLDivElement;
            if (target.id === "reply-popup") {
                setReplyPopupActive(false);
            }
        }} className="reply-popup" id="reply-popup">
            <div className="reply-popup__container">
                <header className="reply-popup__header">
                    <div onClick={() => setReplyPopupActive(false)} title="Close" className="reply-popup__header-close">
                        <CloseIcon />
                    </div>
                    <div className="reply-popup__header-drafts">
                        <p>Drafts</p>
                    </div>
                </header>
                <section className="reply-popup__target">
                    <div className="reply-popup__target-profile">
                        <ProfilePicture
                            user={target.user}
                            className="reply-popup__target-profile__image"
                        />
                        <div className="reply-popup__target-profile__line"></div>
                    </div>
                    <div className="reply-popup__target-details">
                        <div className="reply-popup__target-details__user">
                            <p>{target.user.name}</p>
                            <p>@{target.user.username}</p>
                            <p>&middot;</p>
                            <p>{getFormattedDuration(target.createdAt)}</p>
                        </div>
                        <p className="reply-popup__target-details__content">{target.content}</p>
                        {target.file.present && (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${target.file.data}`}
                                className="reply-popup__target-details__file"
                                alt="Post File"
                            />
                        )}
                        <p className="reply-popup__target-details__replying">
                            Replying to <span>@{target.user.username}</span>
                        </p>
                    </div>
                </section>
                <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                }} className="reply-popup__form">
                    <Link
                        to={`/profile/${user?._id}`}
                        className="reply-popup__form-profile"
                    >
                        <ProfilePicture
                            user={user!}
                        />
                    </Link>
                    <div className="reply-popup__form-container">
                        <textarea
                            ref={replyRef}
                            onChange={handleReplyChange}
                            value={reply}
                            maxLength={280}
                            minLength={0}
                            className="reply-popup__form-reply"
                            placeholder="Post your reply"
                        />
                        {(file && blobURL) && (
                            <div className="tweet__form-content__preview reply-popup__form-preview">
                                <img
                                    src={blobURL}
                                    alt="File Preview"
                                    className="tweet__form-content__preview-image"
                                />
                                <div onClick={() => {
                                    setFile(null);
                                    setBlobURL("");
                                }} title="Remove" className="tweet__form-content__preview-remove">
                                    <CloseIcon />
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                <section className="reply-popup__interaction">
                    <div className="home__form-content__options reply-popup__interaction-actions">
                        <div onClick={handleFileClick} title="Media">
                            <MediaIcon />
                            <input
                                type="file"
                                id="reply-popup__file"
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
                        className="reply-popup__interaction-submit"
                        disabled={((reply.trim().length < 1) && !file) ? true : false}
                        onClick={handleReplySubmit}
                        style={loadingReplyCreate ? { backgroundColor: "rgba(29, 155, 240, 0.5)" } : {}}
                    >
                        {loadingReplyCreate ? (
                            <Spinner
                                absolute={false}
                                height="1.4rem"
                                width="1.4rem"
                            />
                        ) : (
                            "Reply"
                        )}
                    </button>
                </section>
            </div>
        </div>
    )
}

export default ReplyPopup;