import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { startChecking } from '../actions/auth';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const AppRouter = () => {

    const dispatch = useDispatch();
    const { checking } = useSelector(state => state.auth);

    //verificar token para ver si es valido o revalidar token, para proteger las respectivas rutas
    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch]);


    if (checking) {
        return (<h5>Espere...</h5>);
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginScreen />
                    </PublicRoute>
                }
                />

                <Route path="/*" element={
                    <PrivateRoute>
                        <CalendarScreen />
                    </PrivateRoute>
                }
                />
            </Routes>
        </Router>
    )
};
