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

employeeRouter.post('/create', upload.single('image'), Create);
employeeRouter.get('/list', List);
employeeRouter.get('/:id', GetById);
employeeRouter.put('/update/:id', upload.single('image'), update);
employeeRouter.delete('/delete/:id', deleteEmployee);

export default employeeRouter;