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
      { url: "https://wvmsapi.wavecorp.in", description: "Server" }, 
      { url: "http://localhost:4000", description: "Local" }  
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AadhaarError: {
          type: "object",
          properties: {
            status: {
              type: "object",
              properties: {
                code: { type: "integer", example: 400 },
                type: { type: "string", example: "error" },
                message: { type: "string", example: "Aadhaar must be 12 digits" },
              },
            },
            message: { type: "string", example: "Aadhaar must be 12 digits" },
            error: { type: "string", nullable: true, example: null },
          },
        },
      },
    },
  }, 
  apis: ["./routes/*.js"], 
};

export const swaggerSpec = swaggerJSDoc(options);