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

adminUserRouter.post('/create', upload.single('image'), Create);
adminUserRouter.get('/list', List);
adminUserRouter.get('/:id', GetById);
adminUserRouter.put('/update/:id', upload.single('image'), update);
adminUserRouter.delete('/delete/:id', deleteUser);

export default adminUserRouter;