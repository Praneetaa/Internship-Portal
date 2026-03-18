import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate token
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

//@desc Register new user
export const register = async (req, res) => {
   try {
      const { name, email, password, avatar, role } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists)
         return res.status(400).json({ message: "User already exists" });

      const user = await User.create({ name, email, password, role, avatar });
      // res.status(201).json({
      //    _id: user._id,
      //    name: user.name,
      //    email: user.email,
      //    avatar: user.avatar,
      //    role: user.role,
      //    token: generateToken(user._id),
      //    companyName: user.companyName || "",
      //    companyDescription: user.companyDescription || "",
      //    companyLogo: user.companyLogo || "",
      //    resume: user.resume || "",
      // });
      console.log(user);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//@desc Login user
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
         return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         avatar: user.avatar,
         role: user.role,
         token: generateToken(user._id),
         companyName: user.companyName || "",
         companyDescription: user.companyDescription || "",
         companyLogo: user.companyLogo || "",
         resume: user.resume || "",
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//@desc Get logged-in user
export const getMe = async (req, res) => {
   res.json(req.user);
};

// // POST /api/auth/register
// export const registerUser = async (req, res) => {
//    const { fullName, companyName, email, password, role } = req.body;

//    try {
//       //Check if the user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//          return res.status(400).json({ message: "Email already registered" });
//       }
//       //Hash the password
//       const salt = bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Create new user
//       const newUser = await User.create({
//          fullName,
//          companyName,
//          email,
//          password: hashedPassword,
//          role,
//       });

//       // 4 Create JWT token
//       const accessToken = jwt.sign(
//          { id: newUser._id, role: newUser.role },
//          process.env.JWT_SECRET,
//          { expiresIn: "15m" } //short lived
//       );
//       const refreshToken = jwt.sign(
//          { id: newUser._id, role: newUser.role },
//          process.env.JWT_REFRESH_SECRET,
//          { expiresIn: "7d" } //long lived
//       );
//       //Send refresh token as httpOnly cookie
//       res.cookie("refreshToken", refreshToken, {
//          httpOnly: true,
//          secure: process.env.NODE_ENV === "production", // HTTPS in production
//          sameSite: "strict",
//          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       });

//       //Send access token in response
//       res.status(201).json({
//          message: "User registered successfully",
//          accessToken,
//          user: {
//             id: newUser._id,
//             fullName: newUser.fullName,
//             email: newUser.email,
//             role: newUser.role,
//          },
//       });
//    } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//    }
// };
