import { Router } from "express";
import db from "./database.js"
import { SqliteError } from "better-sqlite3";
import bcrypt from 'bcrypt';

const router = Router();

interface PasswordData {
    password_hash: string;
}

interface UserData {
    id: number;
}

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function verifyPassword(password: string, hash:string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

async function checkUserExists(username: string, email: string): Promise <boolean> {
    const username_check = db.prepare(`
        SELECT username FROM user
        WHERE username = ?
    `);

    const email_check = db.prepare(`
        SELECT email FROM user
        WHERE email = ?
    `);

    // Email taken
    if (email_check.get(email)) {
        return true;
    }

    // Username taken
    if (username_check.get(username)) {
        return true;
    } 
    return false;
}   

// Post new user to database (Register)
router.post("/register", async (req, res) => {
    // Input validation
    const username = req.body.username;
    const usernameRegex = /^[a-zA-Z0-9_]{3,12}$/
    if(!username || !usernameRegex.test(username)) {
        res.status(400).send("Invalid username");
        return;
    }

    const email = req.body.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email || !emailRegex.test(email)) {
        res.status(400).send("Invalid E-Mail");
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!req.body.password || !passwordRegex.test(req.body.password)) {
        res.status(400).send("Invalid password");
        return;
    }
    // Hash password
    const password = await hashPassword(req.body.password);

    // Check if user already exists
    if (await checkUserExists(username, email)) {
        res.status(400).send("Username or Email already taken")
        return;
    }

    const new_user = db.prepare(`
        INSERT INTO user (username, email, password_hash)
        VALUES (?, ?, ?)
    `);
    
    try {
        // Create user
        new_user.run(username, email, password);
        res.send("User successfully registered");
    } catch(error) {
        // Error handling
        if(error instanceof SqliteError && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            res.status(409).send("User data conflict");
            return;
        }
        
        if (error instanceof Error) {
            res.status(500).send(error.message)
            return;
        }
    }
});

router.post("/login", async (req, res) => {
    // Input validation
    const username = req.body.username;
    const usernameRegex = /^[a-zA-Z0-9_]{3,12}$/
    if(!username || !usernameRegex.test(username)) {
        res.status(400).send("Invalid username or password");
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!req.body.password || !passwordRegex.test(req.body.password)) {
        res.status(400).send("Invalid username or password");
        return;
    }

    const password_hash_result = db.prepare(`
        SELECT password_hash FROM user
        WHERE username = ?
    `);
    const password_hash:PasswordData = password_hash_result.get(username) as PasswordData
    if (!password_hash) {
        res.status(400).send("Invalid username or password");
        return;
    }

    // Check if password matches the hash, if yes set session to userId
    if (await verifyPassword(req.body.password, password_hash.password_hash)) {
        const user_id = db.prepare(`
            SELECT id FROM user
            WHERE username = ?
        `).get(username) as UserData;
        req.session.userId = user_id.id;
        res.send("Login successful");
    } else {
        res.status(401).send("Invalid username or password");
        return;
    }
});

router.get("/login", (req, res) => {
    if (!req.session.userId) {
        res.status(401).send("Not logged in");
        return;
    }

    const user_id = req.session.userId;

    res.send(user_id);

});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send("Logout failed");
            return;
        }
        
        res.send("Logged out");
    });
})

export default router;