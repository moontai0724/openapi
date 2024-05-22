import { type OpenAPIObject } from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, test } from "vitest";

import { OpenAPI } from "../src";

const openapi = new OpenAPI({
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore",
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "http://petstore.swagger.io/v1",
    },
  ],
  components: {
    schemas: {
      Pet: Type.Object({
        id: Type.Integer({
          format: "int64",
        }),
        name: Type.String(),
        tag: Type.Optional(Type.String()),
      }),
      Pets: Type.Array(Type.Ref("#/components/schemas/Pet"), {
        maxItems: 100,
      }),
      Error: Type.Object({
        code: Type.Integer({
          format: "int32",
        }),
        message: Type.String(),
      }),
    },
  },
});

openapi.define(
  "/pets",
  "get",
  {
    query: Type.Object({
      limit: Type.Optional(
        Type.Integer({
          description: "How many items to return at one time (max 100)",
          maximum: 100,
          format: "int32",
        }),
      ),
    }),
    response: Type.Ref("#/components/schemas/Pets"),
  },
  {
    operation: {
      summary: "List all pets",
      operationId: "listPets",
      tags: ["pets"],
    },
    responses: {
      responseOptions: {
        overwrite: {
          description: "A paged array of pets",
          headers: {
            "x-next": {
              description: "A link to the next page of responses",
              schema: {
                type: "string",
              },
            },
          },
        },
      },
      overwrite: {
        default: {
          description: "unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
);

openapi.define(
  "/pets",
  "post",
  {
    body: Type.Ref("#/components/schemas/Pet"),
  },
  {
    operation: {
      summary: "Create a pet",
      operationId: "createPets",
      tags: ["pets"],
    },
    responses: {
      httpCode: 201,
      responseOptions: {
        overwrite: {
          description: "Null response",
        },
      },
      overwrite: {
        default: {
          description: "unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
);

openapi.define(
  "/pets/{petId}",
  "get",
  {
    path: Type.Object({
      petId: Type.String({
        description: "The id of the pet to retrieve",
      }),
    }),
    response: Type.Ref("#/components/schemas/Pet"),
  },
  {
    operation: {
      summary: "Info for a specific pet",
      operationId: "showPetById",
      tags: ["pets"],
    },
    responses: {
      responseOptions: {
        overwrite: {
          description: "Expected response to a valid request",
        },
      },
      overwrite: {
        default: {
          description: "unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
);

const expected = expect.objectContaining({
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore",
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "http://petstore.swagger.io/v1",
    },
  ],
  paths: {
    "/pets": {
      get: {
        summary: "List all pets",
        operationId: "listPets",
        tags: ["pets"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
        ],
        responses: {
          "200": {
            description: "A paged array of pets",
            headers: {
              "x-next": {
                description: "A link to the next page of responses",
                schema: {
                  type: "string",
                },
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pets",
                },
              },
            },
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a pet",
        operationId: "createPets",
        tags: ["pets"],
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Pet",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            description: "Null response",
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/pets/{petId}": {
      get: {
        summary: "Info for a specific pet",
        operationId: "showPetById",
        tags: ["pets"],
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            description: "The id of the pet to retrieve",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "integer",
            format: "int64",
          },
          name: {
            type: "string",
          },
          tag: {
            type: "string",
          },
        },
      },
      Pets: {
        type: "array",
        maxItems: 100,
        items: {
          $ref: "#/components/schemas/Pet",
        },
      },
      Error: {
        type: "object",
        required: ["code", "message"],
        properties: {
          code: {
            type: "integer",
            format: "int32",
          },
          message: {
            type: "string",
          },
        },
      },
    },
  },
} satisfies OpenAPIObject);

test("should match expected", () => {
  expect(JSON.parse(openapi.json())).toMatchObject(expected);
});
