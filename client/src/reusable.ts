import { AxiosError } from "axios";
import moment from "moment";
import { TweetsAndReplies } from "./features/auth/authInterfaces";
import { ITweet } from "./features/tweet/interfaces/tweetInterface";
import { IReply } from "./features/tweet/interfaces/replyInterface";

export const URL: string = `${process.env.REACT_APP_SERVER_URL}`;

export const getConfig = (token: string | null) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

export const checkTokenValidity = (error: AxiosError): boolean => {
    if (error.response?.status === 403) {
        return false;
    }
    return true;
}

export const getFormattedDuration = (startDate: Date) => {
    const duration = moment.duration(moment().diff(moment(startDate)))
    if (duration.asSeconds() < 60) {
        return duration.asSeconds().toFixed(0) + 's'
    } else if (duration.asMinutes() < 60) {
        return duration.asMinutes().toFixed(0) + 'm'
    } else if (duration.asHours() < 24) {
        return duration.asHours().toFixed(0) + 'h'
    } else {
        return moment(startDate).format('MMM DD')
    }
}

export const isTweet = (element: TweetsAndReplies): element is ITweet => {
    return (element as ITweet)._id !== undefined;
}

export const isReply = (element: TweetsAndReplies): element is IReply => {
    return (element as IReply).mainTweet !== undefined;
}