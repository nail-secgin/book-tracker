import express from "express";
import cors from "cors";
import api from "./api.js";
import auth from "./auth.js";
import session from "express-session";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(api);
app.use(auth);

app.listen(3000);