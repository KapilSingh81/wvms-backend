import { designationModel } from "../model/designationModel.js";
import { employeeModel } from "../model/employeeModel.js";
import ResponseService from "../services/httpService.js";

const include = [
    {
        model: designationModel,
        as: "designation",
        attributes: ["id", "name"],
    },
];

const EmployeeDDL = async (req, res) => {
    try {
        const employees = await employeeModel.findAll({
            where: { is_deleted: false, status: true },
            attributes: ["id", "first_name", "last_name"],
            include,
            order: [["first_name", "ASC"]],
        });
        
        const data = employees.map((e) => {
            const fullName = `${e.first_name} ${e.last_name || ""}`.trim();
            const designation = e.designation?.name;
            return {
                id: e.id,
                name: designation ? `${fullName} (${designation})` : fullName,
            };
        });
        return ResponseService.success(res, "Success", data);
    } catch (error) {
        return ResponseService.error(res, error.message);
    }
};

export { EmployeeDDL };