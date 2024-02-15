import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { ITweet } from "../features/tweet/interfaces/tweetInterface";
import { IReply } from "../features/tweet/interfaces/replyInterface";
import { Link } from "react-router-dom";
import DeleteIcon from "./home/svg/DeleteIcon";
import EngagementsIcon from "./home/svg/EngagementsIcon";
import FollowIcon from "./home/svg/FollowIcon";
import UnfollowIcon from "./home/svg/UnfollowIcon";
import Spinner from "./pending/Spinner";
import { follow, setLoadingFollow } from "../features/auth/authSlice";

interface MoreOptionsProps {
    type: string;
    details: ITweet | IReply;
    setMoreOptionsActive: (value: boolean) => void;
    handleDelete: () => void;
}

function MoreOptions({ type, details, setMoreOptionsActive, handleDelete }: MoreOptionsProps) {
    const {
        user,
        loadingAuthFollow
    } = useAppSelector((state) => state.auth);
    const {
        loadingReplyDelete
    } = useAppSelector((state) => state.reply);
    const {
        loadingTweetDelete
    } = useAppSelector((state) => state.tweet);

    const dispatch = useAppDispatch();

    const handleFollow = (): void => {
        dispatch(setLoadingFollow(details?.user?._id));
        dispatch(follow(details?.user?._id));
    }

    return (
        <>
            <div className="home__tweets-more">
                {details?.user?._id === user?._id ? (
                    <div onClick={() => handleDelete()} className="home__tweets-more__delete">
                        {(loadingReplyDelete || loadingTweetDelete) ? (
                            <Spinner
                                absolute={false}
                                height="1.8rem"
                                width="1.8rem"
                            />
                        ) : (
                            <DeleteIcon />
                        )}
                        <p>Delete</p>
                    </div>
                ) : (
                    details?.user?.followersLookup[user?._id!] ? (
                        <div onClick={handleFollow} className="home__tweets-more__interact">
                            {(loadingAuthFollow.active && (loadingAuthFollow.userId === details?.user?._id)) ? (
                                <Spinner
                                    absolute={false}
                                    height="1.8rem"
                                    width="1.8rem"
                                />
                            ) : (
                                <UnfollowIcon />
                            )}

                            <p>Unfollow @{details?.user?.username}</p>
                        </div>
                    ) : (
                        <div onClick={handleFollow} className="home__tweets-more__interact">
                            {(loadingAuthFollow.active && (loadingAuthFollow.userId === details?.user?._id)) ? (
                                <Spinner
                                    absolute={false}
                                    height="1.8rem"
                                    width="1.8rem"
                                />
                            ) : (
                                <FollowIcon />
                            )}
                            <p>Follow @{details?.user?.username}</p>
                        </div>
                    )
                )}
                <Link to={`/engagements/${details?._id}/retweets/${type === "tweet" ? "tweet" : "reply"}`} className="home__tweets-more__engagements">
                    <EngagementsIcon />
                    <p>View post engagements</p>
                </Link>
            </div>
            <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                const target = event.target as HTMLDivElement;
                if (target.id === "home__tweets-more__container") {
                    setMoreOptionsActive(false);
                }
            }} className="home__tweets-more__container" id="home__tweets-more__container"></div>
        </>
    )
}

export default MoreOptions;