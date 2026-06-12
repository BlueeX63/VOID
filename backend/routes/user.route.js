import express from "express";
import { body } from "express-validator";
import { userRegister, userLogin, userProfile, userLogout, verifyUser, getAllUsers } from "../controllers/authcontroller.js";
import * as authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().trim().withMessage("Email must be correct"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters long"),
  userRegister
);
router.post('/verify',verifyUser);

router.post("/login",
body("email").isEmail().trim().withMessage("Email must be correct"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("password must be at least 3 characters long"),
  userLogin)


router.get('/profile',authMiddleware.authUser,userProfile)  

router.get('/logout',authMiddleware.authUser,userLogout)

router.get('/all',authMiddleware.authUser,getAllUsers)



export default router;
