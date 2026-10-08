import express from "express";
import Auth from "../middleware/auth.js";
import { fetchData, StartKyc } from "../controller/aadhaarController.js";

const digilockerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Digilocker
 *   description: Digilocker Digital KYC APIs
 */

/**
 * @swagger
 * /api/digilockerKYC/start:
 *   post:
 *     summary: Generate Digilocker Digital KYC token and redirect URL
 *     description: >
 *       Backend adds the provider credentials and returns the provider's response
 *       with the same HTTP status. Frontend should open data.url to start the
 *       Digilocker flow. The session expires after expiry_seconds.
 *     tags:
 *       - Digilocker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - redirectUrl
 *               - aadhaar_number
 *               - mobile_number
 *             properties:
 *               redirectUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL where the user is redirected after the Digilocker flow
 *                 example: "https://yourdomain.com/"
 *               aadhaar_number:
 *                 type: string
 *                 description: 12 digit Aadhaar number
 *                 example: "123456789012"
 *               mobile_number:
 *                 type: string
 *                 description: 10 digit Indian mobile number
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     type:
 *                       type: string
 *                       example: success
 *                     message:
 *                       type: string
 *                       example: Digilocker Digital KYC Token generated successfully.
 *                 message:
 *                   type: string
 *                   example: Digilocker Digital KYC Token generated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     client_id:
 *                       type: string
 *                       format: uuid
 *                       example: 00000000-0000-0000-0000-000000000000
 *                     token:
 *                       type: string
 *                       example: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://provider.example.com/digilocker/start/00000000-0000-0000-0000-000000000000"
 *                     expiry_seconds:
 *                       type: integer
 *                       example: 1800
 *       400:
 *         description: Missing or invalid aadhaar_number, mobile_number or redirectUrl
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       401:
 *         description: Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       422:
 *         description: Provider error, for example scope not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *             example:
 *               status:
 *                 code: 422
 *                 type: error
 *                 message: Scope is not authorized.
 *               message: Scope is not authorized.
 *               error: null
 *       502:
 *         description: Verification service unreachable or returned an invalid response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       504:
 *         description: Verification service timed out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 */
digilockerRouter.post("/start", Auth, StartKyc);

/**
 * @swagger
 * /api/digilockerKYC/fetch:
 *   post:
 *     summary: Fetch Aadhaar data after Digilocker consent
 *     description: >
 *       Call this after the user completes the Digilocker flow and is redirected back.
 *       Backend adds provider credentials and returns the provider's Aadhaar XML data.
 *       If the session has expired, returns 410 and the KYC process must be started again.
 *     tags:
 *       - Digilocker
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - redirectUrl
 *               - aadhaar_number
 *               - mobile_number
 *             properties:
 *               client_id:
 *                 type: string
 *                 format: uuid
 *                 description: client_id returned by /api/digilockerKYC/start
 *                 example: 00000000-0000-0000-0000-000000000000
 *               redirectUrl:
 *                 type: string
 *                 format: uri
 *                 description: Same redirectUrl that was used in /start
 *                 example: "https://yourdomain.com/"
 *               aadhaar_number:
 *                 type: string
 *                 description: 12 digit Aadhaar number
 *                 example: "123456789012"
 *               mobile_number:
 *                 type: string
 *                 description: 10 digit Indian mobile number
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Aadhaar data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerFetchSuccess'
 *       400:
 *         description: Missing or invalid client_id, aadhaar_number, mobile_number or redirectUrl
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       401:
 *         description: Missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       410:
 *         description: Digilocker session expired (provider code 1001), start the process again
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerFetchError'
 *       422:
 *         description: Provider error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       500:
 *         description: Provider error, for example document data not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerFetchError'
 *       502:
 *         description: Verification service unreachable or returned an invalid response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 *       504:
 *         description: Verification service timed out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DigilockerError'
 */
digilockerRouter.post("/fetch", Auth, fetchData);

export default digilockerRouter;