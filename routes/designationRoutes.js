import express from 'express';
import { Create, deleteDesignation, List, update } from '../controller/designationController.js';

const designationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Designation
 *   description: Designation master APIs
 */

/**
 * @swagger
 * /api/designation/create:
 *   post:
 *     summary: Create a designation
 *     tags: [Designation]
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
 *                 example: Manager
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Designation created successfully
 *       400:
 *         description: Name is missing or designation already exists
 */
designationRouter.post('/create', Create);

/**
 * @swagger
 * /api/designation/list:
 *   get:
 *     summary: Get all designations
 *     tags: [Designation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of designations (newest first)
 */
designationRouter.get('/list', List);

/**
 * @swagger
 * /api/designation/update/{id}:
 *   put:
 *     summary: Update a designation
 *     tags: [Designation]
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
 *                 example: Senior Manager
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Designation updated successfully
 *       400:
 *         description: Name is missing or already exists
 *       404:
 *         description: Designation not found
 */
designationRouter.put('/update/:id', update);

/**
 * @swagger
 * /api/designation/delete/{id}:
 *   delete:
 *     summary: Delete a designation (soft delete)
 *     tags: [Designation]
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
 *         description: Designation deleted successfully
 *       404:
 *         description: Designation not found
 */
designationRouter.delete('/delete/:id', deleteDesignation);

export default designationRouter;