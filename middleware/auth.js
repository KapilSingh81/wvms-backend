import jwt from "jsonwebtoken";
import { employeeModel } from "../model/employeeModel.js";
import ResponseService from "../services/httpService.js";

const Auth = async (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        if (!header) {
            return ResponseService.unauthorized(res, "Unauthorized - Please login again");
        }
        const token = header.startsWith("Bearer ") ? header.slice(7) : header;

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return ResponseService.unauthorized(
                res,
                err.name === "TokenExpiredError"
                    ? "Session expired - Please login again"
                    : "Unauthorized - Invalid token"
            );
        }

        const user = await employeeModel.findOne({
            where: { id: decoded.id, is_deleted: false },
            attributes: { exclude: ["password"] },
        });
        if (!user) return ResponseService.unauthorized(res, "User not found");
        if (!user.status) {
            return ResponseService.unauthorized(res, "Your account is inactive, contact admin");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return ResponseService.error(res, error.message);
    }
};

export default Auth;