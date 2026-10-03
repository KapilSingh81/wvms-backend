import express from "express";
import Auth from "../middleware/auth.js";
import { Verify } from "../controller/aadhaarController.js";

const aadhaarRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Aadhaar
 *   description: Aadhaar verification APIs (the backend calls the provider with its own credentials)
 */

/**
 * @swagger
 * /api/aadhaar/verify:
 *   post:
 *     summary: Verify an Aadhaar number
 *     description: >
 *       The frontend sends only the Aadhaar number. The backend adds the provider
 *       credentials and returns the provider's response with the same HTTP status.
 *     tags: [Aadhaar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aadhaar]
 *             properties:
 *               aadhaar:
 *                 type: string
 *                 description: 12 digit Aadhaar number
 *                 example: "123456789012"
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: object
 *                   properties:
 *                     code: { type: integer, example: 200 }
 *                     type: { type: string, example: success }
 *                     message: { type: string, example: Request processed successfully. }
 *                 message:
 *                   type: string
 *                   example: Request processed successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     pan: { type: string, example: CXXXXXXM }
 *                     fullname: { type: string, example: ABxxxxxxxxxx }
 *                     first_name: { type: string }
 *                     middle_name: { type: string }
 *                     last_name: { type: string, example: KUMAR }
 *                     gender: { type: string, example: male }
 *                     aadhaar_number: { type: string, example: 7XXXXXXXX52X }
 *                     dob: { type: string, example: 25/03/1992 }
 *                     city: { type: string, example: Patna }
 *                     state: { type: string, example: Bihar }
 *                     country: { type: string, example: India }
 *       400:
 *         description: Aadhaar number missing or not 12 digits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AadhaarError'
 *       401:
 *         description: Missing or invalid token
 *       422:
 *         description: Provider error, for example scope not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AadhaarError'
 *             example:
 *               status: { code: 422, type: error, message: Scope is not authorized. }
 *               message: Scope is not authorized.
 *               error: null
 *       502:
 *         description: Verification service unreachable or returned an invalid response
 *       504:
 *         description: Verification service timed out
 */
aadhaarRouter.post("/verify", Auth, Verify);

export default aadhaarRouter;