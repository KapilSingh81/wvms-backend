import express from "express";
import Auth from "../middleware/auth.js";
import { EmployeeDDL } from "../controller/commonController.js";

const commonRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Common
 *   description: Common dropdown (DDL) APIs
 */

/**
 * @swagger
 * /api/common/employeeDDL:
 *   get:
 *     summary: Employee dropdown list
 *     description: Returns employees for use in dropdowns (for example, the "Whom to meet" field on the visitor form).
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees for the dropdown
 *       401:
 *         description: Missing or invalid token
 */
commonRouter.get("/employeeDDL", Auth, EmployeeDDL);

export default commonRouter;