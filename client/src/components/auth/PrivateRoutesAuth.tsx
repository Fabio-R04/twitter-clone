import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutesAuth() {
    const { user } = useAppSelector((state) => state.auth);

    return (
        user ? <Navigate to="/home" /> : <Outlet />
    )
}

export default PrivateRoutesAuth;