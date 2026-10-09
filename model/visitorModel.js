import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { employeeModel } from "./employeeModel.js";
import { adminUserModel } from "./userModel.js";
import { visitorHistoryModel } from "./visitorHistoryModel.js";
import { decrypt, encrypt, maskId } from "../services/crypto.js";


const istDateTime = (d) =>
  d ? d.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) : null;

export const visitorModel = sequelize.define(
  "visitor_master",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    first_name: {
      type: DataTypes.STRING(500), allowNull: false,
      get() { return decrypt(this.getDataValue('first_name')); },
      set(v) { this.setDataValue('first_name', encrypt(v)); },
    },
    last_name: {
      type: DataTypes.STRING(500), allowNull: false,
      get() { return decrypt(this.getDataValue('last_name')); },
      set(v) { this.setDataValue('last_name', encrypt(v)); },
    },
    email: { type: DataTypes.STRING(150), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    gender: { type: DataTypes.STRING(10), allowNull: false },
    company_name: { type: DataTypes.STRING(150), allowNull: true },
    national_id_no: {
      type: DataTypes.STRING(500), allowNull: false,
      get() { return maskId(decrypt(this.getDataValue('national_id_no'))); }, // ********9012
      set(v) { this.setDataValue('national_id_no', encrypt(v)); },
    },
    national_id_hash: { type: DataTypes.STRING(64), allowNull: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    purpose: { type: DataTypes.TEXT, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    image: {
      type: DataTypes.STRING(500), allowNull: false,
      get() {
        const file = decrypt(this.getDataValue('image'));
        return file ? `${process.env.BASE_URL}/uploads/visitors/${file}` : null;
      },
      set(v) { this.setDataValue('image', encrypt(v)); },
    },
    check_in_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    check_out_time: { type: DataTypes.DATE, allowNull: true },
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
visitorModel.hasMany(visitorHistoryModel, { foreignKey: "visitor_id", as: "history", constraints: false });

visitorModel.prototype.toJSON = function () {
  const v = { ...this.get({ plain: true }) };
  v.check_in_time = istDateTime(this.getDataValue("check_in_time"));
  v.check_out_time = istDateTime(this.getDataValue("check_out_time"));
  if (this.history) v.history = this.history.map((h) => h.toJSON());
  return v;
};