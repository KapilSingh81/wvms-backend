import { Op } from "sequelize";
import bcrypt from "bcrypt";
import validator from "validator";
import { employeeModel } from "../model/employeeModel.js";
import { departmentModel } from "../model/departmentModel.js";
import { designationModel } from "../model/designationModel.js";
import ResponseService from "../services/httpService.js";

const include = [
    { model: departmentModel, as: "department", attributes: ["id", "name"] },
    { model: designationModel, as: "designation", attributes: ["id", "name"] },
];
const exclude = { exclude: ["password"] };

const Create = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone, joining_date, gender,
            department_id, designation_id, password, confirm_password, status, about,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !joining_date ||
            !gender || !department_id || !designation_id || !password) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }
        if (password !== confirm_password) {
            return ResponseService.badRequest(res, 'Password and confirm password do not match');
        }

        const exist = await employeeModel.findOne({ where: { email, is_deleted: false } });
        if (exist) return ResponseService.badRequest(res, 'Employee already exist with this email');

        const dept = await departmentModel.findOne({ where: { id: department_id, is_deleted: false } });
        if (!dept) return ResponseService.badRequest(res, 'Invalid department');
        const desig = await designationModel.findOne({ where: { id: designation_id, is_deleted: false } });
        if (!desig) return ResponseService.badRequest(res, 'Invalid designation');

        const hashPwd = await bcrypt.hash(password, 10);

        const employee = await employeeModel.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: email.trim(),
            phone,
            joining_date,
            gender,
            department_id,
            designation_id,
            password: hashPwd,
            status: status ?? true,
            about,
            image: req.file ? req.file.filename : null,
        });

        const data = await employeeModel.findByPk(employee.id, { include, attributes: exclude });
        return ResponseService.created(res,  data, 'Employee created successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const List = async (req, res) => {
    try {
        const employees = await employeeModel.findAll({
            where: { is_deleted: false },
            include,
            attributes: exclude,
            order: [['id', 'DESC']],
        });
        return ResponseService.success(res, 'Success', employees);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const GetById = async (req, res) => {
    try {
        const employee = await employeeModel.findOne({
            where: { id: req.params.id, is_deleted: false },
            include,
            attributes: exclude,
        });
        if (!employee) return ResponseService.notFound(res, 'Employee not found');
        return ResponseService.success(res, 'Success', employee);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeModel.findOne({ where: { id, is_deleted: false } });
        if (!employee) return ResponseService.notFound(res, 'Employee not found');

        const {
            first_name, last_name, email, phone, joining_date, gender,
            department_id, designation_id, password, confirm_password, status, about,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !joining_date ||
            !gender || !department_id || !designation_id) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }

        const duplicate = await employeeModel.findOne({
            where: { email, is_deleted: false, id: { [Op.ne]: id } },
        });
        if (duplicate) return ResponseService.badRequest(res, 'Email already exist');

        const payload = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: email.trim(),
            phone,
            joining_date,
            gender,
            department_id,
            designation_id,
            status: status ?? employee.status,
            about,
        };

        if (password) {
            if (password !== confirm_password) {
                return ResponseService.badRequest(res, 'Password and confirm password do not match');
            }
            payload.password = await bcrypt.hash(password, 10);
        }
        if (req.file) payload.image = req.file.filename;

        await employee.update(payload);

        const data = await employeeModel.findByPk(id, { include, attributes: exclude });
        return ResponseService.success(res, 'Employee updated successfully', data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeModel.findOne({ where: { id: req.params.id, is_deleted: false } });
        if (!employee) return ResponseService.notFound(res, 'Employee not found');

        await employee.update({ is_deleted: true });
        return ResponseService.success(res, 'Employee deleted successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { Create, List, GetById, update, deleteEmployee };