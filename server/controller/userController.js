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

        // const token = jwt.sign(
        //     { id: newUser.id, email: newUser.email, role: "user" },
        //     JWT_SECRET,
        //     { expiresIn: "7d" }   // Persistent login for 7 days
        // );

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "Lax",
        //     maxAge: 60 * 60 * 1000 
        // });

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
        // console.log(user, "hi i am user from login")

        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid email or password" });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }  
        );

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "Lax",
        //     maxAge: 60 * 60 * 1000 
        // });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            data: {
                id: user.id,
                email: user.email,
                userName: user.username,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error("Error in LoginUser:", error);
        return res.status(500).json({ success: false, message: "Error logging in", error: error.message });
    }
};

// ✅ Check Authentication
// export const CheckAuth = async (req, res) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const user = await prisma.user.findUnique({ where: { id: decoded.id } });

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         return res.status(200).json({
//             success: true,
//             message: "User authenticated",
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 userName: user.username,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             return res.status(401).json({ success: false, message: "Token expired" });
//         }

//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };

export const CheckAuth = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token, "token from check auth") //it is coming as undefined

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            message: "User authenticated",
            user: {
                id: user.id,
                email: user.email,
                userName: user.username,
                role: user.role
            }
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
