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

export { userRegister, userLogin, userProfile, userLogout,verifyUser ,getAllUsers};
