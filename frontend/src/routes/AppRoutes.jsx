import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Problems from "../pages/Problems";
import ProblemDetails from "../pages/ProblemDetails";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import BattleLobby from "../pages/BattleLobby";
import BattleWaiting from "../pages/BattleWaiting";
import BattleArena from "../pages/BattleArena";
import BattleResult from "../pages/BattleResult";

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
                
                {/* User Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/battle" element={<BattleLobby />} />
                    <Route path="/battle/waiting/:roomCode" element={<BattleWaiting />} />
                    <Route path="/battle/arena/:roomCode" element={<BattleArena />} />
                    <Route path="/battle/result/:roomCode" element={<BattleResult />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute adminOnly={true} />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;