import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// POST /api/auth/register
export const registerUser = async (req, res) => {
   const { fullName, companyName, email, password, role } = req.body;

   try {
      //1. Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: "Email already registered" });
      }
      //2. Hash the password
      const salt = bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //3. Create new user
      const newUser = await User.create({
         fullName,
         companyName,
         email,
         password: hashedPassword,
         role,
      });

      // 4. Create JWT token
      const accessToken = jwt.sign(
         { id: newUser._id, role: newUser.role },
         process.env.JWT_SECRET,
         { expiresIn: "15m" } //short lived
      );
      const refreshToken = jwt.sign(
         { id: newUser._id, role: newUser.role },
         process.env.JWT_REFRESH_SECRET,
         { expiresIn: "7d" } //long lived
      );
      // 5. Send refresh token as httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production", // HTTPS in production
         sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 6. Send access token in response
      res.status(201).json({
         message: "User registered successfully",
         accessToken,
         user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
         },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};
