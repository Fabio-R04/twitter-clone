import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { googleLogin, login } from "../features/auth/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import AuthLogo from "../components/auth/svg/AuthLogo";
import GoogleIcon from "../components/auth/svg/GoogleIcon";
import DemoIcon from "../components/auth/svg/DemoIcon";
import AuthFooter from "../components/auth/AuthFooter";
import RegisterPopup from "../components/auth/RegisterPopup";
import LoginPopup from "../components/auth/LoginPopup";
import Spinner from "../components/pending/Spinner";

function Auth() {
    const [registerActive, setRegisterActive] = useState<boolean>(false);
    const [loginActive, setLoginActive] = useState<boolean>(false);
    const {
        loadingAuthUser,
        successAuth
    } = useAppSelector((state) => state.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (successAuth) {
            navigate("/home");
        }
    }, [successAuth, navigate, dispatch]);

    const handleDemoLogin = (): void => {
        const demoEmail: string = `${process.env.REACT_APP_DEMO_EMAIL}`;
        const demoPassword: string = `${process.env.REACT_APP_DEMO_PASSWORD}`;
        dispatch(login({
            email: demoEmail,
            password: demoPassword
        }));
    }

    const handleGoogleLoginSuccess = (tokenResponse: any): void => {
        const accessToken: string = tokenResponse.access_token;
        dispatch(googleLogin(accessToken));
    }

    const handleGoogleLoginClick = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });

    return (
        <>
            <div className="auth">
                <div className="auth__content">
                    <div className="auth__content-logo">
                        <AuthLogo />
                    </div>
                    <div className="auth__content-details">
                        <h1 className="auth__content-details__title">Happening now</h1>
                        <p className="auth__content-details__subtitle">Join today.</p>
                        <div className="auth__content-details__options">
                            <button onClick={() => handleGoogleLoginClick()} className="auth__content-details__google">
                                <GoogleIcon />
                                Sign in with Google
                            </button>
                            <button onClick={handleDemoLogin} className="auth__content-details__demo">
                                {loadingAuthUser ? (
                                    <Spinner
                                        absolute={false}
                                        height="2rem"
                                        width="2rem"
                                    />
                                ) : (
                                    <>
                                        <DemoIcon />
                                        Sign in with Demo
                                    </>
                                )}
                            </button>
                            <p className="auth__content-details__or">or</p>
                            <button onClick={() => setRegisterActive(true)} className="auth__content-details__register">
                                Create account
                            </button>
                            <p className="auth__content-details__terms">
                                By signing up, you agree to the <span>Terms of Service</span> and <span>Privacy
                                    Policy</span>, including <span>Cookie Use.</span>
                            </p>
                        </div>
                        <div className="auth__content-details__login">
                            <p>Already have an account?</p>
                            <button onClick={() => setLoginActive(true)}>Sign in</button>
                        </div>
                    </div>
                </div>
                <AuthFooter />
            </div>
            {registerActive && (
                <RegisterPopup
                    setRegisterActive={setRegisterActive}
                />
            )}
            {loginActive && (
                <LoginPopup
                    setLoginActive={setLoginActive}
                />
            )}
        </>
    )
}

export default Auth;