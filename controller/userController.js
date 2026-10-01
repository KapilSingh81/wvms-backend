import { Op } from "sequelize";
import bcrypt from "bcrypt";
import validator from "validator";
import ResponseService from "../services/httpService.js";
import { adminUserModel } from "../model/userModel.js";
import { roleModel } from "../model/roleModel.js";

const include = [
    { model: roleModel, as: "role", attributes: ["id", "name"] },
];
const exclude = { exclude: ["password"] };

const Create = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone, username,
            password, role_id, status, address,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !password || !role_id) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }

        const exist = await adminUserModel.findOne({ where: { email, is_deleted: false } });
        if (exist) return ResponseService.badRequest(res, 'User already exist with this email');

        if (username && username.trim()) {
            const usernameExist = await adminUserModel.findOne({
                where: { username: username.trim(), is_deleted: false },
            });
            if (usernameExist) return ResponseService.badRequest(res, 'Username already exist');
        }

        const role = await roleModel.findOne({ where: { id: role_id, is_deleted: false } });
        if (!role) return ResponseService.badRequest(res, 'Invalid role');

        const hashPwd = await bcrypt.hash(password, 10);

        const user = await adminUserModel.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: email.trim(),
            phone,
            username: username?.trim() || null,
            password: hashPwd,
            role_id,
            status: status ?? true,
            address,
            image: req.file ? req.file.filename : null,
        });

        const data = await adminUserModel.findByPk(user.id, { include, attributes: exclude });
        return ResponseService.created(res, data, 'User created successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const List = async (req, res) => {
    try {
        const users = await adminUserModel.findAll({
            where: { is_deleted: false },
            include,
            attributes: exclude,
            order: [['id', 'DESC']],
        });
        return ResponseService.success(res, 'Success', users);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const GetById = async (req, res) => {
    try {
        const user = await adminUserModel.findOne({
            where: { id: req.params.id, is_deleted: false },
            include,
            attributes: exclude,
        });
        if (!user) return ResponseService.notFound(res, 'User not found');
        return ResponseService.success(res, 'Success', user);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await adminUserModel.findOne({ where: { id, is_deleted: false } });
        if (!user) return ResponseService.notFound(res, 'User not found');

        const {
            first_name, last_name, email, phone, username,
            password, role_id, status, address,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !role_id) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }

        const duplicate = await adminUserModel.findOne({
            where: { email, is_deleted: false, id: { [Op.ne]: id } },
        });
        if (duplicate) return ResponseService.badRequest(res, 'Email already exist');

        if (username && username.trim()) {
            const duplicateUsername = await adminUserModel.findOne({
                where: { username: username.trim(), is_deleted: false, id: { [Op.ne]: id } },
            });
            if (duplicateUsername) return ResponseService.badRequest(res, 'Username already exist');
        }

        const role = await roleModel.findOne({ where: { id: role_id, is_deleted: false } });
        if (!role) return ResponseService.badRequest(res, 'Invalid role');

        const payload = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: email.trim(),
            phone,
            username: username?.trim() || null,
            role_id,
            status: status ?? user.status,
            address,
        };

        if (password) payload.password = await bcrypt.hash(password, 10);
        if (req.file) payload.image = req.file.filename;

        await user.update(payload);

        const data = await adminUserModel.findByPk(id, { include, attributes: exclude });
        return ResponseService.success(res, 'User updated successfully', data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await adminUserModel.findOne({ where: { id: req.params.id, is_deleted: false } });
        if (!user) return ResponseService.notFound(res, 'User not found');

        await user.update({ is_deleted: true });
        return ResponseService.success(res, 'User deleted successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { Create, List, GetById, update, deleteUser };