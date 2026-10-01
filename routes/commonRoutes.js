import express from "express";
import Auth from "../middleware/auth.js";
import { EmployeeDDL } from "../controller/commonController.js";

const commonRouter = express.Router();

commonRouter.get("/employeeDDL",Auth, EmployeeDDL);

export default commonRouter;