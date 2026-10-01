import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const designationModel = sequelize.define(
  "designation_master",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "designation_master", freezeTableName: true, timestamps: false }
);