import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.config.js";
import departmentRouter from "./routes/departmentRoutes.js";
import designationRouter from "./routes/designationRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import userRouter from "./routes/authRoutes.js";
import roleRouter from "./routes/roleRoutes.js";
import adminUserRouter from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";
import visitorRouter from "./routes/visitorRoutes.js";
import commonRouter from "./routes/commonRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/department", departmentRouter);
app.use("/api/designation", designationRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/employee", employeeRouter);
app.use("/api/auth", userRouter);
app.use('/api/role', roleRouter);
app.use("/api/user", adminUserRouter);
app.use("/api/visitor", visitorRouter);
app.use("/api/common", commonRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => res.send("Api is working"));

const PORT = process.env.PORT || 4000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Api is listening on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ DB Error:", err.message);
        process.exit(1);
    });