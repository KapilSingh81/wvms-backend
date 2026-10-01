import express from 'express';
import { Create, deleteRole, List, update } from '../controller/roleController.js';
import Auth from '../middleware/auth.js';

const roleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role master APIs
 */

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     summary: Create a role
 *     tags: [Role]
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
 *                 example: Admin
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Name is missing or role already exists
 */
roleRouter.post('/create', Auth, Create);

/**
 * @swagger
 * /api/role/list:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles (newest first)
 */
roleRouter.get('/list', Auth, List);

/**
 * @swagger
 * /api/role/update/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Role]
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
 *                 example: Super Admin
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Name is missing or already exists
 *       404:
 *         description: Role not found
 */
roleRouter.put('/update/:id', Auth, update);

/**
 * @swagger
 * /api/role/delete/{id}:
 *   delete:
 *     summary: Delete a role (soft delete)
 *     tags: [Role]
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
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
roleRouter.delete('/delete/:id', Auth, deleteRole);

export default roleRouter;