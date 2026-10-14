import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5001"
        : window.location.origin;

// Get or initialize singleton socket instance
export const getSocket = () => {
    if (!socket || !socket.connected) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: true,
            transports: ["websocket", "polling"],
        });
    }
    return socket;
};

// Disconnect and reset socket
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
