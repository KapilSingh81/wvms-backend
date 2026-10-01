import { employeeModel } from "../model/employeeModel.js";
import ResponseService from "../services/httpService.js";

const EmployeeDDL = async (req, res) => {
    try {
        const employees = await employeeModel.findAll({
            where: { is_deleted: false, status: true },
            attributes: ["id", "first_name", "last_name"],
            order: [["first_name", "ASC"]],
        });

        const data = employees.map((e) => ({
            id: e.id,
            name: `${e.first_name} ${e.last_name || ""}`.trim(),
        }));

        return ResponseService.success(res, "Success", data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { EmployeeDDL };