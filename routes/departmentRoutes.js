import express from 'express';
import { Create, deleteDepartment, List, update } from '../controller/departmetnController.js';
import Auth from '../middleware/auth.js';

const departmentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Department
 *   description: Department master APIs
 */

/**
 * @swagger
 * /api/department/create:
 *   post:
 *     summary: Create a department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Human Resources
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Name is missing or department already exists
 */
departmentRouter.post('/create', Auth, Create);

/**
 * @swagger
 * /api/department/list:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments (newest first)
 */
departmentRouter.get('/list', Auth, List);

/**
 * @swagger
 * /api/department/update/{id}:
 *   put:
 *     summary: Update a department
 *     tags: [Department]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Finance
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Name is missing or already exists
 *       404:
 *         description: Department not found
 */
departmentRouter.put('/update/:id', Auth, update);

/**
 * @swagger
 * /api/department/delete/{id}:
 *   delete:
 *     summary: Delete a department (soft delete)
 *     tags: [Department]
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
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
departmentRouter.delete('/delete/:id', Auth, deleteDepartment);

export default departmentRouter;