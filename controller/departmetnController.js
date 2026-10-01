import { Op } from "sequelize";
import { departmentModel } from "../model/departmentModel.js";
import ResponseService from "../services/httpService.js";

const Create = async (req, res) => {
    try {
        const { name, status } = req.body;
        if (!name || !name.trim()) {
            return ResponseService.badRequest(res, 'Department name is required');
        }

        const checkDept = await departmentModel.findOne({
            where: { name: name.trim(), is_deleted: false },
        });
        if (checkDept) {
            return ResponseService.badRequest(res, 'Department already exist');
        }

        const department = await departmentModel.create({
            name: name.trim(),
            status: status ?? true,
        });
        return ResponseService.created(res,  department, 'Department created successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const List = async (req, res) => {
    try {
        const departments = await departmentModel.findAll({
            where: { is_deleted: false },
            order: [['id', 'DESC']],
        });
        return ResponseService.success(res, 'Success', departments);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return ResponseService.badRequest(res, 'Department id is required');

        const department = await departmentModel.findOne({
            where: { id, is_deleted: false },
        });
        if (!department) return ResponseService.notFound(res, 'Department not found');

        const { name, status } = req.body;
        if (!name || !name.trim()) {
            return ResponseService.badRequest(res, 'Department name is required');
        }

        const duplicate = await departmentModel.findOne({
            where: { name: name.trim(), is_deleted: false, id: { [Op.ne]: id } },
        });
        if (duplicate) {
            return ResponseService.badRequest(res, 'Department name already exist');
        }

        await department.update({
            name: name.trim(),
            status: status ?? department.status,
        });
        return ResponseService.success(res, 'Department updated successfully', department);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return ResponseService.badRequest(res, 'Department id is required');

        const department = await departmentModel.findOne({
            where: { id, is_deleted: false },
        });
        if (!department) return ResponseService.notFound(res, 'Department not found');

        await department.update({ is_deleted: true });
        return ResponseService.success(res, 'Department deleted successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { Create, List, update, deleteDepartment };