import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { register } from "../../features/auth/authSlice";
import CloseIcon from "../svg/CloseIcon";
import Spinner from "../pending/Spinner";

interface RegisterPopupProps {
    setRegisterActive: (value: boolean) => void;
}

export interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
}

function RegisterPopup({ setRegisterActive }: RegisterPopupProps) {
    const [formData, setFormData] = useState<RegisterData>({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const { loadingAuthUser } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();

    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormData((prevState: RegisterData) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        dispatch(register({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password
        }));
    }

    return (
        <div onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLDivElement;
            if (target.id === "auth__container") {
                setRegisterActive(false);
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
                        <div onClick={() => setRegisterActive(false)} title="Close" className="auth__popup-close">
                            <CloseIcon />
                        </div>
                        <p className="auth__popup-title">Create your account</p>
                        <form onSubmit={onSubmit} className="auth__popup-form">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={onChange}
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={onChange}
                                required
                            />
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
                            <button type="submit">Sign up</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default RegisterPopup;