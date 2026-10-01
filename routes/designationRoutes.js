import express from 'express';
import { Create, deleteDesignation, List, update } from '../controller/designationController.js';

const designationRouter = express.Router();

designationRouter.post('/create', Create);
designationRouter.get('/list', List);
designationRouter.put('/update/:id', update);
designationRouter.delete('/delete/:id', deleteDesignation);

export default designationRouter;