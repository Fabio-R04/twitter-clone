import React from "react";
import { IUser } from "../../features/auth/authInterfaces";

interface BackgroundPictureProps {
    user: IUser;
    classNameImage: string;
    classNameDiv: string;
}

function BackgroundPicture({ user, classNameImage, classNameDiv }: BackgroundPictureProps) {
    return (
        user.hasBG.present ? (
            <img
                src={`${process.env.REACT_APP_SERVER_URL}/uploads/${user.hasBG.image}`}
                alt="Background Picture"
                className={classNameImage}
            />
        ) : (
            <div
                style={{ backgroundColor: user.hasBG.color }}
                className={classNameDiv}
            ></div>
        )
    )
}

export default BackgroundPicture;