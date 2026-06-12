import express from "express";
const router = express.Router();
import { getResult } from "../controllers/aicontroller.js";

router.get("/get-result",getResult);


export default router;