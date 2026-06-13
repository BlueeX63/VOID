import { sendcode } from "../libs/mail.js";
import user from "../models/user.model.js";
import redisClient from "../services/redis.service.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

async function userRegister(req, res) {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password, otp } = req.body;
    if (!email || !password || !username) {
      throw new Error("Email and password are required");
    }
    const isEmailAlreadyPresent = await user.findOne({ email });
    const valid = isEmailAlreadyPresent ? isEmailAlreadyPresent.isValidOtp : false;
    if (isEmailAlreadyPresent && valid) {
      return res.status(400).json({ message: "user already exists" });
    }
    const isUserNameAlreadyExist = await user.findOne({ username });
    if (isUserNameAlreadyExist && valid) {
      return res
        .status(400)
        .json({ message: "username already exist ,try another username" });
    }
    else if((isEmailAlreadyPresent || isUserNameAlreadyExist) && !valid){
      const toDelete = isEmailAlreadyPresent || isUserNameAlreadyExist;
      await user.findByIdAndDelete(toDelete._id);
    }
    const hashedPassword = await user.hashPassword(password);
    const verificationOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      verificationOtp,
    });

    await newUser.save()
    sendcode(newUser.email , newUser.verificationOtp)

    const token = await newUser.jsonWebToken();
    res.cookie("token", token);
    delete newUser._doc.password;
    delete newUser._doc.verificationOtp;

    res
      .status(200)
      .json({
        message: "user registered successfully",
        user: newUser,
        token: token,
      });
  } catch(err) {
    console.log(err)
    res.status(400).json({ message: "user is not registered" , error:err.message});
  }
}

async function verifyUser(req,res){
    try {
        const {code} = req.body;
        const verified = await user.findOne({verificationOtp:code})
        if(!verified){
            return res.status(400).json({message:"Invalid OTP"})
        }
        await user.findOneAndUpdate({verificationOtp:code},{isValidOtp:true, verificationOtp:undefined});
        
        return res.status(200).json({message:"Email verified successfully"})
    } catch (error) {
        console.error('Verification error:', error)
        return res.status(500).json({message:"Verification failed", error: error.message})
    }
}

async function userLogin(req, res) {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const valid = existingUser.isValidOtp
    if(!valid){
      return res.status(401).json({ message: "Email not verified. Please verify OTP." });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await existingUser.jsonWebToken();
    delete existingUser._doc.password;
    res.cookie("token", token);
    res
      .status(200)
      .json({ message: "Login successfull", token: token, user: existingUser });
  } catch {
    res.status(400).json({ message: "Login failed" });
  }
}

async function userProfile(req, res) {
  console.log(req.user);
  res.status(200).json({ user: req.user });
}

function userLogout(req, res) {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "logged out succefully" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
}

async function getAllUsers(req,res){
  try {
    const loggedinUser = await user.findOne({email:req.user.email})
    const allUsers = await user.find({_id:{$ne:loggedinUser._id}})
    return res.status(200).json({users:allUsers})
  } catch (error) {
    console.log(error)
  }
}

async function googleLogin(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    // Fetch user profile from Google UserInfo endpoint
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!googleResponse.ok) {
      return res.status(400).json({ message: "Failed to verify access token with Google" });
    }

    const googleUser = await googleResponse.json();
    const { email, name } = googleUser;

    if (!email) {
      return res.status(400).json({ message: "Email not provided by Google account" });
    }

    // Try to find if user already exists
    let existingUser = await user.findOne({ email });

    if (!existingUser) {
      // Create new user (automatically verify email since it is a verified Google account)
      let username = name ? name.toLowerCase().replace(/[^a-z0-9]/g, "") : "user";
      // Ensure unique username
      let usernameExists = await user.findOne({ username });
      if (usernameExists) {
        username = `${username}${Math.floor(100 + Math.random() * 900)}`;
      }

      const randomPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await user.hashPassword(randomPassword);

      existingUser = new user({
        username,
        email,
        password: hashedPassword,
        isValidOtp: true
      });
      await existingUser.save();
    } else {
      // If user exists but email is not verified, set isValidOtp to true
      if (!existingUser.isValidOtp) {
        existingUser.isValidOtp = true;
        await existingUser.save();
      }
    }

    const jwtToken = await existingUser.jsonWebToken();
    res.cookie("token", jwtToken);
    
    // Remove password from response
    delete existingUser._doc.password;

    return res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: existingUser
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed", error: error.message });
  }
}

export { userRegister, userLogin, userProfile, userLogout, verifyUser, getAllUsers, googleLogin };
