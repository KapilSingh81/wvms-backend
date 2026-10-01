import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { departmentModel } from "./departmentModel.js";
import { designationModel } from "./designationModel.js";

export const employeeModel = sequelize.define(
  "employee_master",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    joining_date: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    department_id: { type: DataTypes.INTEGER, allowNull: false },
    designation_id: { type: DataTypes.INTEGER, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    about: { type: DataTypes.TEXT, allowNull: true },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const file = this.getDataValue("image");
        return file ? `${process.env.BASE_URL}/uploads/employees/${file}` : null;
      },
    },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "employee_master", freezeTableName: true, timestamps: false }
);

employeeModel.belongsTo(departmentModel, { foreignKey: "department_id", as: "department" });
employeeModel.belongsTo(designationModel, { foreignKey: "designation_id", as: "designation" });