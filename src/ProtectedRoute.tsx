import React from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useMoralis} from "react-moralis";

// @ts-ignore
export const ProtectedRoute = ({ children }) => {
    const {isAuthenticated} = useMoralis();
    const location = useLocation();
    return isAuthenticated ?
        children :
        (<Navigate to="/" replace state={{from:location}} />);
}

