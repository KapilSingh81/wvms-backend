import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    Checkout, Create, deleteVisitor, GetById, List, Search, update,
} from '../controller/visitorController.js';

const dir = 'uploads/visitors';
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`),
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) =>
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed')),
});

const visitorRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Visitor
 *   description: Visitor check-in / check-out APIs
 */

/**
 * @swagger
 * /api/visitor/create:
 *   post:
 *     summary: Check in a visitor
 *     description: >
 *       Creates a visit and checks the visitor in automatically.
 *       If no image is uploaded, send previous_visitor_id to reuse the image from an earlier visit.
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *               - gender
 *               - national_id_no
 *               - employee_id
 *               - purpose
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Rahul
 *               last_name:
 *                 type: string
 *                 example: Sharma
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               phone:
 *                 type: string
 *                 description: Digits only, with country code, without +
 *                 example: "919876543210"
 *               gender:
 *                 type: string
 *                 example: Male
 *               company_name:
 *                 type: string
 *                 example: ABC Pvt Ltd
 *               national_id_no:
 *                 type: string
 *                 example: "123456789012"
 *               employee_id:
 *                 type: integer
 *                 description: Employee being visited
 *                 example: 1
 *               purpose:
 *                 type: string
 *                 example: Business meeting
 *               address:
 *                 type: string
 *                 example: Noida, Uttar Pradesh
 *               previous_visitor_id:
 *                 type: integer
 *                 description: Reuse the image from this earlier visit when no new image is sent
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Visitor checked in successfully
 *       400:
 *         description: Missing fields, invalid phone/email, missing image, invalid employee, or visitor already checked in
 */
visitorRouter.post('/create', upload.single('image'), Create);

/**
 * @swagger
 * /api/visitor/list:
 *   get:
 *     summary: Get all visitors
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [CHECKED_IN, CHECKED_OUT]
 *         description: Filter by visit status
 *     responses:
 *       200:
 *         description: List of visitors with employee and department (newest first)
 */
visitorRouter.get('/list', List);

/**
 * @swagger
 * /api/visitor/search:
 *   get:
 *     summary: Search previous visits by phone or national id
 *     description: Returns the latest visit (for form prefill), total visits, current check-in state, and full history.
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: Phone number or national id (exact match)
 *         example: "919876543210"
 *     responses:
 *       200:
 *         description: Visitor found
 *       400:
 *         description: Search text is shorter than 3 characters
 *       404:
 *         description: No previous visitor found
 */
visitorRouter.get('/search', Search);

/**
 * @swagger
 * /api/visitor/checkout/{id}:
 *   put:
 *     summary: Check out a visitor
 *     description: Used by the "Enter Visitor ID" + CheckOut button in the top bar.
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Visitor checked out successfully
 *       400:
 *         description: Visitor already checked out
 *       404:
 *         description: Visitor not found
 */
visitorRouter.put('/checkout/:id', Checkout);

/**
 * @swagger
 * /api/visitor/{id}:
 *   get:
 *     summary: Get a visitor by id
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Visitor details
 *       404:
 *         description: Visitor not found
 */
visitorRouter.get('/:id', GetById);

/**
 * @swagger
 * /api/visitor/update/{id}:
 *   put:
 *     summary: Update a visitor
 *     description: Image is optional. Check-in and check-out times are not changed by this endpoint.
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *               - gender
 *               - national_id_no
 *               - employee_id
 *               - purpose
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Rahul
 *               last_name:
 *                 type: string
 *                 example: Sharma
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               phone:
 *                 type: string
 *                 example: "919876543210"
 *               gender:
 *                 type: string
 *                 example: Male
 *               company_name:
 *                 type: string
 *               national_id_no:
 *                 type: string
 *                 example: "123456789012"
 *               employee_id:
 *                 type: integer
 *                 example: 1
 *               purpose:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Visitor updated successfully
 *       400:
 *         description: Missing fields, invalid phone/email, or invalid employee
 *       404:
 *         description: Visitor not found
 */
visitorRouter.put('/update/:id', upload.single('image'), update);

/**
 * @swagger
 * /api/visitor/delete/{id}:
 *   delete:
 *     summary: Delete a visitor (soft delete)
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Visitor deleted successfully
 *       404:
 *         description: Visitor not found
 */
visitorRouter.delete('/delete/:id', deleteVisitor);

export default visitorRouter;