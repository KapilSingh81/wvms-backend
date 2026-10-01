import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { roleModel } from "./roleModel.js";

export const adminUserModel = sequelize.define(
  "user_master",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    username: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "role_master", key: "id" },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      get() {
        const file = this.getDataValue("image");
        return file ? `${process.env.BASE_URL}/uploads/users/${file}` : null;
      },
    },
    address: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "user_master", freezeTableName: true, timestamps: false }
);

adminUserModel.belongsTo(roleModel, { foreignKey: "role_id", as: "role" });
roleModel.hasMany(adminUserModel, { foreignKey: "role_id", as: "users" });