import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string,
    email: string,
    password: string;
    bio: string;
    location: string;
    website: string;
    hasPFP: {
        present: boolean;
        image: string;
    };
    hasBG: {
        present: boolean;
        color: string;
        image: string;
    };
    followers: string[] | IUser[];
    following: string[] | IUser[];
    followersLookup: { [key: string]: string | IUser };
    followingLookup: { [key: string]: string | IUser };
    createdAt: Date;
    updatedAt: Date;
}

export interface IGoogleUser {
    email: string;
    email_verified: boolean;
    given_name: string;
    name: string;
    locale: string;
    picture: string;
    sub: string;
}

const authSchema: Schema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: "" },
    bio: { type: String, required: false, default: "" },
    location: { type: String, required: false, default: "" },
    website: { type: String, required: false, default: "" },
    hasPFP: { type: {
        present: Boolean,
        image: String,
        _id: false
    }, required: false, default: { present: false, image: "" } },
    hasBG: { type: {
        present: Boolean,
        color: String,
        image: String,
        _id: false
    }, required: false, default: { present: false, color: "#333639", image: "" } },
    followers: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: []},
    following: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: []},
    followersLookup: { type: Object, default: {} },
    followingLookup: { type: Object, default: {} }
}, {
    timestamps: true,
    minimize: false
});

export default mongoose.model<IUser>("User", authSchema);