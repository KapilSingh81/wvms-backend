import express from "express";
import { dashboardData } from "../controller/dashboardController.js";
import Auth from "../middleware/auth.js";

const dashboardRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and visitor list APIs
 */

/**
 * @swagger
 * /api/dashboard/data:
 *   get:
 *     summary: Get dashboard summary and visitor list
 *     description: >
 *       Returns summary counts (employees, visitors, check-in, check-out, still inside)
 *       for the given date-time range, plus the visitor list.
 *       Summary counts always cover the full range. The `type` param only filters the visitors list.
 *       A visitor is included if their check-in OR check-out time falls inside the range.
 *       If from_date and to_date are not sent, today is used.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           Start of range. Formats: YYYY-MM-DD, YYYY-MM-DDTHH:mm, YYYY-MM-DDTHH:mm:ss,
 *           optionally with timezone (Z or +05:30). Date only means 00:00:00.
 *         example: "2026-10-01T09:00"
 *       - in: query
 *         name: to_date
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           End of range, same formats as from_date. Date only means 23:59:59.999.
 *         example: "2026-10-02T18:30"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [total, checked_in, checked_out, still_inside]
 *           default: total
 *         description: >
 *           Filters the visitors list only.
 *           total = all visitors in range,
 *           checked_in = check-in happened in range,
 *           checked_out = check-out happened in range,
 *           still_inside = currently CHECKED_IN.
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     filters:
 *                       type: object
 *                       properties:
 *                         from_date:
 *                           type: string
 *                           example: "2026-10-01T09:00"
 *                         to_date:
 *                           type: string
 *                           example: "2026-10-02T18:30"
 *                         type:
 *                           type: string
 *                           example: total
 *                         from:
 *                           type: string
 *                           description: Range start applied by server (UTC)
 *                         to:
 *                           type: string
 *                           description: Range end applied by server (UTC)
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_employees:
 *                           type: integer
 *                           example: 12
 *                         total_visitors:
 *                           type: integer
 *                           example: 8
 *                         checked_in:
 *                           type: integer
 *                           example: 6
 *                         checked_out:
 *                           type: integer
 *                           example: 5
 *                         still_inside:
 *                           type: integer
 *                           example: 3
 *                     visitors:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid date format, from_date after to_date, or invalid type
 *       401:
 *         description: Unauthorized, token missing, invalid, or expired
 */
dashboardRouter.get("/data", Auth, dashboardData);

export default dashboardRouter;