import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Problems from "../pages/Problems";
import ProblemDetails from "../pages/ProblemDetails";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

function AppRoutes() {

    return (

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Routes with Layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route
                    path="/problems/:problemId"
                    element={<ProblemDetails />}
                />
                <Route path="/profile" element={<Profile />} />
            </Route>
            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>

    );

}

export default AppRoutes;