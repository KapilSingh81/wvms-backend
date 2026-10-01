import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { roleModel } from "../model/roleModel.js";
import ResponseService from "../services/httpService.js";
import { adminUserModel } from "../model/userModel.js";

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return ResponseService.badRequest(res, 'Email and password are required');
        }
        if (!validator.isEmail(email)) {
            return ResponseService.badRequest(res, 'Please enter a valid email');
        }

        const isUser = await adminUserModel.findOne({
            where: { email: email.trim(), is_deleted: false },
            include: [
                { model: roleModel, as: "role", attributes: ["id", "name"] },
            ],
        });

        if (!isUser) return ResponseService.badRequest(res, 'Invalid email or password');

        if (!isUser.status) {
            return ResponseService.badRequest(res, 'Your account is inactive, contact admin');
        }

        const isMatch = await bcrypt.compare(password, isUser.password);
        if (!isMatch) return ResponseService.badRequest(res, 'Invalid email or password');

        const token = jwt.sign(
            { id: isUser.id, email: isUser.email, role_id: isUser.role_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        const user = isUser.toJSON();
        delete user.password;
        delete user.role_id;

        return ResponseService.success(res, 'Login successfully', { user, token });
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { Login };