import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { login, resetAuth } from "../../features/auth/authSlice";
import CloseIcon from "../svg/CloseIcon";
import Spinner from "../pending/Spinner";
import AuthLogo from "./svg/AuthLogo";

interface LoginPopupProps {
    setLoginActive: (value: boolean) => void;
}

export interface LoginData {
    email: string;
    password: string;
}

function LoginPopup({ setLoginActive }: LoginPopupProps) {
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const { loadingAuthUser } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormData((prevState: LoginData) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        dispatch(login({
            email: formData.email,
            password: formData.password
        }));
    }

    return (
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLDivElement;
            if (target.id === "auth__container") {
                setLoginActive(false);
            }
        }} className="auth__container" id="auth__container">
            <div className="auth__popup">
                {loadingAuthUser ? (
                    <Spinner
                        height="2.5rem"
                        width="2.5rem"
                    />
                ) : (
                    <>
                        <div onClick={() => setLoginActive(false)} title="Close" className="auth__popup-close">
                            <CloseIcon />
                        </div>
                        <div className="auth__popup-logo">
                            <AuthLogo />
                        </div>
                        <p style={{ marginTop: "6rem" }} className="auth__popup-title">Sign in to X</p>
                        <form onSubmit={onSubmit} className="auth__popup-form">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={onChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={onChange}
                                required
                            />
                            <button style={{ marginTop: "auto" }} type="submit">Sign in</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default LoginPopup;