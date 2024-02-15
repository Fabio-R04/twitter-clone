import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { IUser } from "../../features/auth/authInterfaces";
import CloseIcon from "../svg/CloseIcon";
import CameraIcon from "./svg/CameraIcon";
import ProfilePicture from "../layout/ProfilePicture";
import { editProfile, resetAuth } from "../../features/auth/authSlice";
import Spinner from "../pending/Spinner";

interface EditProfileProps {
    userInfo: IUser;
    setEditProfileActive: (value: boolean) => void;
}

interface EditProfileForm {
    name: string;
    bio: string;
    location: string;
    website: string;
}

export interface EditProfileData {
    removeBG: boolean;
    fileBGName?: string;
    filePFPName?: string;
    fileBG: File | null;
    filePFP: File | null;
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
}

function EditProfile({ userInfo, setEditProfileActive }: EditProfileProps) {
    const [removeBGActive, setRemoveBGActive] = useState<boolean>(false);
    const [fileBG, setFileBG] = useState<File | null>(null);
    const [blobUrlBG, setBlobUrlBG] = useState<string>("");
    const [filePFP, setFilePFP] = useState<File | null>(null);
    const [blobUrlPFP, setBlobUrlPFP] = useState<string>("");
    const [profileData, setProfileData] = useState<EditProfileForm>({
        name: "",
        bio: "",
        location: "",
        website: ""
    });
    const {
        loadingAuthEdit,
        successAuth,
        messageAuth
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setProfileData({
            name: userInfo.name,
            bio: userInfo.bio,
            location: userInfo.location,
            website: userInfo.website
        });
    }, []);

    useEffect(() => {
        if (successAuth && (messageAuth === "PROFILE UPDATED")) {
            setEditProfileActive(false);
        }
        dispatch(resetAuth());
    }, [successAuth, messageAuth, dispatch]);

    const handleFileClick = (type: string): void => {
        let input: HTMLInputElement | undefined = undefined;

        if (type === "BG") {
            input = document.querySelector("#edit-profile__file-bg") as HTMLInputElement;
        } else if (type === "PFP") {
            input = document.querySelector("#edit-profile__file-pfp") as HTMLInputElement;
        }

        if (input) {
            input.value = "";
            input.click();
        }
    }

    const handleFileBGChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            setFileBG(event.target.files[0]);
            setBlobUrlBG(URL.createObjectURL(event.target.files[0]));
            setRemoveBGActive(false);
        }
    }

    const handleRemoveBG = (): void => {
        setFileBG(null);
        setBlobUrlBG("");
        setRemoveBGActive(true);
    }

    const handleFilePFPChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            setFilePFP(event.target.files[0]);
            setBlobUrlPFP(URL.createObjectURL(event.target.files[0]));
        }
    }

    const handleProfileInfoChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setProfileData((prevState: EditProfileForm) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const saveProfile = (): void => {
        const data: EditProfileData = {
            removeBG: removeBGActive,
            fileBGName: fileBG ? fileBG.name : undefined,
            filePFPName: filePFP ? filePFP.name : undefined,
            fileBG,
            filePFP,
            name: profileData.name,
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website
        }
        dispatch(editProfile(data));
    }

    return (
        <div
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                const target = event.target as HTMLDivElement;
                if (target.id === "edit-profile") {
                    setEditProfileActive(false);
                }
            }}
            className="edit-profile"
            id="edit-profile"
        >
            <div className="edit-profile__container">
                <div className="edit-profile__popup">
                    <header className="edit-profile__header">
                        <div onClick={() => setEditProfileActive(false)} title="Close" className="edit-profile__header-close">
                            <CloseIcon />
                        </div>
                        <p className="edit-profile__header-title">Edit profile</p>
                        <button onClick={saveProfile} className="edit-profile__header-save">
                            {loadingAuthEdit ? (
                                <Spinner
                                    absolute={false}
                                    height="1.3rem"
                                    width="1.3rem"
                                />
                            ) : (
                                "Save"
                            )}
                        </button>
                    </header>
                    <div className="edit-profile__bg">
                        {!fileBG ? (
                            (userInfo.hasBG.present && !removeBGActive) ? (
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${userInfo.hasBG.image}`}
                                    alt="Background Picture"
                                    className="edit-profile__bg-image"
                                />
                            ) : (
                                <div
                                    style={{ backgroundColor: userInfo.hasBG.color }}
                                    className="edit-profile__bg-default"
                                ></div>
                            )
                        ) : (
                            <img
                                src={blobUrlBG}
                                alt="Background Picture"
                                className="edit-profile__bg-image"
                            />
                        )}
                        <div className="edit-profile__bg-interact">
                            <div onClick={() => handleFileClick("BG")} title="Add photo" className="edit-profile__bg-new">
                                <CameraIcon />
                                <input
                                    onChange={handleFileBGChange}
                                    type="file"
                                    hidden={true}
                                    id="edit-profile__file-bg"
                                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
                                />
                            </div>
                            {(((fileBG && blobUrlBG) || userInfo.hasBG.present) && !removeBGActive) && (
                                <div onClick={handleRemoveBG} title="Remove" className="edit-profile__bg-remove">
                                    <CloseIcon />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="edit-profile__pfp">
                        {!filePFP ? (
                            <ProfilePicture
                                key={userInfo._id}
                                user={userInfo}
                                className="edit-profile__pfp-image"
                            />
                        ) : (
                            <img
                                src={blobUrlPFP}
                                alt="Profile Picture"
                                className="edit-profile__pfp-image"
                            />
                        )}
                        <div onClick={() => handleFileClick("PFP")} title="Add photo" className="edit-profile__pfp-new">
                            <CameraIcon />
                            <input
                                onChange={handleFilePFPChange}
                                type="file"
                                hidden={true}
                                id="edit-profile__file-pfp"
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
                            />
                        </div>
                    </div>
                    <div className="edit-profile__info">
                        <div className={`edit-profile__info-field ${profileData.name.length > 0 ? "edit-profile__info-field--active" : ""}`}>
                            <div className="edit-profile__info-field__top">
                                <p className="edit-profile__info-field__name">Name</p>
                                <p className="edit-profile__info-field__length">{profileData.name.length} / 50</p>
                            </div>
                            <input
                                value={profileData.name}
                                onChange={handleProfileInfoChange}
                                type="text"
                                name="name"
                                className="edit-profile__info-field__input"
                                placeholder="Name"
                                maxLength={50}
                                minLength={0}
                            />
                        </div>
                        <div className={`edit-profile__info-field ${profileData.bio.length > 0 ? "edit-profile__info-field--active" : ""}`}>
                            <div className="edit-profile__info-field__top">
                                <p className="edit-profile__info-field__name">Bio</p>
                                <p className="edit-profile__info-field__length">{profileData.bio.length} / 160</p>
                            </div>
                            <input
                                value={profileData.bio}
                                onChange={handleProfileInfoChange}
                                type="text"
                                name="bio"
                                className="edit-profile__info-field__input"
                                placeholder="Bio"
                                maxLength={160}
                                minLength={0}
                            />
                        </div>
                        <div className={`edit-profile__info-field ${profileData.location.length > 0 ? "edit-profile__info-field--active" : ""}`}>
                            <div className="edit-profile__info-field__top">
                                <p className="edit-profile__info-field__name">Location</p>
                                <p className="edit-profile__info-field__length">{profileData.location.length} / 30</p>
                            </div>
                            <input
                                value={profileData.location}
                                onChange={handleProfileInfoChange}
                                type="text"
                                name="location"
                                className="edit-profile__info-field__input"
                                placeholder="Location"
                                maxLength={30}
                                minLength={0}
                            />
                        </div>
                        <div className={`edit-profile__info-field ${profileData.website.length > 0 ? "edit-profile__info-field--active" : ""}`}>
                            <div className="edit-profile__info-field__top">
                                <p className="edit-profile__info-field__name">Website</p>
                                <p className="edit-profile__info-field__length">{profileData.website.length} / 100</p>
                            </div>
                            <input
                                value={profileData.website}
                                onChange={handleProfileInfoChange}
                                type="text"
                                name="website"
                                className="edit-profile__info-field__input"
                                placeholder="Website"
                                maxLength={100}
                                minLength={0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile;