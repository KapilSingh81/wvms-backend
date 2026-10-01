import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WVMS API",
      version: "1.0.0",
      description: "WVMS backend API documentation",
    },
    servers: [
      { url: "http://localhost:4000", description: "Local" },
      { url: "http://89.116.34.155:4000", description: "Server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], 
};

export const swaggerSpec = swaggerJSDoc(options);