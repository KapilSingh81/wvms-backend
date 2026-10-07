import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { employeeModel } from "./employeeModel.js";
import { adminUserModel } from "./userModel.js";

const istDateTime = (d) =>
  d ? d.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) : null;

export const visitorHistoryModel = sequelize.define(
  "visitor_history",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    visitor_id: { type: DataTypes.INTEGER, allowNull: false },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    check_in_time: { type: DataTypes.DATE, allowNull: false },
    check_out_time: { type: DataTypes.DATE, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
    checked_out_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "visitor_history", freezeTableName: true, timestamps: false }
);

visitorHistoryModel.belongsTo(employeeModel, { foreignKey: "employee_id", as: "employee", constraints: false });
visitorHistoryModel.belongsTo(adminUserModel, { foreignKey: "created_by", as: "created_by_user", constraints: false });
visitorHistoryModel.belongsTo(adminUserModel, { foreignKey: "checked_out_by", as: "checked_out_by_user", constraints: false });
visitorHistoryModel.prototype.toJSON = function () {
  const v = { ...this.get({ plain: true }) };
  v.check_in_time = istDateTime(this.getDataValue("check_in_time"));
  v.check_out_time = istDateTime(this.getDataValue("check_out_time"));
  return v;
};