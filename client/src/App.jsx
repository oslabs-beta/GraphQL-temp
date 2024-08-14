import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./contexts/AuthContext.js";
import { ThemeProvider } from "./contexts/ThemeContext.js";
import "./index.scss"

const Main = lazy(() => import("./components/Main/Main"));
const Signup = lazy(() => import("./components/Signup/Signup"));
const Login = lazy(() => import("./components/Login/Login"));
const Team = lazy(() => import('./components/Team/Team'));
const About = lazy(() => import('./components/About/About'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Graph = lazy(() => import('./components/Graph/Graph'));
import { GraphProvider } from './contexts/GraphContext';

const Loading = () => <div>Loading...</div>;

// A wrapper for <Route> that redirects to the login page if the user is not authenticated.
const PrivateRoutes = () => {
    const { authState, setAuthState } = useAuth();
    
    if (authState.loading) {
        return <div>Loading...</div>;
    }
    if (!authState.isAuth) {
        return <Navigate to="/login" />;
    }
    // if logged im
    return (
        <GraphProvider>
            <Outlet />
        </GraphProvider>
    )
};

const AppRoutes = () => (
    <Suspense fallback={<Loading />}>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/team" element={<Team />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route element={<PrivateRoutes />}>
                <Route path="/graph/:userId/:graphId" element={<Graph />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    </Suspense>
);

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <AppRoutes />
                </ThemeProvider>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;