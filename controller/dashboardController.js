import { Op } from "sequelize";
import { employeeModel } from "../model/employeeModel.js";
import { visitorModel } from "../model/visitorModel.js";
import { departmentModel } from "../model/departmentModel.js";
import { adminUserModel } from "../model/userModel.js";
import ResponseService from "../services/httpService.js";
import { parseDateTime, todayStr } from "../services/utils.js";

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

const TYPES = ["total", "checked_in", "checked_out", "still_inside"];

const dashboardData = async (req, res) => {
    try {
        const from_date = req.query.from_date || todayStr();
        const to_date = req.query.to_date || todayStr();
        const type = (req.query.type || "total").toLowerCase();

        if (!TYPES.includes(type)) {
            return ResponseService.badRequest(res, `Invalid type. Use one of: ${TYPES.join(", ")}`);
        }

        const start = parseDateTime(from_date, false);
        const end = parseDateTime(to_date, true);

        if (!start || !end) {
            return ResponseService.badRequest(res, "Invalid date. Use YYYY-MM-DD or YYYY-MM-DDTHH:mm[:ss]");
        }
        if (start > end) {
            return ResponseService.badRequest(res, "from_date cannot be after to_date");
        }

        const range = { [Op.between]: [start, end] };

        const [totalEmployees, visitors] = await Promise.all([
            employeeModel.count({ where: { is_deleted: false, status: true } }),
            visitorModel.findAll({
                where: {
                    is_deleted: false,
                    [Op.or]: [
                        { check_in_time: range },
                        { check_out_time: range },
                    ],
                },
                include,
                order: [["check_in_time", "DESC"]],
            }),
        ]);

        const inRange = (d) => d && d >= start && d <= end;

        const filters = {
            total: (v) => inRange(v.check_in_time) || inRange(v.check_out_time),
            checked_in: (v) => inRange(v.check_in_time),
            checked_out: (v) => inRange(v.check_out_time),
            // checked in within the selected dates and not checked out yet
            still_inside: (v) => v.visit_status === "CHECKED_IN" && inRange(v.check_in_time),
        };

        const count = (key) => visitors.filter(filters[key]).length;

        return ResponseService.success(res, "Success", {
            summary: {
                total_employees: totalEmployees,
                total_visitors: count("total"),
                checked_in: count("checked_in"),
                checked_out: count("checked_out"),
                still_inside: count("still_inside"),
            },
            visitors: visitors.filter(filters[type]),
        });
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { dashboardData };