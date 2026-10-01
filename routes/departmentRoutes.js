import express from 'express';
import { Create, deleteDepartment, List, update } from '../controller/departmetnController.js';

const departmentRouter = express.Router();

departmentRouter.post('/create', Create);
departmentRouter.get('/list', List);
departmentRouter.put('/update/:id', update);
departmentRouter.delete('/delete/:id', deleteDepartment);

export default departmentRouter;