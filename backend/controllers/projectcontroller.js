import { validationResult } from "express-validator";
import project from "../models/project.model.js";
import user from "../models/user.model.js";
import mongoose from "mongoose";

export async function createProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const loggedinUser =await user.findOne({ email: req.user.email });
    if (!loggedinUser) {
        return res.status(404).json({ message: "User not found" });
      }      
    const userId = loggedinUser._id;
    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Project name and user id is required" });
    }
    const newProject = await project.create({
      name,
      users: [userId],
    });
    res.status(201).json({message:"project created successfully" , project:newProject});
  } catch (err){
    console.log(err)
    res.status(400).send(err.message)
  }
}


export async function getAllProjects(req,res){
    try{
        const loggedinUser = await user.findOne({email:req.user.email})
        const allUserProjects = await project.find({users:loggedinUser._id})
        return res.status(200).json({projects:allUserProjects})
    }
    catch(err){
        res.send(400).json({error:err.message()})
    }
}


export async function addUserToProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const loggedinUser =await user.findOne({email:req.user.email})
    const userId = loggedinUser._id

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Valid projectId is required");
    }

    if (!Array.isArray(users) || users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error("Each user must be a valid ObjectId");
    }
    if(!userId){
        throw new Error("User id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error("userId must be of object id type")
    }
    console.log(userId)

    const thatProject = await project.findOne({
      _id: projectId,
      users: userId
    })

    if (!thatProject) {
      throw new Error("Project not found or unauthorized access");
    }

    const updatedProject = await project.findOneAndUpdate(
      { _id: projectId },
      { $addToSet: { users: { $each: users } } },
      { new: true }
    );

    return res.status(200).json({ project: updatedProject });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}


export async function getProjectById(req,res){
  const {projectId} = req.params
  if(!projectId){
    return res.status(400).json({ error: "Project id is required" });
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    return res.status(400).json({ error: "Project id is invalid" });
  }
  try {
    const projectData =await project.findOne({_id:projectId}).populate('users')
    if(!projectData){
      return res.status(404).json({message:"project not found"})
    }
    res.status(200).json({message:"data fetched successfully",project:projectData})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"could not fetch data", error:error.message})
  }
}

