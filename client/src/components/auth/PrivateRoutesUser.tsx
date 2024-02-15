import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

function PrivateRoutesUser() {
    const { user } = useAppSelector((state) => state.auth);

    return (
        user ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutesUser;