import User from "../models/userSchema.js";
import bcrypt from 'bcryptjs';
import exp from "constants";
import jwt from 'jsonwebtoken'
import path from "path";


export const Register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists this email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });
        if (!user) return res.status(500).json({ message: "User creation failed" });
        // const token= jwt.sign({"e-commerceTwo" : user._id}, "test", {expiresIn:"1h"});

        res.status(201).json({ message: "User created successfully", success: true, user });


    } catch (error) {
        console.log("🚀 ~ file: userController.js:21 ~ error:", error);
        res.status(404).json({
            message: "failed to register user",
            success: false,
            error: error.message,
        })
    }

}


export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ "commerceTwo": user._id }, "test", { expiresIn: "24h" });
        res.cookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly: true,
            sameSite: "lax"

        });
        res.status(200).json({ message: "User logged in successfully", success: true });

    } catch (error) {
        res.status(404).json({ message: "failed to login user", success: false, error: error.message });

    }

}


export const logout = (req, res) => {
    res.clearCookie('token'); // Clear the 'token' cookie
    res.status(200).json({ message: "Logout successfully !", success: true });
};



