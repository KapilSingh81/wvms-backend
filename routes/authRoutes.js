import express from "express";
import { Login } from "../controller/authController.js";


const userRouter = express.Router();

userRouter.post('/login', Login);

export default userRouter;