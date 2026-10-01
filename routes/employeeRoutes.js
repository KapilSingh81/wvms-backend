import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Create, deleteEmployee, GetById, List, update } from '../controller/employeeController.js';

const dir = 'uploads/employees';
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`),
});
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) =>
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed')),
});

const employeeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee master APIs
 */

/**
 * @swagger
 * /api/employee/create:
 *   post:
 *     summary: Create an employee
 *     tags: [Employee]
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
 *               - email
 *               - phone
 *               - joining_date
 *               - gender
 *               - department_id
 *               - designation_id
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               joining_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-10-01
 *               gender:
 *                 type: string
 *                 example: Male
 *               department_id:
 *                 type: integer
 *                 example: 1
 *               designation_id:
 *                 type: integer
 *                 example: 1
 *               password:
 *                 type: string
 *                 example: "123456"
 *               confirm_password:
 *                 type: string
 *                 example: "123456"
 *               status:
 *                 type: boolean
 *                 example: true
 *               about:
 *                 type: string
 *                 example: Short note about the employee
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Missing fields, invalid email, password mismatch, duplicate email, or invalid department/designation
 */
employeeRouter.post('/create', upload.single('image'), Create);

/**
 * @swagger
 * /api/employee/list:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees with department and designation (newest first)
 */
employeeRouter.get('/list', List);

/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Get an employee by id
 *     tags: [Employee]
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
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
employeeRouter.get('/:id', GetById);

/**
 * @swagger
 * /api/employee/update/{id}:
 *   put:
 *     summary: Update an employee
 *     description: Password and image are optional. Leave them out to keep the existing values.
 *     tags: [Employee]
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
 *               - email
 *               - phone
 *               - joining_date
 *               - gender
 *               - department_id
 *               - designation_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               joining_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-10-01
 *               gender:
 *                 type: string
 *                 example: Male
 *               department_id:
 *                 type: integer
 *                 example: 1
 *               designation_id:
 *                 type: integer
 *                 example: 1
 *               password:
 *                 type: string
 *                 description: Only send to change the password
 *               confirm_password:
 *                 type: string
 *                 description: Required only when password is sent
 *               status:
 *                 type: boolean
 *                 example: true
 *               about:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Missing fields, invalid email, duplicate email, or password mismatch
 *       404:
 *         description: Employee not found
 */
employeeRouter.put('/update/:id', upload.single('image'), update);

/**
 * @swagger
 * /api/employee/delete/{id}:
 *   delete:
 *     summary: Delete an employee (soft delete)
 *     tags: [Employee]
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
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
employeeRouter.delete('/delete/:id', deleteEmployee);

export default employeeRouter;