import type {
  RequestBodyObject,
  SchemaObject,
} from "@moontai0724/openapi-types";
import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { transformRequestBody } from ".";

const schema: SchemaObject = Type.Object({
  name: Type.String(),
  age: Type.Optional(Type.Integer({ format: "int32", minimum: 0 })),
  email: Type.Optional(Type.String({ format: "email" })),
  valid: Type.Optional(Type.Boolean({ default: true })),
  permissions: Type.Optional(Type.Array(Type.String())),
});

const expected: RequestBodyObject = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "integer",
            format: "int32",
            minimum: 0,
          },
          email: {
            type: "string",
            format: "email",
          },
          valid: {
            type: "boolean",
            default: true,
          },
          permissions: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
  },
};

it("should be able to transform a schema", () => {
  expect(transformRequestBody(schema)).toEqual(expected);
});
