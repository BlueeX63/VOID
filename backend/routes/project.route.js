import express from "express";
import { body } from "express-validator";
import { createProject, getAllProjects , addUserToProject,getProjectById } from "../controllers/projectcontroller.js";
import * as authMiddleware from '../middlewares/auth.middleware.js'
import mongoose from "mongoose";

const router = express.Router();

router.post('/create',authMiddleware.authUser,body('name').isString().withMessage("Name is required"),createProject)
router.get('/all', authMiddleware.authUser,getAllProjects)

router.put('/add-user',authMiddleware.authUser,body('users').isArray().withMessage('users must be an array').bail().custom(((users) => {
    return users.every((id) => mongoose.Types.ObjectId.isValid(String(id)));
  })
),body('projectId').isString().withMessage("projectId must be a string"),addUserToProject)

router.get('/get-project/:projectId',authMiddleware.authUser,getProjectById)

export default router