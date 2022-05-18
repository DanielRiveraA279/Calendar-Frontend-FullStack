import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { uid } = useSelector(state => state.auth)
    return (
        !!uid //!!'cadena' para transformar en boolean y validar true o false
            ? children //cualquier pantalla
            : <Navigate to="/login" /> //login
    )
}

export default PrivateRoute;