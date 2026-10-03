import { Op } from "sequelize";
import validator from "validator";
import { visitorModel } from "../model/visitorModel.js";
import { employeeModel } from "../model/employeeModel.js";
import { departmentModel } from "../model/departmentModel.js";
import { adminUserModel } from "../model/userModel.js";
import ResponseService from "../services/httpService.js";

const operatorAttrs = ["id", "first_name", "last_name", "username"];

const include = [
    {
        model: employeeModel,
        as: "employee",
        attributes: ["id", "first_name", "last_name"],
        include: [{ model: departmentModel, as: "department", attributes: ["id", "name"] }],
    },
    { model: adminUserModel, as: "created_by_user", attributes: operatorAttrs },
    { model: adminUserModel, as: "checked_out_by_user", attributes: operatorAttrs },
];

const duplicateField = (exist, email, phone) =>
    exist.email.toLowerCase() === email ? "Email" :
        exist.phone === phone ? "Phone number" : "National ID";

const Create = async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone, gender, company_name,
            national_id_no, employee_id, purpose, address,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !gender ||
            !national_id_no || !employee_id || !purpose) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }
        if (!validator.isNumeric(phone)) {
            return ResponseService.badRequest(res, 'Phone must be digits only (with country code, without +)');
        }
        if (!req.file) return ResponseService.badRequest(res, 'Visitor image is required');

        const emailClean = email.trim().toLowerCase();
        const phoneClean = phone.trim();
        const nationalIdClean = national_id_no.trim();

        const exist = await visitorModel.findOne({
            where: {
                is_deleted: false,
                [Op.or]: [
                    { email: emailClean },
                    { phone: phoneClean },
                    { national_id_no: nationalIdClean },
                ],
            },
        });
        if (exist) {
            return ResponseService.badRequest(
                res,
                `Visitor already exist with this ${duplicateField(exist, emailClean, phoneClean)}`
            );
        }

        const emp = await employeeModel.findOne({ where: { id: employee_id, is_deleted: false } });
        if (!emp) return ResponseService.badRequest(res, 'Invalid employee');

        const visitor = await visitorModel.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: emailClean,
            phone: phoneClean,
            gender,
            company_name,
            national_id_no: nationalIdClean,
            employee_id,
            purpose,
            address,
            image: req.file.filename,
            check_in_time: new Date(), 
            visit_status: "CHECKED_IN",
            created_by: req.user.id,
        });

        const data = await visitorModel.findByPk(visitor.id, { include });
        return ResponseService.created(res, 'Visitor checked in successfully', data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const List = async (req, res) => {
    try {
        const where = { is_deleted: false };
        if (req.query.status) where.visit_status = req.query.status.toUpperCase();

        const visitors = await visitorModel.findAll({
            where,
            include,
            order: [['id', 'DESC']],
        });
        return ResponseService.success(res, 'Success', visitors);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const Search = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        if (q.length < 3) {
            return ResponseService.badRequest(res, 'Enter phone or national id');
        }

        const visits = await visitorModel.findAll({
            where: {
                is_deleted: false,
                [Op.or]: [{ phone: q }, { national_id_no: q }],
            },
            include,
            order: [['id', 'DESC']],
        });

        if (!visits.length) return ResponseService.notFound(res, 'No previous visitor found');

        return ResponseService.success(res, 'Success', {
            visitor: visits[0],
            total_visits: visits.length,
            is_currently_checked_in: visits[0].visit_status === "CHECKED_IN",
            history: visits,
        });
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const GetById = async (req, res) => {
    try {
        const visitor = await visitorModel.findOne({
            where: { id: req.params.id, is_deleted: false },
            include,
        });
        if (!visitor) return ResponseService.notFound(res, 'Visitor not found');
        return ResponseService.success(res, 'Success', visitor);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const update = async (req, res) => {
    try {
        const visitor = await visitorModel.findOne({
            where: { id: req.params.id, is_deleted: false },
        });
        if (!visitor) return ResponseService.notFound(res, 'Visitor not found');

        const {
            first_name, last_name, email, phone, gender, company_name,
            national_id_no, employee_id, purpose, address,
        } = req.body;

        if (!first_name || !last_name || !email || !phone || !gender ||
            !national_id_no || !employee_id || !purpose) {
            return ResponseService.badRequest(res, 'Required fields are missing');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }
        if (!validator.isNumeric(phone)) {
            return ResponseService.badRequest(res, 'Phone must be digits only (with country code, without +)');
        }

        const emailClean = email.trim().toLowerCase();
        const phoneClean = phone.trim();
        const nationalIdClean = national_id_no.trim();

        const duplicate = await visitorModel.findOne({
            where: {
                is_deleted: false,
                id: { [Op.ne]: visitor.id },
                [Op.or]: [
                    { email: emailClean },
                    { phone: phoneClean },
                    { national_id_no: nationalIdClean },
                ],
            },
        });
        if (duplicate) {
            return ResponseService.badRequest(
                res,
                `Another visitor already exist with this ${duplicateField(duplicate, emailClean, phoneClean)}`
            );
        }

        const emp = await employeeModel.findOne({ where: { id: employee_id, is_deleted: false } });
        if (!emp) return ResponseService.badRequest(res, 'Invalid employee');

        const payload = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: emailClean,
            phone: phoneClean,
            gender,
            company_name,
            national_id_no: nationalIdClean,
            employee_id,
            purpose,
            address,
        };
        if (req.file) payload.image = req.file.filename;

        await visitor.update(payload);

        const data = await visitorModel.findByPk(visitor.id, { include });
        return ResponseService.success(res, 'Visitor updated successfully', data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const Checkout = async (req, res) => {
    try {
        const visitor = await visitorModel.findOne({
            where: { id: req.params.id, is_deleted: false },
        });
        if (!visitor) return ResponseService.notFound(res, 'Visitor not found');

        if (visitor.visit_status === "CHECKED_OUT") {
            return ResponseService.badRequest(res, 'Visitor already checked out');
        }

        await visitor.update({
            check_out_time: new Date(),
            visit_status: "CHECKED_OUT",
            checked_out_by: req.user.id,
        });

        const data = await visitorModel.findByPk(visitor.id, { include });
        return ResponseService.success(res, 'Visitor checked out successfully', data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

const deleteVisitor = async (req, res) => {
    try {
        const visitor = await visitorModel.findOne({
            where: { id: req.params.id, is_deleted: false },
        });
        if (!visitor) return ResponseService.notFound(res, 'Visitor not found');

        await visitor.update({ is_deleted: true });
        return ResponseService.success(res, 'Visitor deleted successfully');
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { Create, List, Search, GetById, update, Checkout, deleteVisitor };