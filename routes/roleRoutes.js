import express from 'express';
import { Create, deleteRole, List, update } from '../controller/roleController.js';

const roleRouter = express.Router();

roleRouter.post('/create', Create);
roleRouter.get('/list', List);
roleRouter.put('/update/:id', update);
roleRouter.delete('/delete/:id', deleteRole);

export default roleRouter;