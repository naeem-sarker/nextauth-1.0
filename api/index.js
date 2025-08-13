import express from "express";
import jwt from "jsonwebtoken"

const app = express();

app.use(express.json())

const user = {
    id: 1234,
    name: "Naeem Sarker",
    email: "naeem@gmail.com",
    password: "naeem",
    role: "ADMIN"
}

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Unauthorized Access" })
    }

    const user = jwt.verify(token, "JWT_SECRET")

    if (!user) {
        return res.status(401).json({ message: "Unauthorized Access" })
    }

    req.user = user;
    next();
}

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (user.email !== email || user.password !== password) {
        return res.status(400).json({ message: "Failed to login" })
    }

    const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role };

    const accessToken = jwt.sign(userPayload, "JWT_SECRET", { expiresIn: "2m" });
    const refreshToken = jwt.sign(userPayload, "JWT_SECRET", { expiresIn: "5m" });

    return res.status(201).json({
        data: {
            user,
            accessToken,
            refreshToken
        }
    })
})

app.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, "JWT_SECRET")
    let i = 1;
    console.log("refresh", i++)

    const accessToken = jwt.sign({ id: user.id, email: user.email }, "JWT_SECRET", { expiresIn: "2m" });

    res.json({ accessToken });
});


app.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({ user })
})

app.listen(4000, () => {
    console.log("server is running")
})