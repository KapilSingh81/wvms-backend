import express from "express";
import { Login } from "../controller/authController.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns user and JWT token
 *       400:
 *         description: Invalid credentials or missing fields
 */
userRouter.post("/login", Login);

export default userRouter;