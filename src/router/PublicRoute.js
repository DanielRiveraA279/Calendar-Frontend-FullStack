import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const { uid } = useSelector(state => state.auth)

    return (!!uid //!!'cadena' para transformar en boolean y validar true o false
        ? <Navigate to="/" /> //calendario
        : children //login

    )
}

export default PublicRoute;