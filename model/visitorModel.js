import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { employeeModel } from "./employeeModel.js";
import { adminUserModel } from "./userModel.js";

const istDate = (d) =>
  d ? d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) : null; 

const istDateTime = (d) =>
  d ? d.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) : null; 

export const visitorModel = sequelize.define(
  "visitor_master",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    company_name: { type: DataTypes.STRING(150), allowNull: true },
    national_id_no: { type: DataTypes.STRING(50), allowNull: false },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      get() {
        const file = this.getDataValue("image");
        return file ? `${process.env.BASE_URL}/uploads/visitors/${file}` : null;
      },
    },
    check_in_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    check_out_time: { type: DataTypes.DATE, allowNull: true },

    // sirf response ke liye, DB mein column nahi banega
    check_in_date: {
      type: DataTypes.VIRTUAL,
      get() { return istDate(this.getDataValue("check_in_time")); },
    },
    check_out_date: {
      type: DataTypes.VIRTUAL,
      get() { return istDate(this.getDataValue("check_out_time")); },
    },

    check_in_time_ist: {
      type: DataTypes.VIRTUAL,
      get() { return istDateTime(this.getDataValue("check_in_time")); },
    },
    check_out_time_ist: {
      type: DataTypes.VIRTUAL,
      get() { return istDateTime(this.getDataValue("check_out_time")); },
    },

    visit_status: { type: DataTypes.STRING(15), allowNull: false, defaultValue: "CHECKED_IN" },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    checked_out_by: { type: DataTypes.INTEGER, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "visitor_master", freezeTableName: true, timestamps: false }
);

visitorModel.belongsTo(employeeModel, { foreignKey: "employee_id", as: "employee" });
visitorModel.belongsTo(adminUserModel, { foreignKey: "created_by", as: "created_by_user", constraints: false });
visitorModel.belongsTo(adminUserModel, { foreignKey: "checked_out_by", as: "checked_out_by_user", constraints: false });