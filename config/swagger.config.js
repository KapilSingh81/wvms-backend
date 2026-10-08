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
      { url: "https://wvmsapi.wavecorp.in", description: "Production Server" },
      { url: "http://localhost:4000", description: "Local Server" },
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
        DigilockerError: {
          type: "object",
          properties: {
            status: {
              type: "object",
              properties: {
                code: { type: "integer", example: 422 },
                type: { type: "string", example: "error" },
                message: { type: "string", example: "Scope is not authorized." },
              },
            },
            message: { type: "string", example: "Scope is not authorized." },
            error: { type: "object", nullable: true, example: null },
          },
        },

        // Digilocker fetch success
        DigilockerFetchSuccess: {
          type: "object",
          properties: {
            status: {
              type: "object",
              properties: {
                code: { type: "integer", example: 200 },
                type: { type: "string", example: "success" },
                message: { type: "string", example: "Digilocker URL generated successfully." },
              },
            },
            message: { type: "string", example: "Success" },
            data: {
              type: "object",
              properties: {
                client_id: { type: "string", format: "uuid", example: "00000000-0000-0000-0000-000000000000" },
                digilocker_metadata: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Full Name" },
                    gender: { type: "string", example: "M" },
                    dob: { type: "string", example: "DD-MM-YYYY" },
                  },
                },
                aadhaar_xml_data: {
                  type: "object",
                  properties: {
                    full_name: { type: "string", example: "Full Name" },
                    care_of: { type: "string", example: "S/O: Father Name" },
                    dob: { type: "string", example: "DD-MM-YYYY" },
                    zip: { type: "string", example: "000000" },
                    gender: { type: "string", example: "M" },
                    masked_aadhaar: { type: "string", example: "xxxxxxxx0000" },
                    full_address: { type: "string", example: "House, Village, District, State, 000000" },
                    profile_image: { type: "string", description: "Base64 encoded JPEG" },
                    address: {
                      type: "object",
                      properties: {
                        country: { type: "string", example: "India" },
                        dist: { type: "string", example: "District" },
                        state: { type: "string", example: "State" },
                        po: { type: "string", example: "Post Office" },
                        subdist: { type: "string", example: "Sub District" },
                        vtc: { type: "string", example: "Village/Town/City" },
                      },
                    },
                  },
                },
                xml_url: { type: "string", nullable: true, example: null },
              },
            },
            status_code: { type: "integer", example: 200 },
            success: { type: "boolean", example: true },
            message_code: { type: "string", example: "success" },
          },
        },

        // Digilocker fetch error (410 session expired, 500 document not found)
        DigilockerFetchError: {
          type: "object",
          properties: {
            status: {
              type: "object",
              properties: {
                code: { type: "integer", example: 500 },
                type: { type: "string", example: "error" },
                message: { type: "string", example: "Document data not found" },
              },
            },
            message: { type: "string", example: "Document data not found" },
            error: {
              type: "object",
              properties: {
                request_id: { type: "string" },
                transaction_id: { type: "string" },
                reference_id: { type: "string" },
                status: { type: "integer", example: 200 },
                data: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "1001" },
                    message: { type: "string", example: "Session Expired. Please start the process again." },
                    transaction_id: { type: "string" },
                  },
                },
                timestamp: { type: "integer" },
                path: { type: "string", example: "/digilocker/issued-files" },
              },
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);