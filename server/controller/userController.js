import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";  // Store in env in production

// ✅ Register User
export const RegisterUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { username: userName, email, password: hashedPassword }
        });

        //doesnt necessarily need this during registration
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: "user" },
            JWT_SECRET,
            { expiresIn: "7d" }   // Persistent login for 7 days
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000 
        });

        return res.status(201).json({
            status: 201,
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                userName: newUser.username
            }
        });

    } catch (error) {
        console.error("Error in RegisterUser:", error);
        return res.status(500).json({ success: false, message: "Error creating user", error: error.message });
    }
};

// ✅ Login User
export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email }, });
        console.log(user, "hi i am user from login")

        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid password" });
        }

        console.log(user, "hi i am user from login")
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
<<<<<<< HEAD
            { expiresIn: "1h" }                                                                                      
=======
            { expiresIn: "1h" }  
>>>>>>> 1fb8471b66e6164b87145384c91716f474f52b01
        );

        console.log(token, "hi i am token from login")

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
<<<<<<< HEAD
            maxAge: 60 * 60 * 1000   //1hr
=======
            maxAge: 60 * 60 * 1000 
>>>>>>> 1fb8471b66e6164b87145384c91716f474f52b01
        });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
<<<<<<< HEAD
            data: { // Key change: using "data" instead of "user" to match checkAuth
              id: user.id,
              email: user.email,
              username: user.username, // Make sure this matches your Prisma field name
              role: user.role // This should now properly reflect the DB value
=======
            user: {
                id: user.id,
                email: user.email,
                userName: user.username,
                role: user.role
>>>>>>> 1fb8471b66e6164b87145384c91716f474f52b01
            }
          });
    } catch (error) {
        console.error("Error in LoginUser:", error);
        return res.status(500).json({ success: false, message: "Error logging in", error: error.message });
    }
};

// ✅ Check Authentication
export const CheckAuth = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        console.log(user , "hi i am user data")

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(user , "hi i am user data")

        console.log(token, "hi i am token from login")

        return res.status(200).json({
            success: true,
            message: "User authenticated",
<<<<<<< HEAD
            user
=======
            user: {
                id: user.id,
                email: user.email,
                userName: user.username,
                role: user.role
            }
>>>>>>> 1fb8471b66e6164b87145384c91716f474f52b01
        });
        

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// ✅ Logout User
export const LogoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
};
