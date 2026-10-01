import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Create, deleteUser, GetById, List, update } from '../controller/userController.js';

const dir = 'uploads/users';
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

const adminUserRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin User
 *   description: Administrator (user) master APIs
 */

/**
 * @swagger
 * /api/admin-user/create:
 *   post:
 *     summary: Create an admin user
 *     tags: [Admin User]
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
 *               - password
 *               - role_id
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
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: boolean
 *                 example: true
 *               address:
 *                 type: string
 *                 example: Noida, Uttar Pradesh
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields, invalid email, duplicate email or username, or invalid role
 */
adminUserRouter.post('/create', upload.single('image'), Create);

/**
 * @swagger
 * /api/admin-user/list:
 *   get:
 *     summary: Get all admin users
 *     tags: [Admin User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with their role (newest first)
 */
adminUserRouter.get('/list', List);

/**
 * @swagger
 * /api/admin-user/{id}:
 *   get:
 *     summary: Get an admin user by id
 *     tags: [Admin User]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
adminUserRouter.get('/:id', GetById);

/**
 * @swagger
 * /api/admin-user/update/{id}:
 *   put:
 *     summary: Update an admin user
 *     description: Password and image are optional. Leave them out to keep the existing values.
 *     tags: [Admin User]
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
 *               - role_id
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
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Only send to change the password
 *               role_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: boolean
 *                 example: true
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Missing fields, invalid email, duplicate email or username, or invalid role
 *       404:
 *         description: User not found
 */
adminUserRouter.put('/update/:id', upload.single('image'), update);

/**
 * @swagger
 * /api/admin-user/delete/{id}:
 *   delete:
 *     summary: Delete an admin user (soft delete)
 *     tags: [Admin User]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
adminUserRouter.delete('/delete/:id', deleteUser);

export default adminUserRouter;