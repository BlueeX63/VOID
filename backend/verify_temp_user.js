import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import user from './models/user.model.js';
import project from './models/project.model.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const email = "testsearch@test.com";
  const username = "testsearch";
  const password = "password123";

  // Check if exists
  let existingUser = await user.findOne({ email });
  if (existingUser) {
    existingUser.isValidOtp = true;
    existingUser.verificationOtp = undefined;
    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(password, salt);
    await existingUser.save();
    console.log(`Updated existing user: ${email} to be verified.`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      username,
      email,
      password: hashedPassword,
      isValidOtp: true
    });
    await newUser.save();
    console.log(`Created new verified user: ${email}`);
  }

  const u = await user.findOne({ email });
  
  // Find projects for this user
  const projects = await project.find({ users: u._id });
  if (projects.length === 0) {
    await project.create({
      name: "PROJECT ALPHA",
      users: [u._id]
    });
    await project.create({
      name: "PROJECT BETA",
      users: [u._id]
    });
    await project.create({
      name: "VOID FRONTEND",
      users: [u._id]
    });
    console.log("Created mock projects: PROJECT ALPHA, PROJECT BETA, VOID FRONTEND");
  }

  await mongoose.disconnect();
  console.log("Disconnected.");
}

run().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
