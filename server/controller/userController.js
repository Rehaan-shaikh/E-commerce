import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
    const { userName, email, password } = req.body;
    // console.log("Request Body:", req.body);
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("Hashed Password:", hashedPassword);

        // Check if user already exists
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        console.log(user);
        if (user) {
            // If user exists, return a 409 Conflict status
            console.log("Hello World");
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username: userName,
                email: email,
                password: hashedPassword, // Store hashed password
            },
        });

        // console.log("New User Created:", newUser);
        return res.status(201).json({ success: true, data: newUser, message: "User created successfully" });

    } catch (error) {
        console.error("Error in RegisterUser:", error);
        return res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // If user not found
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid email or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, email: user.email , role : user.role }, "your_secret_key", { expiresIn: "1h" });

        return res.json({ status: 200, data: user, token: token, message: "Login successful" , success : true});
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error logging in", error: error.message });
    }
};
