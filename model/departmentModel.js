import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const departmentModel = sequelize.define(
  "department_master",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "department_master",
    freezeTableName: true,
    timestamps: false,
  }
);