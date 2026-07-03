//Express app banayega
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Frontend agar bheje:
// {
//     "email":"abc@gmail.com",
//     "password":"123456"
// }
//To ye middleware us JSON ko parse karega.
app.use(express.json());
//JWT cookies read karne ke liye.
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Backend is Running 🚀");
});

export default app;